import "server-only";
import type { Lang } from "@/store/lang";
import {
  MAX_CONTEXT_CHARS,
  MAX_CONTEXT_SOURCES,
  getGroqConfig,
  type GroqConfig,
} from "@/lib/chat/config";
import { RETRIEVAL_PROFILE_SETTINGS } from "@/lib/chat/profiles";
import { AnswerOutputSchema, type AnswerOutput } from "@/lib/chat/schemas";
import type {
  AnswerResult,
  ChatSource,
  ChatTurn,
  RetrievalProfileName,
} from "@/lib/chat/types";
import {
  addUsage,
  groqJsonCompletion,
  type GroqMessage,
  type GroqUsage,
} from "@/lib/chat/groq/client";
import { ProviderError } from "@/lib/chat/groq/errors";
import { buildAnswerMessages } from "./prompt";

/**
 * Stage 3 of the pipeline: the grounded answer.
 *
 * Unlike the planner, this stage throws. There is no safe local substitute for
 * a generated answer — anything we could synthesise here would be ungrounded,
 * which is exactly what this feature exists to avoid. The caller catches the
 * `ProviderError` and decides how to degrade (source cards only, "try again
 * later", or the contact-the-team flow); it must never receive an invented
 * answer dressed up as a real one.
 */

export type GenerateAnswerInput = {
  question: string;
  history: readonly ChatTurn[];
  /** Language of the latest visitor message, as decided by the planner. */
  language: Lang;
  /** Decides how much evidence this kind of question is worth paying for. */
  profile: RetrievalProfileName;
  /** Retrieval output, best source first. Trimmed to budget in here. */
  sources: readonly ChatSource[];
};

export type GenerateAnswerOutput = {
  result: AnswerResult;
  latencyMs: number;
  /** Provider-counted cost of this stage, retries included. */
  tokens: GroqUsage;
  /** Characters of source text actually sent, for the token budget report. */
  contextChars: number;
};

export async function generateAnswer({
  question,
  history,
  language,
  profile,
  sources,
}: GenerateAnswerInput): Promise<GenerateAnswerOutput> {
  const startedAt = Date.now();
  const { config, missing } = getGroqConfig();
  if (!config) {
    // Variable NAMES only — `getGroqConfig` never hands back a value.
    throw new ProviderError("auth", `not configured (${missing.join(",")})`);
  }

  const { context, messages, first, contextChars } = await callWithinTokenLimit({
    config,
    question,
    history,
    language,
    profile,
    sources,
  });
  let tokens = first.usage;
  if (first.output) {
    return {
      result: finalise(first.output, context),
      latencyMs: Date.now() - startedAt,
      tokens,
      contextChars,
    };
  }

  // Exactly one corrective retry, same policy as the planner: tell the model
  // what was wrong instead of re-asking an identical question, and spend no
  // more than one extra call on the visitor's latency budget or our quota.
  const retryMessages: GroqMessage[] = [
    ...messages,
    { role: "assistant", content: first.raw },
    { role: "user", content: correctionMessage(first.problem) },
  ];

  const second = await callAnswer(config, retryMessages);
  tokens = addUsage(tokens, second.usage);
  if (second.output) {
    return {
      result: finalise(second.output, context),
      latencyMs: Date.now() - startedAt,
      tokens,
      contextChars,
    };
  }

  // Twice-invalid output is a provider failure from the caller's point of view:
  // there is nothing to render, and inventing a reply here is the one thing
  // this module must never do.
  console.warn(`[chat] answer invalid twice: ${second.problem}`);
  throw new ProviderError("bad_response", "answer failed validation twice");
}

// ─── Fitting the prompt inside the provider's per-minute token allowance ─────

/**
 * Shrinking retry ladder, as fractions of the profile's context budget.
 *
 * A tier whose per-minute token allowance is smaller than one full prompt
 * rejects that prompt forever, not for a while: the same question re-asked in
 * ten minutes is exactly as large. Waiting is therefore the one response that
 * cannot work, and the answer would otherwise be lost for whole classes of
 * question — comparisons, which deliberately retrieve the most sources, are hit
 * first and hardest.
 *
 * So we re-ask immediately with less evidence. There is exactly one rung. Each
 * rung is both a real loss of grounding and a second full prompt charged to the
 * daily allowance, and the profile budgets are now small enough that a rejected
 * prompt is a rare accident rather than the routine cost of a comparison — a
 * ladder of three attempts would spend more on the failure than on the answer.
 * Below the rung the honest outcome is the caller's "here are the sources, ask
 * the team" degradation.
 */
