import "server-only";

import {
  aiSearchBaseUrl,
  getCloudflareSearchConfig,
  getGroqConfig,
  isChatFlagEnabled,
  GROQ_CHAT_COMPLETIONS_URL,
  type CloudflareSearchConfig,
  type GroqConfig,
} from "@/lib/chat/config";
import { providerErrorFromResponse } from "@/lib/chat/groq/errors";
import type { ChatAvailability, ChatFailureKind } from "@/lib/chat/types";
import type { ProviderFailureKind } from "@/lib/mongo/models/ProviderHealth";
import {
  getBreakerState,
  recordFailure,
  recordSuccess,
  tryAcquireRecoveryProbe,
  type BreakerScope,
  type BreakerState,
  type ChatProvider,
} from "./breaker";

/**
 * The single source of truth behind the chat launcher.
 *
 * The launcher must never appear unless a visitor's question can actually be
 * answered, so this asks the two providers the cheapest possible question —
 * "does this instance exist" / "is this model reachable with this key" — rather
 * than running a real search or a real completion. An unanswerable chat that
 * looks available is worse than no chat at all.
 *
 * "Unknown" is deliberately indistinguishable from "unavailable": every failure
 * path in this module returns `{ available: false, emailAutomation: false }`.
 * The browser learns one boolean pair and nothing else — no provider names, no
 * status codes, no missing-variable names, no model ids, no tokens.
 */

// ─── Tunables ────────────────────────────────────────────────────────────────

/**
 * Per-probe abort budget. This runs while a visitor waits for the launcher to
 * decide whether to appear, so it is far tighter than the pipeline's own
 * timeouts: a provider that cannot answer a metadata GET in ~2.5s is not going
 * to carry a grounded answer either.
 */
const PROBE_TIMEOUT_MS = 2_500;

/**
 * Positive results are cached for long enough that page renders and launcher
 * mounts never reach the providers…
 */
const AVAILABLE_TTL_MS = 90_000;
/**
 * …while negative results expire quickly, so recovery is measured in seconds
 * rather than minutes. When a breaker is open we can do better than a fixed
 * guess: cache exactly until its cooldown ends (capped, so a "come back
 * tomorrow" quota does not pin a stale answer in memory all day).
 */
const UNAVAILABLE_TTL_MS = 15_000;
const UNAVAILABLE_MAX_TTL_MS = 120_000;

/**
 * `GET /openai/v1/models/{id}` derived from the completions URL, so the Groq
 * host is still defined in exactly one place — `config.ts` is a shared contract
 * this module must not modify.
 */
const GROQ_MODELS_URL = GROQ_CHAT_COMPLETIONS_URL.replace(/\/chat\/completions$/, "/models");

/** Cloudflare marks its per-day allowance in the error text, exactly like Groq. */
const CLOUDFLARE_DAILY_MARKERS = /daily|quota|neuron/i;

const UNAVAILABLE: ChatAvailability = { available: false, emailAutomation: false };

// ─── Public API ──────────────────────────────────────────────────────────────

export type ProviderUsability =
  | { usable: true }
  | {
      usable: false;
      /** Coarse, localisable, already safe to send to the browser. */
      kind: ChatFailureKind;
      scope: BreakerScope;
      retryAfterSeconds?: number;
    };

/**
 * Everything the launcher is allowed to know. Cached in-process; safe to call
 * from a route handler on every request.
 */
