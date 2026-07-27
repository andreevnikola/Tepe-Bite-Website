import "server-only";
import type { Lang } from "@/store/lang";
import type { PageType, RetrievalStatus, Topic } from "@/lib/i18n/metadata";
import { MAX_CONTEXT_SOURCES } from "../config";
import {
  AGGREGATE_PAGE_TYPES,
  RETRIEVAL_PROFILE_SETTINGS,
  sanitizePageTypes,
  sanitizeStatuses,
  sanitizeTopics,
  type RetrievalProfile,
} from "../profiles";
import type {
  ChatSource,
  PlannerResult,
  RetrievalResult,
  RetrievalStage,
  RetrievedChunk,
} from "../types";
import { aiSearch } from "./cloudflare";
import { assignSourceIds, groupChunksIntoSources, pageIdentity } from "./sources";

/**
 * Staged retrieval.
 *
 * Cloudflare AI Search accepts `filters`, `max_num_results` and
 * `ranking_options.score_threshold` and then IGNORES all three (verified against
 * the live instance — an impossible filter value returns the same chunks as no
 * filter). Every narrowing decision below is therefore ours, applied to
 * `chunk.item.metadata` after the fact. This post-filtering is load-bearing, not
 * redundant: deleting it would not "let Cloudflare handle it", it would remove
 * filtering altogether.
 *
 * Because the filters are ours, broadening a stage costs NOTHING — the same
 * chunk pool is simply re-filtered. A second network call is only ever made when
 * a genuinely different QUERY STRING is needed (comparisons that must surface
 * several distinct initiative pages), and never more than `profile.maxQueries`
 * times per visitor message.
 */

export type RetrieveArgs = {
  plan: PlannerResult;
  /**
   * The visitor's message, verbatim. Used only as a second-opinion query when
   * the planner's reformulation retrieves nothing of the kind it asked for —
   * see the note above the staged fallback.
   */
  userMessage?: string;
  signal?: AbortSignal;
};

/** Intents for which the planner's `status` filter is meaningful at all — only
 * initiative pages carry `status`, so keeping it elsewhere filters everything
 * away when the stage broadens. */
const INITIATIVE_INTENTS: ReadonlySet<PlannerResult["intent"]> = new Set([
  "initiative_fact",
  "initiative_comparison",
]);

/**
 * Query variants used only when one answer needs several distinct initiative
 * pages. The planner's query tends to pull the aggregate listing page plus one
 * detail page; biasing the wording toward a single initiative surfaces the
 * others. Written per language because the index is language-split.
 */
const INITIATIVE_BIAS: Record<Lang, string> = {
  bg: "инициатива на ТЕПЕ bite Impact",
  en: "TEPE bite Impact initiative",
};
const INITIATIVE_SURVEY: Record<Lang, string> = {
  bg: "инициативи на ТЕПЕ bite Impact в Пловдив",
  en: "TEPE bite Impact initiatives in Plovdiv",
};

/** A comparison needs at least this many distinct initiative pages to be one. */
const MIN_COMPARABLE_PAGES = 2;

/** Passages a single page may contribute when several pages must be compared. */
const MAX_CHUNKS_PER_PAGE_DIVERSE = 2;
const MAX_CHUNKS_PER_PAGE_DEFAULT = 3;

type MetaFilter = {
  /** `null` means "any language" — used by the cross-language stages. */
  langs: Lang[] | null;
  pageTypes: PageType[];
  topics: Topic[];
  statuses: RetrievalStatus[];
};

type Attempt = { stage: RetrievalStage; filter: MetaFilter };