const CONTEXT_RETRY_FRACTIONS = [0.5] as const;

type FittedCall = {
  context: ChatSource[];
  messages: GroqMessage[];
  first: AnswerAttempt;
  /** Source characters that survived trimming — the stage's dominant cost. */
  contextChars: number;
};

async function callWithinTokenLimit({
  config,
  question,
  history,
  language,
  profile,
  sources,
}: GenerateAnswerInput & { config: GroqConfig }): Promise<FittedCall> {
  // The profile decides what this question is worth; `MAX_CONTEXT_CHARS` is the
  // ceiling no profile may exceed.
  const budget0 = Math.min(
    RETRIEVAL_PROFILE_SETTINGS[profile].contextChars,
    MAX_CONTEXT_CHARS,
  );
  const budgets = [
    budget0,
    ...CONTEXT_RETRY_FRACTIONS.map((f) => Math.round(budget0 * f)),
  ];

  let lastError: ProviderError | null = null;

  for (const budget of budgets) {
    const context = trimToContextBudget(sources, budget);
    const messages = buildAnswerMessages({ question, history, language, sources: context });
    const contextChars = context.reduce(
      (sum, source) => sum + source.passages.reduce((n, p) => n + p.length, 0),
      0,
    );
    try {
      return { context, messages, contextChars, first: await callAnswer(config, messages) };
    } catch (err) {
      if (!(err instanceof ProviderError) || err.kind !== "request_too_large") throw err;
      lastError = err;
      // Character counts only approximate tokens (Cyrillic runs ~2.8 chars per
      // token, Latin nearer 4), so the provider — not our arithmetic — is what
      // decides whether a budget fits. Drop a rung and ask again.
      console.warn(`[chat] answer prompt over token limit at ${budget} context chars`);
    }
  }

  throw lastError ?? new ProviderError("request_too_large", "context does not fit");
}

// ─── Context budget ──────────────────────────────────────────────────────────

/**
 * Below this a passage is a fragment rather than evidence, so we would rather
 * leave the budget unspent than hand the model half a sentence.
 */
const MIN_USEFUL_PASSAGE_CHARS = 160;

/**
 * Fit the retrieved sources into the model's context budget while protecting
 * diversity.
 *
 * Naive truncation ("concatenate passages until full") is actively harmful
 * here: retrieval returns chunks best-first, and a single long initiative page
 * can easily produce the top six chunks. The model would then see one page,
 * answer confidently from it, and a comparison question would be answered from
 * a single candidate. Worse, on a free tier we would have spent the whole
 * prompt budget on one page's evidence.
 *
 * So the budget is allocated in two passes: every source first gets an equal
 * share, and only then is whatever is left offered back to the strongest
 * sources in order. Breadth is guaranteed; depth is a bonus.
 */
export function trimToContextBudget(
  sources: readonly ChatSource[],
  maxChars: number = MAX_CONTEXT_CHARS,
): ChatSource[] {
  const selected = sources.slice(0, MAX_CONTEXT_SOURCES);
  if (selected.length === 0) return [];

  const cursors = selected.map(() => 0);
  const taken: string[][] = selected.map(() => []);
  const used = selected.map(() => 0);
  let total = 0;

  /** Pull passages from source `i` until it reaches `limit` or runs out. */
  const fill = (i: number, limit: number): void => {
    const passages = selected[i].passages;
    while (cursors[i] < passages.length && used[i] < limit && total < maxChars) {
      const passage = passages[cursors[i]].replace(/\s+/g, " ").trim();
      cursors[i] += 1;
      if (!passage) continue;

      const room = Math.min(limit - used[i], maxChars - total);
      // Stop rather than append a stub — but always let a source contribute its
      // first passage, so no source is listed with an empty body.
      if (room < MIN_USEFUL_PASSAGE_CHARS && taken[i].length > 0) break;

      const text = passage.length <= room ? passage : clip(passage, room);
      if (!text) break;

      taken[i].push(text);
      used[i] += text.length;
      total += text.length;
    }
  };

  const share = Math.floor(maxChars / selected.length);
  for (let i = 0; i < selected.length; i += 1) fill(i, share);
  // Second pass: the per-source cap is lifted, and the global cap inside `fill`
  // is what actually stops it.
  for (let i = 0; i < selected.length; i += 1) fill(i, maxChars);

  return selected
    .map((source, i) => ({ ...source, passages: taken[i] }))
    .filter((source) => source.passages.length > 0);
}

