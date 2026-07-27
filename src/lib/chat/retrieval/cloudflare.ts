import "server-only";
import { aiSearchBaseUrl, getCloudflareSearchConfig } from "../config";
import {
  sanitizeLang,
  sanitizePageTypes,
  sanitizeStatuses,
  sanitizeTopics,
} from "../profiles";
import type { RetrievedChunk } from "../types";

/**
 * The single call to Cloudflare AI Search. Retrieval infrastructure only — this
 * never asks Cloudflare to generate text, it asks for passages.
 *
 * MEASURED BEHAVIOUR of the live instance (engine v3), not documentation. Do not
 * "simplify" the post-filtering elsewhere on the assumption that the API does it:
 *
 *  - `filters` are accepted with `success: true` and then IGNORED. A filter with
 *    an impossible value (`pagetype = THIS_VALUE_DOES_NOT_EXIST`) returns exactly
 *    the same chunks as no filter at all. Metadata filtering therefore happens in
 *    `retrieval/index.ts`, on `item.metadata`.
 *  - `max_num_results` is IGNORED; the instance's own `max_num_results: 10`
 *    governs. We truncate ourselves.
 *  - `ranking_options.score_threshold` is IGNORED; the instance-level
 *    `score_threshold: 0.4` is what applies. Reranked scores cluster at
 *    0.95–0.999, which is why the profiles also carry a relative floor.
 *  - `rewrite_query: true` BREAKS retrieval outright: zero chunks and
 *    `search_query: "undefined"`. It must always be sent as `false`.
 *
 * Secrets: the request URL embeds the account id and the header carries the API
 * token, so neither the URL nor the headers are ever logged or attached to an
 * error. Diagnostics are limited to query length, chunk count and latency.
 */

export type CloudflareSearchErrorKind =
  | "auth"
  | "quota_daily"
  | "rate_limit"
  | "timeout"
  | "server"
  | "network"
  | "bad_response";

/**
 * Mirrors the shape of the Groq `ProviderError` (`kind` + `provider`) without
 * importing it, so the two providers can be classified uniformly by the caller's
 * circuit breaker while staying independently owned.
 */
export class CloudflareSearchError extends Error {
  readonly kind: CloudflareSearchErrorKind;
  readonly provider = "cloudflare" as const;
  /** HTTP status when the failure came from a response, for server-side logs. */
  readonly status?: number;

  constructor(kind: CloudflareSearchErrorKind, message: string, status?: number) {
    super(message);
    this.name = "CloudflareSearchError";
    this.kind = kind;
    this.status = status;
  }
}

/** Sent for parity with the API contract; the instance overrides it (see above). */
const REQUESTED_MAX_RESULTS = 10;

/** Cloudflare's own error text, kept short — it is server-side detail only. */
const MAX_ERROR_DETAIL_CHARS = 200;

type CloudflareChunk = {
  id?: unknown;
  score?: unknown;
  text?: unknown;
  item?: {
    key?: unknown;
    metadata?: Record<string, unknown> | null;
  } | null;
};

/**
 * Run one search and return normalised chunks, best-effort ordered as Cloudflare
 * returned them. Throws `CloudflareSearchError` on any failure — an empty array
 * means "the corpus had nothing", which is a legitimate outcome, not an error.
 */