export async function retrieve({
  plan,
  userMessage,
  signal,
}: RetrieveArgs): Promise<RetrievalResult> {
  const startedAt = Date.now();
  const profile = RETRIEVAL_PROFILE_SETTINGS[plan.retrievalProfile];
  const targetSources = Math.min(profile.targetSources, MAX_CONTEXT_SOURCES);

  // Re-sanitised here even though the planner output was validated: the filters
  // decide what evidence the answer may use, so they are never trusted twice.
  const pageTypes = sanitizePageTypes(plan.pagetypes);
  const topics = sanitizeTopics(plan.topics);
  const statuses = sanitizeStatuses(plan.statuses);
  const broadStatuses = INITIATIVE_INTENTS.has(plan.intent) ? statuses : [];

  const needsDiversity =
    plan.retrievalProfile === "comparative" || plan.requiresMultipleSources;
  const maxPerPage = needsDiversity
    ? MAX_CHUNKS_PER_PAGE_DIVERSE
    : MAX_CHUNKS_PER_PAGE_DEFAULT;

  // ── Shared chunk pool ──────────────────────────────────────────────────────
  const pool: RetrievedChunk[] = [];
  const pooledChunkIds = new Set<string>();
  const ranQueries = new Set<string>();
  const queries: string[] = [];
  let rawChunkCount = 0;

  const runQuery = async (raw: string): Promise<void> => {
    const query = raw.trim();
    if (!query || ranQueries.has(query)) return;
    if (queries.length >= profile.maxQueries) return;

    const isFirstCall = queries.length === 0;
    ranQueries.add(query);
    queries.push(query);

    let chunks: RetrievedChunk[];
    try {
      chunks = await aiSearch(query, signal);
    } catch (error) {
      // The first call is the one the circuit breaker cares about, and if
      // nothing has been retrieved yet there is no answer to salvage anyway.
      if (isFirstCall || pool.length === 0) throw error;
      return;
    }

    rawChunkCount += chunks.length;
    for (const chunk of applyScoreFloors(chunks, profile)) {
      if (pooledChunkIds.has(chunk.chunkId)) continue;
      pooledChunkIds.add(chunk.chunkId);
      pool.push(chunk);
    }
  };

  // ── Staged fallback ────────────────────────────────────────────────────────
  const attempts: Attempt[] = [
    // 1. Everything the planner asked for, in the visitor's language.
    {
      stage: "preferred_language_filtered",
      filter: { langs: [plan.language], pageTypes, topics, statuses },
    },
    // 2. Same language, progressively broader: topics first (finest-grained and
    //    most likely to be wrong), then pagetypes.
    {
      stage: "preferred_language_broad",
      filter: { langs: [plan.language], pageTypes, topics: [], statuses: broadStatuses },
    },
    {
      stage: "preferred_language_broad",
      filter: { langs: [plan.language], pageTypes: [], topics: [], statuses: broadStatuses },
    },
  ];

  // 3. The other language variant of the same pages. Retrieval only supplies
  //    evidence — the answer language follows the visitor's message regardless.
  if (plan.allowCrossLanguageFallback) {
    attempts.push({
      stage: "cross_language_filtered",
      filter: { langs: null, pageTypes, topics, statuses },
    });
  }

  // 4. Anything in the corpus, in any language.
  attempts.push({
    stage: "corpus_wide",
    filter: { langs: null, pageTypes: [], topics: [], statuses: [] },
  });

  const minimumSources = needsDiversity ? 2 : 1;
  const selectOptions: SelectOptions = {
    profile: plan.retrievalProfile,
    maxPerPage,
    targetSources,
    preferredLang: plan.language,
  };

  /** What the first stage would return from the pool as it stands. */
  const strictSources = (): ChatSource[] =>
    select(pool, attempts[0].filter, selectOptions);

  // ── Queries ────────────────────────────────────────────────────────────────
  await runQuery(plan.searchQuery);

  if (needsDiversity) {
    // Judged through the same lens the first stage will apply, not on the raw
    // pool. Counting the pool overstates diversity: the English twin of the page
    // we already have looks like a second initiative right up until the language
    // filter runs, and a ranking question then reaches the model with exactly
    // one initiative in hand — which is correctly answered "insufficient
    // evidence", from a corpus that does hold the others. Each extra search
    // costs 1.7–3.5 s the visitor waits through, so they run only while the
    // comparison is genuinely short of comparable pages.
    if (countInitiativePages(strictSources()) < MIN_COMPARABLE_PAGES) {
      await runQuery(`${plan.searchQuery} ${INITIATIVE_BIAS[plan.language]}`);
    }
    if (countInitiativePages(strictSources()) < MIN_COMPARABLE_PAGES) {
      await runQuery(INITIATIVE_SURVEY[plan.language]);
    }
  }

  // The planner's reformulation is usually the better query, but it can be
  // strictly worse: padding a precise question with brand words ("<subject> ТЕПЕ
  // bite инициатива описание") pulls the reranker toward every page that merely
  // MENTIONS the brand, and the one page that answers the question drops out of
  // the top ten entirely. When the planner's own filters match nothing in the
  // pool, that is the signal — the visitor's literal wording is then the
  // cheapest second opinion we have, and it is the wording the corpus was
  // written to answer.
  if (userMessage && strictSources().length < minimumSources) {
    await runQuery(userMessage);
  }

  let best: { sources: ChatSource[]; stage: RetrievalStage } | null = null;

  for (const attempt of attempts) {
    const sources = select(pool, attempt.filter, selectOptions);
    if (sources.length >= minimumSources) {
      return finish(sources, attempt.stage);
    }
    // A broader stage is not guaranteed to be a superset (stage 3 reinstates the
    // pagetype/topic filters stage 2 dropped), so never lose a better earlier
    // result while chasing a bigger one.
    if (sources.length > 0 && (!best || sources.length > best.sources.length)) {
      best = { sources, stage: attempt.stage };
    }
  }

  if (best) return finish(best.sources, best.stage);

  // 5. Insufficient evidence — a real, expected outcome, not an error.
  return finish([], "none");

  function finish(sources: ChatSource[], stage: RetrievalStage): RetrievalResult {
    return {
      sources,
      stage,
      queries,
      latencyMs: Date.now() - startedAt,
      rawChunkCount,
    };
  }
}