/** Cut on a word boundary so the model never reads a half-word as a fact. */
function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, Math.max(0, max - 1));
  const lastSpace = head.lastIndexOf(" ");
  const body = (lastSpace > max * 0.6 ? head.slice(0, lastSpace) : head).trimEnd();
  return body ? `${body}…` : "";
}

// ─── One attempt ─────────────────────────────────────────────────────────────

type AnswerAttempt = {
  output?: AnswerOutput;
  /** The model's literal output, replayed into the corrective retry. */
  raw: string;
  problem: string;
  usage: GroqUsage;
};

async function callAnswer(
  config: GroqConfig,
  messages: GroqMessage[],
): Promise<AnswerAttempt> {
  const { raw, data, parseError, usage } = await groqJsonCompletion<unknown>({
    apiKey: config.apiKey,
    model: config.answerModel,
    messages,
    temperature: config.answerTemperature,
    maxCompletionTokens: config.answerMaxTokens,
    reasoningEffort: config.reasoningEffort,
    timeoutMs: config.timeoutMs,
    label: "answer",
  });

  if (parseError) return { raw, problem: parseError, usage };

  const parsed = AnswerOutputSchema.safeParse(data);
  if (!parsed.success) {
    return { raw, problem: describeIssues(parsed.error.issues), usage };
  }

  return { output: parsed.data, raw, problem: "", usage };
}

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
    "Your previous reply was not a valid answer object.",
    `Problem: ${problem}`,
    "Return ONLY the JSON object with the required keys, citing only ids that appear in the sources block. Do not explain the fix.",
  ].join("\n");
}

// ─── Citation defence ────────────────────────────────────────────────────────

/**
 * The last gate before rendering. Ids are the model's only route to a link, so
 * an id it invented (or copied from an earlier turn whose sources are long
 * gone) must not survive: the application would otherwise map it to nothing, or
 * — worse, if ids were ever reused — to the wrong page.
 *
 * If every citation is dropped from an "answered"/"inference" reply, the answer
 * was not actually grounded in what we supplied, whatever the model believed.
 * Downgrading to "insufficient_evidence" is the honest outcome; the caller can
 * still show the retrieved cards.
 */
function finalise(output: AnswerOutput, context: readonly ChatSource[]): AnswerResult {
  const allowed = new Set(context.map((source) => source.id));

  const cited = dedupe(output.citedSourceIds).filter((id) => allowed.has(id));
  const citedSet = new Set(cited);
  const learnMore = dedupe(output.learnMoreSourceIds).filter(
    (id) => allowed.has(id) && !citedSet.has(id),
  );

  const claimsEvidence = output.status === "answered" || output.status === "inference";
  const status = claimsEvidence && cited.length === 0 ? "insufficient_evidence" : output.status;

  if (status !== output.status) {
    console.warn(
      `[chat] answer downgraded ${output.status}→${status}: no valid citations survived`,
    );
  }

  return {
    status,
    answer: output.answer.trim(),
    citedSourceIds: cited,
    learnMoreSourceIds: learnMore,
    ...(output.confidenceReason ? { confidenceReason: output.confidenceReason } : {}),
    ...(output.contactCategory ? { contactCategory: output.contactCategory } : {}),
  };
}

function dedupe(values: readonly string[]): string[] {
  const out: string[] = [];
  for (const value of values) {
    const id = value.trim();
    if (id && !out.includes(id)) out.push(id);
  }
  return out;
}