export async function getChatAvailability(): Promise<ChatAvailability> {
  const now = Date.now();

  if (cache && cache.expiresAt > now) return cache.value;

  // Coalesce concurrent misses: a burst of launcher mounts after a deploy would
  // otherwise fire one pair of provider probes each.
  if (!inFlight) {
    inFlight = computeAvailability()
      .then((result) => {
        cache = { value: result.value, expiresAt: Date.now() + result.ttlMs };
        return result.value;
      })
      .catch(() => {
        // Nothing may escape: an unexpected throw becomes "unavailable", cached
        // briefly so a transient blip does not hide the launcher for long.
        cache = { value: UNAVAILABLE, expiresAt: Date.now() + UNAVAILABLE_TTL_MS };
        return UNAVAILABLE;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  return inFlight;
}

/**
 * Breaker-only check for a chat that is ALREADY open: it never probes, so the
 * message route can tell a visitor *why* the assistant is degraded (and whether
 * "try again tomorrow" is the honest thing to say) without paying for a network
 * round trip on the request path.
 *
 * `groq` here means answer generation. Planner failure is not critical — the
 * pipeline falls back to a heuristic plan — so it is never consulted.
 */
export async function assertProvidersUsable(): Promise<ProviderUsability> {
  const [groq, cloudflare] = await Promise.all([
    getBreakerState("groq"),
    getBreakerState("cloudflare"),
  ]);

  const open = [groq, cloudflare].filter((state) => state.open);
  if (open.length === 0) return { usable: true };

  // A daily condition outranks a temporary one: it is the longer wait and the
  // only one that justifies "try again tomorrow".
  const blocking = open.find((state) => state.scope === "daily") ?? open[0];
  const retryAfterSeconds = secondsUntil(blocking.openUntil);

  return {
    usable: false,
    kind: blocking.scope === "daily" ? "unavailable_today" : "unavailable_temporary",
    scope: blocking.scope,
    ...(retryAfterSeconds !== undefined ? { retryAfterSeconds } : {}),
  };
}

/**
 * Drop the cached answer. For the message route to call after it records a
 * provider failure, so a newly-open breaker hides the launcher on the next page
 * view instead of waiting out the positive TTL.
 */
export function invalidateChatAvailability(): void {
  cache = null;
}

// ─── Computation ─────────────────────────────────────────────────────────────

type CacheEntry = { value: ChatAvailability; expiresAt: number };

let cache: CacheEntry | null = null;
let inFlight: Promise<ChatAvailability> | null = null;

type Computed = { value: ChatAvailability; ttlMs: number };

/**
 * WHY a module-level cache rather than the project's `unstable_cache`: the TTL
 * here depends on the RESULT (90s when healthy, ~15s when not, or exactly until
 * a breaker's cooldown ends), which `unstable_cache` cannot express — it takes
 * one fixed `revalidate` per function. Cross-instance sharing is not lost:
 * the breaker state that drives the negative answers lives in Mongo, and the
 * route adds an HTTP `s-maxage` for the shared edge cache.
 */
async function computeAvailability(): Promise<Computed> {
  if (!isChatFlagEnabled()) return { value: UNAVAILABLE, ttlMs: UNAVAILABLE_TTL_MS };

  const groqConfig = getGroqConfig().config;
  const cloudflareConfig = getCloudflareSearchConfig().config;
  // Which variable is missing is a server-side concern; the browser is told only
  // that the assistant is unavailable.
  if (!groqConfig || !cloudflareConfig) {
    return { value: UNAVAILABLE, ttlMs: UNAVAILABLE_TTL_MS };
  }

  const [groqState, cloudflareState, resendState] = await Promise.all([
    getBreakerState("groq"),
    getBreakerState("cloudflare"),
    getBreakerState("resend"),
  ]);

  // Email automation is independent on purpose: a visitor whose question was
  // answered can still copy the draft and send it themselves, so a broken Resend
  // must never hide the chat.
  const emailAutomation = Boolean(process.env.RESEND_API_KEY) && !resendState.open;

  const blocked = [groqState, cloudflareState].filter((state) => state.open);
  if (blocked.length > 0) {
    const blocking = blocked.find((state) => state.scope === "daily") ?? blocked[0];
    return {
      value: { available: false, scope: blocking.scope, emailAutomation: false },
      ttlMs: ttlUntilCooldownEnds(blocking),
    };
  }

  // Both probes at once: they are independent, and the launcher should not wait
  // for two serial round trips.
  const [groqOk, cloudflareOk] = await Promise.all([
    runProbe("groq", groqState, () => probeGroqModel(groqConfig)),
    runProbe("cloudflare", cloudflareState, () => probeCloudflareInstance(cloudflareConfig)),
  ]);

  if (!groqOk || !cloudflareOk) {
    return { value: UNAVAILABLE, ttlMs: UNAVAILABLE_TTL_MS };
  }

  return { value: { available: true, emailAutomation }, ttlMs: AVAILABLE_TTL_MS };
}

/**
 * Run one provider probe under the breaker.
 *
 * A half-open breaker gets exactly one probe across the whole fleet; a caller
 * that loses the race reports unavailable instead of piling onto a provider that
 * was down moments ago. Every outcome is recorded, which is what lets the next
 * request skip the probe entirely while the breaker is open.
 */
async function runProbe(
  provider: ChatProvider,
  state: BreakerState,
  probe: () => Promise<void>,
): Promise<boolean> {
  if (state.phase === "half_open" && !(await tryAcquireRecoveryProbe(provider))) {
    return false;
  }

  try {
    await probe();
    await recordSuccess(provider);
    return true;
  } catch (error) {
    const failure = toProbeFailure(error);
    await recordFailure(provider, failure.kind, {
      ...(failure.retryAfterSeconds !== undefined
        ? { retryAfterSeconds: failure.retryAfterSeconds }
        : {}),
    });
    return false;
  }
}

// ─── Probes ──────────────────────────────────────────────────────────────────

/**
 * Cheapest possible proof that the key authenticates AND the configured answer
 * model is actually available to this account. Not a completion: a completion
 * costs tokens, takes seconds and can fail for reasons that have nothing to do
 * with availability.
 */
async function probeGroqModel(config: GroqConfig): Promise<void> {
  // Groq model ids legitimately contain a slash ("meta-llama/llama-4-scout-…"),
  // so the id is appended raw — percent-encoding the path segment would turn a
  // valid model into a 404.
  const response = await probeFetch(`${GROQ_MODELS_URL}/${config.answerModel}`, config.apiKey);
  if (response.ok) return;

  // Reuse the pipeline's own classifier: it knows Groq's per-day vs per-minute
  // 429 markers and its compound `retry-after` formats, and it is already
  // careful never to carry the response text forward.
  const bodyText = await response.text().catch(() => "");
  const error = providerErrorFromResponse(response, bodyText);
  throw new ProbeFailure(error.kind, error.retryAfterSeconds);
}

/**
 * Instance read, not a search: it proves the token is valid and the configured
 * instance exists, without paying for retrieval (1.7–3.5s) or touching the
 * account's search allowance.
 */
async function probeCloudflareInstance(config: CloudflareSearchConfig): Promise<void> {
  const response = await probeFetch(aiSearchBaseUrl(config), config.apiToken);

  if (!response.ok) {
    const detail = await cloudflareErrorDetail(response);
    throw new ProbeFailure(
      classifyCloudflareStatus(response.status, detail),
      parseRetryAfter(response.headers.get("retry-after")),
    );
  }

  // Cloudflare can answer 200 with `success: false`. Anything else in the body
  // is ignored — an HTTP 200 on the instance read already proves reachability
  // and existence, and being strict about the envelope would let a harmless API
  // shape change hide the chat.
  const body = (await response.json().catch(() => null)) as unknown;
  if (isRecord(body) && body.success === false) {
    throw new ProbeFailure("bad_response");
  }
}

/**
 * Shared GET with an abort budget. The bearer token is passed as a header and is
 * never logged, echoed or attached to an error — only the classified kind
 * leaves this module.
 */
async function probeFetch(url: string, token: string): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, PROBE_TIMEOUT_MS);

  try {
    return await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    // `timedOut` is what distinguishes our own abort from any other AbortError,
    // and the thrown message is discarded: undici embeds the request URL (which
    // carries the account id) in it.
    throw new ProbeFailure(timedOut ? "timeout" : "network", undefined, error);
  } finally {
    clearTimeout(timer);
  }
}

/** Mirrors the retrieval layer's classification of the same API. */
function classifyCloudflareStatus(status: number, detail: string): ProviderFailureKind {
  if (status === 401 || status === 403) return "auth";
  // A missing instance is a configuration fault, not weather: treat it like an
  // auth failure so it opens immediately, but with the same short cooldown, so a
  // corrected deploy recovers within minutes.
  if (status === 404) return "auth";
  if (status === 429) {
    return CLOUDFLARE_DAILY_MARKERS.test(detail) ? "quota_daily" : "rate_limit";
  }
  if (status >= 500) return "server";
  return "bad_response";
}

/**
 * Cloudflare's `errors[]` text, read ONLY to tell a daily quota apart from a
 * burst limit and then discarded — it is never stored, logged or returned.
 */
async function cloudflareErrorDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as unknown;
    if (!isRecord(body) || !Array.isArray(body.errors)) return "";
    return body.errors
      .map((entry) => (isRecord(entry) && typeof entry.message === "string" ? entry.message : ""))
      .filter(Boolean)
      .join("; ")
      .slice(0, 200);
  } catch {
    return "";
  }
}

