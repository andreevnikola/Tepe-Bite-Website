import { NextResponse, type NextRequest } from "next/server";

import { generateAnswer } from "@/lib/chat/answer";
import { MAX_CARDS } from "@/lib/chat/config";
import { classifyContact } from "@/lib/chat/contact/classify";
import { isProviderError } from "@/lib/chat/groq/errors";
import { getBreakerState, recordFailure, recordSuccess } from "@/lib/chat/health/breaker";
import { runPlanner } from "@/lib/chat/planner";
import { CloudflareSearchError, resolveCards, retrieve } from "@/lib/chat/retrieval";
import { ChatMessageRequestSchema } from "@/lib/chat/schemas";
import type {
  ChatFailureKind,
  ChatMessageErrorResponse,
  ChatMessageResponse,
  ChatSource,
  SourceCard,
} from "@/lib/chat/types";
import { rateLimiter } from "@/lib/rate-limit";

/**
 * The assistant's one conversational endpoint.
 *
 * Order matters here. The circuit breaker is consulted before any provider is
 * called, so a known outage costs one Mongo read instead of two timeouts. The
 * planner never throws — a failed plan degrades to deterministic routing rather
 * than taking the chat down. Retrieval and answering *may* throw, and each
 * failure is classified into the coarse public `ChatFailureKind` the browser is
 * allowed to see: no provider name, status code, model name or error message
 * ever crosses this boundary.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Generous enough for a real conversation, tight enough to bound the quota. */
const RATE_LIMIT = 20;
const RATE_WINDOW_SECONDS = 600;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Provider failure → what the visitor is told. Only quota exhaustion earns the
 * "try again tomorrow" copy; a timeout or a 5xx must never claim the service is
 * gone for the day.
 */
function failureKind(kind: string): ChatFailureKind {
  if (kind === "quota_daily") return "unavailable_today";
  if (kind === "rate_limit") return "rate_limited";
  return "unavailable_temporary";
}

function errorResponse(
  body: ChatMessageErrorResponse,
  status: number,
): NextResponse<ChatMessageErrorResponse> {
  const res = NextResponse.json(body, { status });
  if (body.retryAfterSeconds) {
    res.headers.set("Retry-After", String(Math.ceil(body.retryAfterSeconds)));
  }
  return res;
}

