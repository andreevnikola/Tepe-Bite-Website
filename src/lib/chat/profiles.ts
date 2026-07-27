import {
  PAGE_TYPES,
  TOPICS,
  type PageType,
  type RetrievalStatus,
  type Topic,
} from "@/lib/i18n/metadata";
import { LANGS, type Lang } from "@/store/lang";
import type { RetrievalProfileName } from "./types";

/**
 * Retrieval shaping — applied by US, not by Cloudflare.
 *
 * Verified against the live `tepebite` instance (engine_version 3): per-request
 * `filters`, `max_num_results` and `ranking_options.score_threshold` are all
 * accepted with `success: true` and then **ignored**. An impossible filter
 * (`pagetype = THIS_VALUE_DOES_NOT_EXIST`) returns the same chunks as no filter
 * at all. Only the instance-level settings apply: score_threshold 0.4,
 * max_num_results 10, hybrid + RRF + reranking, keyword match mode OR.
 *
 * So the profiles below describe what the APPLICATION does with the chunks it
 * gets back: how many to keep, how strictly to trim by score, and how many
 * distinct searches a question is allowed to issue. The filter values the
 * planner produces are validated here and applied as post-filters on
 * `item.metadata` — a browser-supplied filter can never reach Cloudflare, and a
 * planner-invented one is dropped before it can narrow anything.
 */

export type RetrievalProfile = {
  /**
   * Absolute score floor. The instance reranks, so almost everything it returns
   * scores above 0.9 — this is a safety net for the rare weak match, not the
   * main discriminator.
   */
  minScore: number;
  /**
   * The real discriminator: keep a chunk only if it scores at least this
   * fraction of the best chunk for the same query. Comparative questions need a
   * wide net; exact ones want the tight cluster around the top hit.
   */
  relativeFloor: number;
  /** Chunks kept per search call, best first (Cloudflare ignores our cap). */
  maxResults: number;
  /** Distinct source PAGES the profile aims to end up with. */
  targetSources: number;
  /** Upper bound on search calls per visitor message, across all stages. */
  maxQueries: number;
};

/**
 * Starting points, tuned with `npm run chat:eval`. `exact`/`broad` mirror the
 * originally proposed thresholds; `comparative` deliberately widens both the
 * score band and the page target so a ranking question sees several distinct
 * initiatives instead of ten chunks off one page.
 */
export const RETRIEVAL_PROFILE_SETTINGS: Record<
  RetrievalProfileName,
  RetrievalProfile
> = {
  exact: {
    minScore: 0.42,
    relativeFloor: 0.92,
    maxResults: 6,
    targetSources: 3,
    maxQueries: 3,
  },
  broad: {
    minScore: 0.34,
    relativeFloor: 0.85,
    maxResults: 8,
    targetSources: 4,
    maxQueries: 4,
  },
  comparative: {
    minScore: 0.3,
    relativeFloor: 0.78,
    maxResults: 10,
    targetSources: 6,
    maxQueries: 5,
  },
  follow_up: {
    minScore: 0.38,
    relativeFloor: 0.88,
    maxResults: 8,
    targetSources: 4,
    maxQueries: 3,
  },
  future_unverified: {
    minScore: 0.38,
    relativeFloor: 0.85,
    maxResults: 8,
    targetSources: 3,
    maxQueries: 3,
  },
};

// ─── Server-side filter validation ───────────────────────────────────────────

const PAGE_TYPE_SET: ReadonlySet<string> = new Set(PAGE_TYPES);
const TOPIC_SET: ReadonlySet<string> = new Set(TOPICS);
const STATUS_SET: ReadonlySet<string> = new Set([
  "planned",
  "in_progress",
  "frozen",
  "done",
]);
const LANG_SET: ReadonlySet<string> = new Set(LANGS);

/**
 * Keep only values from the closed vocabularies the pages actually emit. Used
 * on everything that reaches the retrieval layer — planner output included, so
 * a model that invents `pagetype: "faq"` narrows nothing instead of silently
 * filtering every chunk away.
 */
export function sanitizePageTypes(values: unknown): PageType[] {
  return unique(values).filter((v): v is PageType => PAGE_TYPE_SET.has(v));
}

export function sanitizeTopics(values: unknown): Topic[] {
  return unique(values).filter((v): v is Topic => TOPIC_SET.has(v));
}

export function sanitizeStatuses(values: unknown): RetrievalStatus[] {
  return unique(values).filter((v): v is RetrievalStatus => STATUS_SET.has(v));
}

export function sanitizeLang(value: unknown): Lang | null {
  return typeof value === "string" && LANG_SET.has(value) ? (value as Lang) : null;
}

function unique(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const v of values) {
    if (typeof v === "string" && v && !out.includes(v)) out.push(v);
  }
  return out;
}

/**
 * Page types that are never useful as an answer source on their own. Listing
 * pages aggregate every initiative into one blob, so they crowd out the actual
 * detail page for a specific question — kept for `broad`/`comparative` where
 * the aggregate view is genuinely the answer, dropped for `exact`.
 */
export const AGGREGATE_PAGE_TYPES: ReadonlySet<PageType> = new Set([
  "listing",
  "links",
]);
