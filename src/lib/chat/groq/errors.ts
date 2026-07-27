import "server-only";

/**
 * Provider failure classification for Groq.
 *
 * The pipeline reacts very differently to different failures, so a single
 * `Error` is not enough: a daily quota exhaustion must open the circuit breaker
 * until tomorrow and unlock the "try again tomorrow" copy, a short rate limit
 * must only park us for a few seconds, a timeout must degrade to source cards,
 * and an auth failure must never be retried at all. Everything downstream keys
 * off `kind`, so the mapping lives here once instead of being re-derived at each
 * call site.
 *
 * Redaction rule for this whole module: the API key, the Authorization header
 * and the provider's raw response body NEVER reach `message`. Groq's 429 text
 * embeds the organisation id and the account's exact limits, and these messages
 * end up in server logs — so we read the body only to *classify* it, and carry
 * forward nothing but the short enum-like `code`/`type` fields and the HTTP
 * status.
 */

export type GroqErrorKind =
  /** 401/403 — bad or revoked key. Never retry; the answer will not appear. */
  | "auth"
  /** 429 caused by a per-DAY budget. Nothing works again until it resets. */
  | "quota_daily"
  /** 429 caused by a short window (per minute). Retryable after a wait. */
  | "rate_limit"
  /**
   * This one prompt is bigger than the whole per-minute token allowance, so no
   * amount of waiting helps — only a smaller prompt does. Distinct from
   * `rate_limit` because the cure is the opposite: retry immediately with less
   * context instead of backing off, and never park the provider for it.
   */
  | "request_too_large"
  /** Our own abort fired — the provider was too slow for the request budget. */
  | "timeout"
  /** 5xx — provider-side fault. */
  | "server"
  /** 2xx whose envelope we could not use (no choices, empty content, non-JSON). */
  | "bad_response"
  /** fetch itself failed: DNS, TLS, connection reset, offline. */
  | "network";

export type ProviderErrorOptions = {
  /** Seconds to wait before a retry can plausibly succeed, when knowable. */
  retryAfterSeconds?: number;
  httpStatus?: number;
  cause?: unknown;
};

/**
 * A classified provider failure. `provider` is a literal tag so a future second
 * provider can be discriminated on without changing any consumer's shape.
 */
export class ProviderError extends Error {
  readonly provider = "groq" as const;
  readonly kind: GroqErrorKind;
  readonly retryAfterSeconds?: number;
  readonly httpStatus?: number;

  /**
   * `reason` must already be redacted — it is appended verbatim to `message`,
   * which is what gets logged.
   */
  constructor(kind: GroqErrorKind, reason?: string, options: ProviderErrorOptions = {}) {
    super(reason ? `groq ${kind}: ${reason}` : `groq ${kind}`);
    this.name = "ProviderError";
    this.kind = kind;
    this.retryAfterSeconds = options.retryAfterSeconds;
    this.httpStatus = options.httpStatus;
    if (options.cause !== undefined) this.cause = options.cause;
  }
}

export function isProviderError(value: unknown): value is ProviderError {
  return value instanceof ProviderError;
}

// ─── HTTP classification ─────────────────────────────────────────────────────

/**
 * Groq returns HTTP 429 for both "you are going too fast this minute" and "you
 * have spent today's free-tier budget", with the same `code`. Only the human
 * message distinguishes them — it names the exhausted bucket, e.g. "…on tokens
 * per day (TPD): Limit 100000, Used 100000…". We probe the message for those
 * markers and then throw it away; it is never stored or logged.
 *
 * "TPD"/"RPD" are matched case-sensitively: lowercased they would collide with
 * ordinary words, and Groq always writes the acronyms in caps.
 */
const DAILY_MARKERS: readonly RegExp[] = [
  /\bper[-\s]?day\b/i,
  /\bdaily\b/i,
  /\bTPD\b/,
  /\bRPD\b/,
];

/**
 * "Request too large … TPM: Limit 8000, Requested 11329". Groq usually answers
 * this with HTTP 413, but it reuses `rate_limit_exceeded` as the code and has
 * been seen to send it as a 429 with a long `retry-after` — which reads as an
 * outage and is the opposite of the truth, since the same request will fail
 * identically in ten minutes. Match the phrase so both shapes classify the same.
 */
const OVERSIZE_MARKER = /\brequest too large\b/i;

type GroqErrorEnvelope = {
  error?: { message?: unknown; type?: unknown; code?: unknown };
};

type ParsedProviderError = {
  /** Short enum-like value, safe to log (e.g. "rate_limit_exceeded"). */
  code: string;
  /** Short enum-like value, safe to log (e.g. "tokens", "requests"). */
  type: string;
  /** UNSAFE: contains org ids and account limits. Classification input only. */
  message: string;
};

function parseErrorEnvelope(bodyText: string): ParsedProviderError {
  try {
    const parsed = JSON.parse(bodyText) as GroqErrorEnvelope;
    const error = parsed?.error;
    return {
      code: typeof error?.code === "string" ? error.code : "",
      type: typeof error?.type === "string" ? error.type : "",
      message: typeof error?.message === "string" ? error.message : "",
    };
  } catch {
    return { code: "", type: "", message: "" };
  }
}

/** Keep short, enum-like provider tags; drop anything long enough to be prose. */
function safeTag(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 48 && !/\s/.test(trimmed)
    ? trimmed
    : "";
}