// ─── Selection ───────────────────────────────────────────────────────────────

type SelectOptions = {
  profile: PlannerResult["retrievalProfile"];
  maxPerPage: number;
  targetSources: number;
  preferredLang: Lang;
};

function select(
  pool: RetrievedChunk[],
  filter: MetaFilter,
  options: SelectOptions,
): ChatSource[] {
  let matched = pool.filter((chunk) => matches(chunk, filter));

  // For a precise question the aggregate listing pages are noise: they mention
  // every initiative in one blob and outrank the detail page that actually
  // answers it. Dropped entirely — unless they are all we have.
  if (options.profile === "exact") {
    const specific = matched.filter((chunk) => !isAggregate(chunk));
    if (specific.length > 0) matched = specific;
  }

  const diversified = roundRobinByPage(matched, {
    maxPerPage: options.maxPerPage,
    limit: options.targetSources * options.maxPerPage,
    preferredLang: options.preferredLang,
  });

  // Grouping orders purely by score, so the final ranking is re-imposed here:
  // score alone would let a high-scoring listing page outrank the detail pages
  // it merely summarises, and would bury the visitor's own language variant.
  const ordered = groupChunksIntoSources(diversified).sort((a, b) => {
    const aggregate =
      Number(isAggregatePage(a.pageType)) - Number(isAggregatePage(b.pageType));
    if (aggregate !== 0) return aggregate;
    const lang =
      Number(b.lang === options.preferredLang) -
      Number(a.lang === options.preferredLang);
    if (lang !== 0) return lang;
    return b.score - a.score;
  });

  return assignSourceIds(ordered.slice(0, options.targetSources));
}

