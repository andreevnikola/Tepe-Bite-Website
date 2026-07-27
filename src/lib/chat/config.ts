import "server-only";

/**
 * Server-only configuration for the site assistant.
 *
 * Every value here is read from the environment on the server and must never
 * cross to the browser: the Groq key, the Cloudflare token and the account id
 * are secrets, and the model/threshold settings are internal detail. Nothing in
 * this module logs, returns or embeds a secret value — the validators report
 * only which variable is *missing*, never what it contains.
 */

export type GroqConfig = {
  apiKey: string;
  plannerModel: string;
  answerModel: string;
  plannerTemperature: number;
  answerTemperature: number;
  /** Qwen supports `none`; the field is passed through verbatim. */
  reasoningEffort: string;
  plannerMaxTokens: number;
  answerMaxTokens: number;
  timeoutMs: number;
};

export type CloudflareSearchConfig = {
  accountId: string;
  instance: string;
  apiToken: string;
  /** Per-search abort budget. Retrieval is the slowest stage of the pipeline. */
  timeoutMs: number;
};

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Groq settings, or `null` with the list of missing variable NAMES when the
 * provider is not configured. Callers must treat `null` as "chat unavailable",
 * never as a reason to fall back to an ungrounded answer.
 */
export function getGroqConfig(): { config: GroqConfig | null; missing: string[] } {
  const missing: string[] = [];
  const apiKey = process.env.GROQ_API_KEY ?? "";
  if (!apiKey) missing.push("GROQ_API_KEY");

  const plannerModel = process.env.GROQ_PLANNER_MODEL ?? "";
  const answerModel = process.env.GROQ_ANSWER_MODEL ?? "";
  if (!plannerModel) missing.push("GROQ_PLANNER_MODEL");
  if (!answerModel) missing.push("GROQ_ANSWER_MODEL");

  if (missing.length > 0) return { config: null, missing };

  return {
    config: {
      apiKey,
      plannerModel,
      answerModel,
      plannerTemperature: num("GROQ_PLANNER_TEMPERATURE", 0.4),
      answerTemperature: num("GROQ_ANSWER_TEMPERATURE", 0.4),
      reasoningEffort: process.env.GROQ_REASONING_EFFORT || "none",
      // Completion caps, not targets. The planner emits a fixed nine-key object
      // that measures ~120 tokens; the answer prompt asks for two to four
      // sentences, which is ~200 in Bulgarian. Both are set to roughly double
      // the expected output — enough headroom that a legitimately longer answer
      // is never truncated mid-sentence, tight enough that a model that starts
      // rambling is cut off before it costs a second answer's worth of quota.
      plannerMaxTokens: num("GROQ_PLANNER_MAX_TOKENS", 300),
      answerMaxTokens: num("GROQ_ANSWER_MAX_TOKENS", 550),
      timeoutMs: num("GROQ_REQUEST_TIMEOUT_MS", 8000),
    },
    missing,
  };
}

/**
 * Cloudflare AI Search settings, or `null` plus missing variable NAMES.
 * Mirrors `validateCloudflareConfig()` but returns the values the retrieval
 * layer needs, so callers do not read `process.env` themselves.
 */
export function getCloudflareSearchConfig(): {
  config: CloudflareSearchConfig | null;
  missing: string[];
} {
  const missing: string[] = [];
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
  const instance = process.env.CLOUDFLARE_AI_SEARCH_INSTANCE ?? "";
  const apiToken = process.env.CLOUDFLARE_AI_SEARCH_API_TOKEN ?? "";

  if (!accountId) missing.push("CLOUDFLARE_ACCOUNT_ID");
  if (!instance) missing.push("CLOUDFLARE_AI_SEARCH_INSTANCE");
  if (!apiToken) missing.push("CLOUDFLARE_AI_SEARCH_API_TOKEN");

  if (missing.length > 0) return { config: null, missing };

  return {
    config: {
      accountId,
      instance,
      apiToken,
      // Measured 1.7–3.5 s per search on this instance, with occasional much
      // slower calls; 12 s aborts a hung request without failing a slow one.
      timeoutMs: num("CLOUDFLARE_AI_SEARCH_TIMEOUT_MS", 12_000),
    },
    missing,
  };
}

/** REST base for the configured AI Search instance (non-legacy `ai-search` path). */
export function aiSearchBaseUrl(cfg: CloudflareSearchConfig): string {
  return `https://api.cloudflare.com/client/v4/accounts/${cfg.accountId}/ai-search/instances/${cfg.instance}`;
}

/** Groq's OpenAI-compatible endpoint. Called with `fetch`; no SDK dependency. */
export const GROQ_CHAT_COMPLETIONS_URL =
  "https://api.groq.com/openai/v1/chat/completions";

/**
 * Master switch. Public by design (the launcher is client-rendered), but it
 * only *permits* the launcher — the server availability check decides whether
 * it actually appears.
 */
export function isChatFlagEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHAT_ENABLED === "true";
}

// ─── Conversation limits ─────────────────────────────────────────────────────

/** Longest single visitor message accepted, in characters. */
export const MAX_MESSAGE_CHARS = 1000;
/**
 * Prior turns the browser may send. Only a compressed summary of them ever
 * reaches a model — see `history.ts` — so this bounds the request, not the cost.
 */
export const MAX_HISTORY_TURNS = 8;
/**
 * Ceiling on chunk characters handed to the answer model, across all sources.
 * The per-question budget is the retrieval profile's `contextChars`; this is the
 * cap none of them may exceed.
 */
export const MAX_CONTEXT_CHARS = 6000;
/** Distinct source pages handed to the answer model. */
export const MAX_CONTEXT_SOURCES = 6;
/** Source cards rendered to the visitor. */
export const MAX_CARDS = 3;