function redactedReason(status: number, parsed: ParsedProviderError): string {
  const tags = [safeTag(parsed.code), safeTag(parsed.type)].filter(Boolean);
  return tags.length > 0 ? `http ${status} (${tags.join("/")})` : `http ${status}`;
}

/**
 * Map a non-OK Groq response to a `ProviderError`. `bodyText` is read by the
 * caller (a `Response` body can only be consumed once) and is used for
 * classification only.
 */
export function providerErrorFromResponse(
  response: Response,
  bodyText: string,
): ProviderError {
  const status = response.status;
  const parsed = parseErrorEnvelope(bodyText);
  const reason = redactedReason(status, parsed);

  if (status === 401 || status === 403) {
    return new ProviderError("auth", reason, { httpStatus: status });
  }

  // 413, or a 429 that is really about this one prompt's size.
  if (status === 413 || OVERSIZE_MARKER.test(parsed.message)) {
    return new ProviderError("request_too_large", reason, { httpStatus: status });
  }

  if (status === 429) {
    const daily = DAILY_MARKERS.some((re) => re.test(parsed.message));
    const retryAfterSeconds = readRetryAfter(response.headers, parsed.type);
    return new ProviderError(daily ? "quota_daily" : "rate_limit", reason, {
      httpStatus: status,
      retryAfterSeconds,
    });
  }

  if (status >= 500) {
    return new ProviderError("server", reason, { httpStatus: status });
  }

  // 400/404/422 and friends: a malformed request or an unknown model. Not
  // transient, but not an auth problem either — "network" is the catch-all the
  // breaker treats as a plain temporary failure.
  return new ProviderError("network", reason, { httpStatus: status });
}

/**
 * Map a thrown value (from `fetch` or from body parsing) to a `ProviderError`.
 * `timedOut` is the caller's own abort flag: `AbortError` is also what a caller
 * cancelling the request produces, so the flag is what makes "timeout"
 * trustworthy rather than guessed from the error name alone.
 */
export function providerErrorFromThrown(err: unknown, timedOut: boolean): ProviderError {
  if (isProviderError(err)) return err;

  const name = err instanceof Error ? err.name : "";
  if (timedOut || name === "AbortError" || name === "TimeoutError") {
    return new ProviderError("timeout", "request aborted", { cause: err });
  }

  // Never surface the thrown message: undici embeds the request URL (and, for
  // some failure modes, request headers) in it.
  return new ProviderError("network", "fetch failed", { cause: err });
}

// ─── retry-after parsing ─────────────────────────────────────────────────────

/**
 * `retry-after` is authoritative when present. Otherwise fall back to Groq's
 * per-window reset headers, choosing the bucket the error envelope blames
 * (`error.type` is "tokens" or "requests" on a 429) — picking the wrong bucket
 * would either retry into the same limit or park us for minutes we did not owe.
 * With no blame information we take the longer of the two, because a premature
 * retry costs another 429 while a slightly long wait costs nothing.
 */
function readRetryAfter(headers: Headers, errorType: string): number | undefined {
  const direct = parseRetryAfterHeader(headers.get("retry-after"));
  if (direct !== undefined) return direct;

  const requests = parseDurationSeconds(headers.get("x-ratelimit-reset-requests"));
  const tokens = parseDurationSeconds(headers.get("x-ratelimit-reset-tokens"));

  if (errorType === "tokens" && tokens !== undefined) return clampWait(tokens);
  if (errorType === "requests" && requests !== undefined) return clampWait(requests);

  const candidates = [requests, tokens].filter((v): v is number => v !== undefined);
  if (candidates.length === 0) return undefined;
  return clampWait(Math.max(...candidates));
}

/** Anything beyond an hour is treated as "come back later" by the breaker. */
function clampWait(seconds: number): number {
  return Math.min(Math.max(Math.ceil(seconds), 1), 3600);
}

/** RFC 7231 allows either delta-seconds or an HTTP-date. Groq sends seconds. */
function parseRetryAfterHeader(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const value = raw.trim();
  if (!value) return undefined;

  const asNumber = Number(value);
  if (Number.isFinite(asNumber)) return clampWait(asNumber);

  const asDuration = parseDurationSeconds(value);
  if (asDuration !== undefined) return clampWait(asDuration);

  const asDate = Date.parse(value);
  if (Number.isFinite(asDate)) {
    return clampWait((asDate - Date.now()) / 1000);
  }
  return undefined;
}

/**
 * Groq writes its reset headers as compound durations: "7.66s", "2m59.56s",
 * "1h2m3s", "500ms". `Number()` returns NaN for all of them, so parse the parts.
 * The `ms` alternative must come first — regex alternation is ordered, and "s"
 * would otherwise swallow the unit of "500ms" as 500 seconds.
 */
const DURATION_PART = /(\d+(?:\.\d+)?)\s*(ms|s|m|h)/gi;

function parseDurationSeconds(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const value = raw.trim();
  if (!value) return undefined;

  const bare = Number(value);
  if (Number.isFinite(bare)) return bare;

  DURATION_PART.lastIndex = 0;
  let total = 0;
  let matched = false;
  for (const match of value.matchAll(DURATION_PART)) {
    const amount = Number(match[1]);
    if (!Number.isFinite(amount)) continue;
    matched = true;
    switch (match[2].toLowerCase()) {
      case "ms":
        total += amount / 1000;
        break;
      case "s":
        total += amount;
        break;
      case "m":
        total += amount * 60;
        break;
      case "h":
        total += amount * 3600;
        break;
    }
  }
  return matched ? total : undefined;
}
