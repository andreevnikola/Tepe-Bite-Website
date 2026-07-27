import "server-only";
import type { Lang } from "@/store/lang";
import type { ChatSource, RetrievedChunk, SourceCard } from "../types";

/**
 * Chunks → citable pages → rendered cards.
 *
 * The whole point of this module is the trust boundary: URLs come from
 * `chunk.item.key`, which Cloudflare read off our own sitemap. The answer model
 * only ever sees and returns application-assigned ids (`S1`, `S2`, …), and an id
 * it invents simply resolves to nothing. A URL MUST NEVER ORIGINATE FROM THE
 * MODEL — `resolveCards` is the only place ids become links, and it drops any id
 * that is not in the retrieved source set.
 *
 * Page identity keeps the `?lang=` variant: `/impact?lang=bg` and
 * `/impact?lang=en` are separate documents in the index with separate text, so
 * they must stay separately citable. Only when we render cards do we collapse
 * the two variants into one link, preferring the visitor's language.
 */

/**
 * Passages kept per page. A long page chunks into many near-identical passages;
 * without a cap one page would eat the whole context budget and crowd out the
 * second opinion a comparison needs.
 */
const MAX_PASSAGES_PER_SOURCE = 4;

/**
 * Canonical identity of a page INCLUDING its language variant. Drops the hash
 * and every query parameter except `lang`, so tracking parameters or a stray
 * `?utm_source=` cannot split one page into several "sources".
 */
export function pageIdentity(url: string): string {
  const { base, lang } = urlParts(url);
  return lang ? `${base}?lang=${lang}` : base;
}

/** Identity IGNORING the language variant — used to collapse cards only. */
export function pageGroup(url: string): string {
  return urlParts(url).base;
}

function urlParts(url: string): { base: string; lang: string } {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/+$/, "") || "/";
    return {
      base: `${parsed.protocol}//${parsed.host.toLowerCase()}${path}`,
      lang: (parsed.searchParams.get("lang") ?? "").toLowerCase(),
    };
  } catch {
    // Unparseable URLs are filtered out upstream; fall back to the raw string so
    // this helper stays total rather than throwing mid-grouping.
    return { base: url, lang: "" };
  }
}

// ─── Grouping ────────────────────────────────────────────────────────────────

type Accumulator = {
  best: RetrievedChunk;
  passages: string[];
  seenChunkIds: Set<string>;
  seenTexts: Set<string>;
};

/**
 * Collapse chunks into distinct pages. The highest-scoring chunk supplies the
 * page's metadata and its score; passages stay ordered best-first so the answer
 * prompt reads the strongest evidence first even after the cap bites.
 */
export function groupChunksIntoSources(chunks: RetrievedChunk[]): ChatSource[] {
  const ordered = [...chunks].sort((a, b) => b.score - a.score);
  const pages = new Map<string, Accumulator>();

  for (const chunk of ordered) {
    const key = pageIdentity(chunk.url);
    const existing = pages.get(key);

    if (!existing) {
      pages.set(key, {
        best: chunk,
        passages: [chunk.text],
        seenChunkIds: new Set([chunk.chunkId]),
        seenTexts: new Set([chunk.text]),
      });
      continue;
    }

    // The same chunk can arrive from several query variants, and overlapping
    // chunks of one page can repeat a passage verbatim. Both are noise.
    if (existing.seenChunkIds.has(chunk.chunkId)) continue;
    if (existing.seenTexts.has(chunk.text)) continue;
    existing.seenChunkIds.add(chunk.chunkId);
    existing.seenTexts.add(chunk.text);
    if (existing.passages.length < MAX_PASSAGES_PER_SOURCE) {
      existing.passages.push(chunk.text);
    }
  }

  return [...pages.values()]
    .map(({ best, passages }) => ({
      // Filled in by `assignSourceIds` once the final display order is known.
      id: "",
      url: best.url,
      title: best.title,
      description: best.description,
      image: best.image,
      lang: best.lang,
      pageType: best.pageType,
      topic: best.topic,
      status: best.status,
      score: best.score,
      passages,
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Assign the ids the answer model cites. Positional and stable within a single
 * response: `S1` is always the first source in the list the model was shown.
 */
export function assignSourceIds(sources: ChatSource[]): ChatSource[] {
  return sources.map((source, index) => ({ ...source, id: `S${index + 1}` }));
}

// ─── Cards ───────────────────────────────────────────────────────────────────

/**
 * Map the ids the model selected back to trusted URLs.
 *
 * Every rendered link originates here, from the retrieved source set — never
 * from model output. An id the model invented, repeated or copied from an older
 * turn is not in `byId` and is silently dropped rather than rendered.
 *
 * Cited cards come first (they back a claim), then learn-more. Language variants
 * of one page collapse into a single card: the first mention keeps its id, role
 * and position, but adopts the `preferredLang` variant's URL and metadata so the
 * visitor lands on the page in the language they are reading.
 */
export function resolveCards(
  sources: ChatSource[],
  citedIds: string[],
  learnMoreIds: string[],
  preferredLang: Lang,
  max: number,
): SourceCard[] {
  const byId = new Map(sources.map((source) => [source.id, source]));
  const cards: SourceCard[] = [];
  const positionByGroup = new Map<string, number>();
  const usedIds = new Set<string>();

  // Ids are still examined after `max` is reached: a later id can be the
  // preferred-language variant of a card already in the list.
  const consider = (id: string, role: SourceCard["role"]) => {
    if (usedIds.has(id)) return;
    const source = byId.get(id);
    if (!source) return;
    usedIds.add(id);

    const group = pageGroup(source.url);
    const at = positionByGroup.get(group);
    if (at !== undefined) {
      // Same page, other language variant: upgrade the existing card in place if
      // this variant matches the visitor's language.
      const current = cards[at];
      if (current.lang !== preferredLang && source.lang === preferredLang) {
        cards[at] = { ...toCard(source, current.role), id: current.id };
      }
      return;
    }

    if (cards.length >= max) return;
    positionByGroup.set(group, cards.length);
    cards.push(toCard(source, role));
  };

  for (const id of citedIds) consider(id, "cited");
  for (const id of learnMoreIds) consider(id, "learn_more");

  return cards.slice(0, max);
}

function toCard(source: ChatSource, role: SourceCard["role"]): SourceCard {
  return {
    id: source.id,
    url: source.url,
    title: source.title,
    description: source.description,
    image: source.image,
    lang: source.lang,
    pageType: source.pageType,
    role,
  };
}