export async function aiSearch(
  query: string,
  signal?: AbortSignal,
): Promise<RetrievedChunk[]> {
  const { config, missing } = getCloudflareSearchConfig();
  if (!config) {
    // Names only — never the values. Treated as `auth` so the caller opens the
    // circuit instead of retrying a request that can never succeed.
    throw new CloudflareSearchError(
      "auth",
      `Cloudflare AI Search is not configured (missing: ${missing.join(", ")})`,
    );
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, config.timeoutMs);

  // Compose with the caller's signal manually rather than with `AbortSignal.any`
  // so we can still tell our own timeout apart from a caller cancellation.
  const forwardAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", forwardAbort, { once: true });
  }

  const startedAt = Date.now();
  try {
    const response = await fetch(`${aiSearchBaseUrl(config)}/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        // Never true: it returns zero chunks on this instance.
        rewrite_query: false,
        // Ignored by the instance; sent so the request stays self-describing.
        max_num_results: REQUESTED_MAX_RESULTS,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new CloudflareSearchError(
        classifyStatus(response.status, await safeErrorDetail(response)),
        `Cloudflare AI Search responded ${response.status}`,
        response.status,
      );
    }

    const payload = (await response.json().catch(() => null)) as unknown;
    const chunks = normalizePayload(payload);

    debug(
      `search ok: queryChars=${query.length} chunks=${chunks.length} ms=${
        Date.now() - startedAt
      }`,
    );
    return chunks;
  } catch (error) {
    if (error instanceof CloudflareSearchError) throw error;
    if (isAbortError(error)) {
      // A caller-driven abort is not a provider failure — let it propagate as-is
      // so an aborted request never trips the circuit breaker.
      if (!timedOut) throw error;
      throw new CloudflareSearchError(
        "timeout",
        `Cloudflare AI Search timed out after ${config.timeoutMs}ms`,
      );
    }
    throw new CloudflareSearchError("network", "Cloudflare AI Search unreachable");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", forwardAbort);
  }
}

// ─── Response normalisation ──────────────────────────────────────────────────

function normalizePayload(payload: unknown): RetrievedChunk[] {
  if (!isRecord(payload) || payload.success !== true) {
    throw new CloudflareSearchError(
      "bad_response",
      "Cloudflare AI Search returned an unsuccessful body",
    );
  }

  const result = isRecord(payload.result) ? payload.result : null;
  if (!result) {
    throw new CloudflareSearchError(
      "bad_response",
      "Cloudflare AI Search returned no result object",
    );
  }

  const raw = result.chunks;
  // A search with no hits is a normal outcome; only a non-array `chunks` field
  // means the response shape changed under us.
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    throw new CloudflareSearchError(
      "bad_response",
      "Cloudflare AI Search returned a non-array chunks field",
    );
  }

  const chunks: RetrievedChunk[] = [];
  for (const entry of raw) {
    const chunk = toRetrievedChunk(entry as CloudflareChunk);
    if (chunk) chunks.push(chunk);
  }
  return chunks;
}

function toRetrievedChunk(raw: CloudflareChunk): RetrievedChunk | null {
  if (!isRecord(raw)) return null;

  const text = typeof raw.text === "string" ? raw.text.trim() : "";
  if (!text) return null;

  const item = isRecord(raw.item) ? raw.item : null;
  const url = typeof item?.key === "string" ? item.key.trim() : "";
  // Every chunk must carry a URL we can verify and render. One that does not is
  // unusable: the answer model may only cite ids that map back to a real page.
  if (!isHttpUrl(url)) return null;

  const metadata = isRecord(item?.metadata) ? item.metadata : {};

  return {
    chunkId: typeof raw.id === "string" && raw.id ? raw.id : `${url}#${hash(text)}`,
    url,
    text,
    score: typeof raw.score === "number" && Number.isFinite(raw.score) ? raw.score : 0,
    title: str(metadata.title),
    description: str(metadata.description),
    image: str(metadata.image) || null,
    // Our custom `lang` first, then Cloudflare's auto-extracted `language`, then
    // the `?lang=` variant baked into the indexed URL. Anything unrecognised
    // becomes null rather than a value that would silently fail every filter.
    lang:
      sanitizeLang(metadata.lang) ??
      sanitizeLang(metadata.language) ??
      sanitizeLang(langFromUrl(url)),
    pageType: sanitizePageTypes([metadata.pagetype])[0] ?? null,
    topic: sanitizeTopics([metadata.topic])[0] ?? null,
    status: sanitizeStatuses([metadata.status])[0] ?? null,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function classifyStatus(
  status: number,
  detail: string,
): CloudflareSearchErrorKind {
  if (status === 401 || status === 403) return "auth";
  if (status === 429) {
    // Cloudflare uses 429 for both burst throttling and the account's daily
    // allowance; only the body distinguishes them, and only the latter should
    // produce "try again tomorrow" copy.
    return /daily|quota|neuron/i.test(detail) ? "quota_daily" : "rate_limit";
  }
  if (status >= 500) return "server";
  return "bad_response";
}

/** Cloudflare's `errors[]` text, truncated. Never includes request headers. */
async function safeErrorDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as unknown;
    if (!isRecord(body) || !Array.isArray(body.errors)) return "";
    return body.errors
      .map((e) => (isRecord(e) && typeof e.message === "string" ? e.message : ""))
      .filter(Boolean)
      .join("; ")
      .slice(0, MAX_ERROR_DETAIL_CHARS);
  } catch {
    return "";
  }
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function langFromUrl(value: string): string | null {
  try {
    return new URL(value).searchParams.get("lang");
  } catch {
    return null;
  }
}

/** Stable short digest, used only to synthesise a chunk id when one is missing. */
function hash(value: string): string {
  let h = 5381;
  for (let i = 0; i < value.length; i += 1) h = ((h << 5) + h + value.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Development-only diagnostics. Query TEXT, URL and headers are never logged. */
function debug(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`[chat/retrieval] ${message}`);
}