// ─── Internals ───────────────────────────────────────────────────────────────

/** Internal only. Never rendered, never serialised, never sent to the browser. */
class ProbeFailure extends Error {
  readonly kind: ProviderFailureKind;
  readonly retryAfterSeconds?: number;

  constructor(kind: ProviderFailureKind, retryAfterSeconds?: number, cause?: unknown) {
    super(`chat probe failed: ${kind}`);
    this.name = "ProbeFailure";
    this.kind = kind;
    this.retryAfterSeconds = retryAfterSeconds;
    if (cause !== undefined) this.cause = cause;
  }
}

function toProbeFailure(error: unknown): {
  kind: ProviderFailureKind;
  retryAfterSeconds?: number;
} {
  if (error instanceof ProbeFailure) {
    return {
      kind: error.kind,
      ...(error.retryAfterSeconds !== undefined
        ? { retryAfterSeconds: error.retryAfterSeconds }
        : {}),
    };
  }
  // An unclassifiable throw is treated as a transient network fault: it needs a
  // confirmed run before it can open anything.
  return { kind: "network" };
}

/**
 * Cache a negative answer for exactly as long as the breaker says it is true,
 * within bounds — never shorter than the plain negative TTL (pointless churn),
 * never longer than two minutes (a manually cleared breaker must be noticed).
 */
function ttlUntilCooldownEnds(state: BreakerState): number {
  if (!state.openUntil) return UNAVAILABLE_TTL_MS;
  const remaining = state.openUntil.getTime() - Date.now();
  return Math.min(Math.max(remaining, UNAVAILABLE_TTL_MS), UNAVAILABLE_MAX_TTL_MS);
}

function secondsUntil(deadline: Date | null): number | undefined {
  if (!deadline) return undefined;
  const seconds = Math.ceil((deadline.getTime() - Date.now()) / 1000);
  return seconds > 0 ? seconds : undefined;
}

function parseRetryAfter(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const seconds = Number(raw.trim());
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
