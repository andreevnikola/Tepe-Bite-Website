import "server-only";
import type { Lang } from "@/store/lang";
import { getGroqConfig, type GroqConfig } from "@/lib/chat/config";
import {
  sanitizePageTypes,
  sanitizeStatuses,
  sanitizeTopics,
} from "@/lib/chat/profiles";
import { PlannerOutputSchema, type PlannerOutput } from "@/lib/chat/schemas";
import type { ChatTurn, PlannedQuery, PlannerResult } from "@/lib/chat/types";
import { groqJsonCompletion, type GroqMessage } from "@/lib/chat/groq/client";
import { isProviderError, type GroqErrorKind } from "@/lib/chat/groq/errors";
import { buildPlannerMessages } from "./prompt";
import { deterministicPlan } from "./fallback";

/**
 * Stage 1 of the pipeline: turn a visitor message into a retrieval plan.
 *
 * The planner is the cheapest stage and the least critical one — a mediocre
 * plan still retrieves usable pages, and a missing plan is survivable via
 * `deterministicPlan`. So this module never throws: every provider failure
 * degrades to the deterministic plan and retrieval continues. The stages that
 * *must* be able to fail loudly are retrieval and answering, not this one.
 */

export type RunPlannerInput = {
  message: string;
  history: readonly ChatTurn[];
  uiLang: Lang;
};

/**
 * `PlannedQuery` plus the diagnostic the caller needs to open its circuit
 * breaker. Adding the field here rather than to `types.ts` keeps the shared
 * contract untouched — the value is still assignable to `PlannedQuery`
 * everywhere, and callers that do not care simply never read it.
 */
export type PlannerRun = PlannedQuery & {
  /** Set only when the plan came from the fallback because Groq failed. */
  plannerFailure?: GroqErrorKind;
};

export async function runPlanner({
  message,
  history,
  uiLang,
}: RunPlannerInput): Promise<PlannerRun> {
  const startedAt = Date.now();
  const { config, missing } = getGroqConfig();

  if (!config) {
    // Only variable NAMES are logged — `getGroqConfig` never returns values.
    console.warn(`[chat] planner unconfigured, missing=${missing.join(",")}`);
    return fallbackRun(message, history, uiLang, startedAt, "auth");
  }

  const messages = buildPlannerMessages(message, history, uiLang);

  try {
    const first = await callPlanner(config, messages);
    if (first.output) {
      return {
        plan: normalise(first.output),
        origin: "groq",
        latencyMs: Date.now() - startedAt,
      };
    }

    // Exactly one corrective retry. The model gets told what was wrong rather
    // than being asked the same thing again — a plain repeat of an identical
    // prompt reproduces an identical failure far more often than it fixes it.
    const retryMessages: GroqMessage[] = [
      ...messages,
      { role: "assistant", content: first.raw },
      { role: "user", content: correctionMessage(first.problem) },
    ];

    const second = await callPlanner(config, retryMessages);
    if (second.output) {
      return {
        plan: normalise(second.output),
        origin: "groq_retry",
        latencyMs: Date.now() - startedAt,
      };
    }

    console.warn(`[chat] planner invalid twice, using fallback: ${second.problem}`);
    return fallbackRun(message, history, uiLang, startedAt, "bad_response");
  } catch (err) {
    if (!isProviderError(err)) throw err;

    // Provider failures are never retried here.
    //   auth / quota_daily — a second call cannot succeed and, on a daily
    //     quota, would spend budget we do not have.
    //   rate_limit — an immediate retry deepens the limit we just hit.
    //   timeout / server / network — the request budget is already spent and
    //     the visitor is waiting; the deterministic plan costs microseconds.
    return fallbackRun(message, history, uiLang, startedAt, err.kind);
  }
}

// ─── One attempt ─────────────────────────────────────────────────────────────

type PlannerAttempt = {
  /** Present when the model returned JSON that satisfies the schema. */
  output?: PlannerOutput;
  /** The model's literal output, replayed into the corrective retry. */
  raw: string;
  /** Short description of what was wrong, for the retry and the log. */
  problem: string;
};

async function callPlanner(
  config: GroqConfig,
  messages: GroqMessage[],
): Promise<PlannerAttempt> {
  const { raw, data, parseError } = await groqJsonCompletion<unknown>({
    apiKey: config.apiKey,
    model: config.plannerModel,
    messages,
    temperature: config.plannerTemperature,
    maxCompletionTokens: config.plannerMaxTokens,
    reasoningEffort: config.reasoningEffort,
    timeoutMs: config.timeoutMs,
    label: "planner",
  });

  if (parseError) return { raw, problem: parseError };

  const parsed = PlannerOutputSchema.safeParse(data);
  if (!parsed.success) return { raw, problem: describeIssues(parsed.error.issues) };

  return { output: parsed.data, raw, problem: "" };
}

/** zod issues, flattened to something short enough to put back in the prompt. */
function describeIssues(
  issues: ReadonlyArray<{
    readonly path: ReadonlyArray<PropertyKey>;
    readonly message: string;
  }>,
): string {
  return issues
    .slice(0, 6)
    .map((issue) => {
      const path = issue.path.map(String).join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join("; ")
    .slice(0, 400);
}

function correctionMessage(problem: string): string {
  return [
    "Your previous reply was not a valid plan.",
    `Problem: ${problem}`,
    "Return ONLY the JSON object with exactly the nine required keys, using only the allowed values listed in your instructions. Do not explain the fix.",
  ].join("\n");
}

// ─── Normalisation ───────────────────────────────────────────────────────────

/**
 * Model output is untrusted input even after the schema passes: the schema only
 * checks that the metadata arrays are strings, deliberately, so a single made-up
 * tag does not cost us an otherwise good query. Dropping the invented values
 * happens here, before anything reaches the retriever — an unknown `pagetype`
 * applied as a post-filter would silently match nothing.
 */
function normalise(output: PlannerOutput): PlannerResult {
  return {
    language: output.language,
    intent: output.intent,
    searchQuery: output.searchQuery.trim(),
    pagetypes: sanitizePageTypes(output.pagetypes),
    topics: sanitizeTopics(output.topics),
    statuses: sanitizeStatuses(output.statuses),
    retrievalProfile: output.retrievalProfile,
    requiresMultipleSources: output.requiresMultipleSources,
    allowCrossLanguageFallback: output.allowCrossLanguageFallback,
  };
}

function fallbackRun(
  message: string,
  history: readonly ChatTurn[],
  uiLang: Lang,
  startedAt: number,
  plannerFailure: GroqErrorKind,
): PlannerRun {
  return {
    plan: deterministicPlan(message, history, uiLang),
    origin: "fallback",
    latencyMs: Date.now() - startedAt,
    plannerFailure,
  };
}