/** Diagnostics for the evaluation harness. Never emitted in production. */
function debugBlock(payload: Record<string, unknown>): Record<string, unknown> {
  return process.env.NODE_ENV === "production" ? {} : { debug: payload };
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ChatMessageResponse | ChatMessageErrorResponse>> {
  const totalStartedAt = Date.now();

  // 1. Rate limit. Process-local, which is fine as a first line of defence —
  //    the real quota protection is the circuit breaker plus the context caps.
  const rl = await rateLimiter.check(
    `chat_message:${getIp(req)}`,
    RATE_LIMIT,
    RATE_WINDOW_SECONDS,
  );
  if (!rl.allowed) {
    return errorResponse(
      {
        ok: false,
        kind: "rate_limited",
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000),
        ),
      },
      429,
    );
  }

  // 2. Parse and validate.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse({ ok: false, kind: "unavailable_temporary" }, 400);
  }
  const parsed = ChatMessageRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse({ ok: false, kind: "unavailable_temporary" }, 422);
  }
  const { message, uiLang, history } = parsed.data;

  // 3. Breaker gate. Retrieval and answer generation are both critical; the
  //    planner is not, so its breaker is deliberately not consulted here.
  for (const provider of ["cloudflare", "groq"] as const) {
    const state = await getBreakerState(provider);
    if (state.open) {
      const retryAfterSeconds = state.openUntil
        ? Math.max(1, Math.ceil((state.openUntil.getTime() - Date.now()) / 1000))
        : undefined;
      return errorResponse(
        {
          ok: false,
          kind: state.scope === "daily" ? "unavailable_today" : "unavailable_temporary",
          retryAfterSeconds,
        },
        503,
      );
    }
  }

  // 4. Plan. Never throws: a provider failure yields the deterministic plan.
  const planned = await runPlanner({ message, history, uiLang });
  if (planned.plannerFailure) {
    // Recorded so a real Groq outage still opens the breaker, even though a
    // failed plan on its own does not block the answer.
    await recordFailure("groq", planned.plannerFailure, {
      retryAfterSeconds: planned.plannerRetryAfterSeconds,
    });
  }
  const plan = planned.plan;

  // 5. Retrieve.
  let sources: ChatSource[] = [];
  let retrievalMs = 0;
  let retrievalStage: string = "none";
  let queries: string[] = [];
  try {
    const retrieved = await retrieve({ plan, userMessage: message });
    sources = retrieved.sources;
    retrievalMs = retrieved.latencyMs;
    retrievalStage = retrieved.stage;
    queries = retrieved.queries;
    await recordSuccess("cloudflare");
  } catch (err) {
    const kind = err instanceof CloudflareSearchError ? err.kind : "network";
    await recordFailure("cloudflare", kind);
    return errorResponse({ ok: false, kind: failureKind(kind) }, 503);
  }

  // 6. No evidence — answer honestly without spending a Groq call. The visitor
  //    gets the escalation path instead of a guess.
  if (sources.length === 0) {
    const contactCategory = classifyContact({ question: message, intent: plan.intent });
    const payload: ChatMessageResponse = {
      ok: true,
      status: "insufficient_evidence",
      answer: "",
      language: plan.language,
      cards: [],
      contactCategory,
      timings: {
        plannerMs: planned.latencyMs,
        retrievalMs,
        answerMs: 0,
        totalMs: Date.now() - totalStartedAt,
      },
    };
    return NextResponse.json({
      ...payload,
      ...debugBlock({
        plan,
        plannerOrigin: planned.origin,
        stage: retrievalStage,
        queries,
        sourceCount: 0,
        tokens: {
          planner: planned.tokens.totalTokens,
          answer: 0,
          total: planned.tokens.totalTokens,
        },
      }),
    });
  }

  // 7. Generate the grounded answer.
  let answerMs = 0;
  let cards: SourceCard[] = [];
  try {
    const { result, latencyMs, tokens, contextChars } = await generateAnswer({
      question: message,
      history,
      language: plan.language,
      profile: plan.retrievalProfile,
      sources,
    });
    answerMs = latencyMs;
    await recordSuccess("groq");

    cards = resolveCards(
      sources,
      result.citedSourceIds,
      result.learnMoreSourceIds,
      plan.language,
      MAX_CARDS,
    );

    const payload: ChatMessageResponse = {
      ok: true,
      status: result.status,
      answer: result.answer,
      language: plan.language,
      cards,
      contactCategory: classifyContact({
        question: message,
        intent: plan.intent,
        modelSuggestion: result.contactCategory,
      }),
      timings: {
        plannerMs: planned.latencyMs,
        retrievalMs,
        answerMs,
        totalMs: Date.now() - totalStartedAt,
      },
    };
    return NextResponse.json({
      ...payload,
      ...debugBlock({
        plan,
        plannerOrigin: planned.origin,
        stage: retrievalStage,
        queries,
        sourceCount: sources.length,
        sourceUrls: sources.map((s) => `${s.id} ${s.url}`),
        confidenceReason: result.confidenceReason,
        contextChars,
        tokens: {
          plannerPrompt: planned.tokens.promptTokens,
          plannerCompletion: planned.tokens.completionTokens,
          planner: planned.tokens.totalTokens,
          answerPrompt: tokens.promptTokens,
          answerCompletion: tokens.completionTokens,
          answer: tokens.totalTokens,
          total: planned.tokens.totalTokens + tokens.totalTokens,
        },
      }),
    });
  } catch (err) {
    const kind = isProviderError(err) ? err.kind : "network";
    // Forward the provider's own reset hint: on a quota failure it is the
    // difference between parking the assistant for the minutes Groq asked for
    // and parking it until midnight UTC.
    await recordFailure("groq", kind, {
      retryAfterSeconds: isProviderError(err) ? err.retryAfterSeconds : undefined,
    });

    // Retrieval worked, so the visitor still gets something trustworthy: the
    // pages we found, and the contact route. We do not invent an answer.
    const fallbackCards = resolveCards(
      sources,
      sources.slice(0, MAX_CARDS).map((s) => s.id),
      [],
      plan.language,
      MAX_CARDS,
    );
    // 200 when we have something to show: this is a degraded answer, not an
    // outage, and the composer must stay enabled so the next question can work.
    return errorResponse(
      {
        ok: false,
        kind: fallbackCards.length > 0 ? "no_answer_but_sources" : failureKind(kind),
        cards: fallbackCards,
        contactCategory: classifyContact({ question: message, intent: plan.intent }),
      },
      fallbackCards.length > 0 ? 200 : 503,
    );
  }
}