function matches(chunk: RetrievedChunk, filter: MetaFilter): boolean {
  // A chunk whose language metadata is missing is treated as language-agnostic:
  // unknown is not evidence of the WRONG language, and dropping it would cost
  // recall on any page that ever ships without the tag.
  if (filter.langs && chunk.lang !== null && !filter.langs.includes(chunk.lang)) {
    return false;
  }
  // The classification filters work the other way round: they are only set when
  // the planner is confident about the kind of page it wants, so an untagged
  // chunk is not a match.
  if (filter.pageTypes.length > 0) {
    if (!chunk.pageType || !filter.pageTypes.includes(chunk.pageType)) return false;
  }
  if (filter.topics.length > 0) {
    if (!chunk.topic || !filter.topics.includes(chunk.topic)) return false;
  }
  if (filter.statuses.length > 0) {
    if (!chunk.status || !filter.statuses.includes(chunk.status)) return false;
  }
  return true;
}

/**
 * Keep the strong chunks for one query. The absolute floor is a safety net —
 * reranked scores cluster between 0.95 and 0.999, so the relative floor (a
 * fraction of the best score for this query) is what actually discriminates.
 */
function applyScoreFloors(
  chunks: RetrievedChunk[],
  profile: RetrievalProfile,
): RetrievedChunk[] {
  const above = chunks
    .filter((chunk) => chunk.score >= profile.minScore)
    .sort((a, b) => b.score - a.score);
  if (above.length === 0) return [];

  const floor = above[0].score * profile.relativeFloor;
  return above.filter((chunk) => chunk.score >= floor).slice(0, profile.maxResults);
}

/**
 * Spread the chunk budget across pages instead of letting the best page take it
 * all: one round of best-chunks-per-page, then a second, and so on. Without this
 * a comparison gets ten chunks of a single initiative and no second opinion.
 */
function roundRobinByPage(
  chunks: RetrievedChunk[],
  options: { maxPerPage: number; limit: number; preferredLang: Lang },
): RetrievedChunk[] {
  const buckets = new Map<string, RetrievedChunk[]>();
  for (const chunk of [...chunks].sort((a, b) => b.score - a.score)) {
    const key = pageIdentity(chunk.url);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(chunk);
    else buckets.set(key, [chunk]);
  }

  const ordered = [...buckets.values()].sort((a, b) => {
    // Aggregate pages go last: useful as context, never the primary source.
    const aggregate = Number(isAggregate(a[0])) - Number(isAggregate(b[0]));
    if (aggregate !== 0) return aggregate;
    // Then the visitor's own language, so a cross-language stage still leads
    // with the variant they can read.
    const lang =
      Number(b[0].lang === options.preferredLang) -
      Number(a[0].lang === options.preferredLang);
    if (lang !== 0) return lang;
    return b[0].score - a[0].score;
  });

  const out: RetrievedChunk[] = [];
  for (let round = 0; round < options.maxPerPage; round += 1) {
    for (const bucket of ordered) {
      const chunk = bucket[round];
      if (!chunk) continue;
      out.push(chunk);
      if (out.length >= options.limit) return out;
    }
  }
  return out;
}

function isAggregate(chunk: RetrievedChunk): boolean {
  return isAggregatePage(chunk.pageType);
}

function isAggregatePage(pageType: PageType | null): boolean {
  return pageType !== null && AGGREGATE_PAGE_TYPES.has(pageType);
}

/**
 * Initiative detail pages among selected sources. Counted on sources rather
 * than on raw chunks so it measures what the answer will actually see: one page
 * per entry, already language-filtered and deduplicated.
 */
function countInitiativePages(sources: readonly ChatSource[]): number {
  return sources.filter((source) => source.pageType === "initiative").length;
}

export { CloudflareSearchError, aiSearch } from "./cloudflare";
export type { CloudflareSearchErrorKind } from "./cloudflare";
export {
  assignSourceIds,
  groupChunksIntoSources,
  pageGroup,
  pageIdentity,
  resolveCards,
} from "./sources";
