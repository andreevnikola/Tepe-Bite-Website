import "server-only";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { LANG_COOKIE, normalizeLang, type Lang } from "@/store/lang";
import { SITE_URL } from "@/lib/config/site-info";
import { LANG_HEADER, resolveLang } from "./resolve";

/**
 * The language resolved for the current request. Reads the header injected by
 * the proxy first (authoritative for `?lang=` navigations), then falls back to
 * the cookie, then Bulgarian. Safe to call from the root layout and from any
 * `generateMetadata`.
 */
export async function getRequestLang(): Promise<Lang> {
  const headerLang = (await headers()).get(LANG_HEADER);
  if (headerLang) return normalizeLang(headerLang);
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  return resolveLang(null, cookieLang);
}

/**
 * One brand suffix for every page title, so pages supply only their own
 * subject. A layout that sets a plain-string `title` replaces the nearest
 * ancestor's template for its whole subtree, so any layout that has children
 * (e.g. `/legal`) must re-declare this template instead of a bare string.
 */
export const TITLE_TEMPLATE = "%s | ТЕПЕ bite";

/** OpenGraph locale tag for a language. */
export function ogLocale(lang: Lang): string {
  return lang === "en" ? "en_US" : "bg_BG";
}

/**
 * hreflang alternates for a public path. Canonical is the clean URL; the
 * bg/en variants use explicit `?lang=` so crawlers (and Cloudflare AI Search)
 * get stable, language-selecting URLs. `path` must start with "/".
 */
export function languageAlternates(path: string): NonNullable<Metadata["alternates"]> {
  const clean = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    canonical: clean,
    languages: {
      bg: `${clean}?lang=bg`,
      en: `${clean}?lang=en`,
    },
  };
}

// ─── Retrieval classification ────────────────────────────────────────────────
//
// These three (plus `status` on initiatives) are the ONLY custom metadata
// fields configured on the Cloudflare AI Search instance — it allows five, and
// title/description/image/language are already extracted automatically, so
// they must not be duplicated here. Every value below is a closed vocabulary:
// the retriever filters on exact matches, so a typo silently costs recall.

/** What kind of document this is. Filterable: `pagetype = legal`, etc. */
export const PAGE_TYPES = [
  "home",
  "listing",
  "about",
  "product",
  "impact",
  "links",
  "legal",
  "initiative",
  "partner",
  "news",
  "location",
] as const;
export type PageType = (typeof PAGE_TYPES)[number];

/**
 * What the document is about. Deliberately finer-grained than `pagetype` so a
 * question about returns can be routed to the returns page instead of picking
 * between nine similarly-worded legal documents.
 */
export const TOPICS = [
  "brand",
  "team-story",
  "product",
  "impact-fund",
  "initiatives",
  "partners",
  "news",
  "stores",
  "links",
  "legal-index",
  "terms",
  "privacy",
  "cookies",
  "returns",
  "withdrawal",
  "delivery-payment",
  "product-info",
  "trader-info",
  "initiative-transparency",
] as const;
export type Topic = (typeof TOPICS)[number];

/** Initiative lifecycle — mirrors INITIATIVE_STATUSES. Initiative pages only. */
export type RetrievalStatus = "planned" | "in_progress" | "frozen" | "done";

export type RetrievalMeta = {
  lang: Lang;
  pageType: PageType;
  topic: Topic;
  /** Only meaningful on initiative pages; omitted everywhere else. */
  status?: RetrievalStatus;
};

/**
 * The `<meta name>` tags Cloudflare AI Search extracts into custom metadata.
 * Names are matched case-insensitively against the configured schema, so they
 * must stay in sync with it: `lang`, `pagetype`, `topic`, `status`.
 */
export function retrievalMeta({
  lang,
  pageType,
  topic,
  status,
}: RetrievalMeta): Record<string, string> {
  return {
    lang,
    pagetype: pageType,
    topic,
    ...(status ? { status } : {}),
  };
}

// ─── Description helpers ─────────────────────────────────────────────────────

/** Upper bound for a meta description — long enough to be useful to the
 * retriever, short enough that search engines do not truncate it themselves. */
export const META_DESCRIPTION_MAX = 200;

/**
 * Collapse whitespace and cut to `max` characters on a word boundary, adding an
 * ellipsis only when something was actually removed. Replaces the previous
 * blunt `.slice(0, 160)`, which cut mid-word and fed the index fragments like
 * "…transforming a transit p".
 */
export function truncateForMeta(
  value: string,
  max: number = META_DESCRIPTION_MAX,
): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const head = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(
    /[\s,;:.–—-]+$/,
    "",
  );
  return `${head}…`;
}

/**
 * Join non-empty sentence fragments into one description. Used by the dynamic
 * pages to build a specific description out of the record's real fields
 * (location, status, partners…) instead of falling back to a generic one.
 */
export function composeDescription(
  parts: Array<string | null | undefined | false>,
  max: number = META_DESCRIPTION_MAX,
): string {
  const joined = parts
    .filter((p): p is string => Boolean(p && p.trim()))
    .map((p) => p.trim().replace(/\s*[.]$/, ""))
    .join(". ");
  return truncateForMeta(joined ? `${joined}.` : "", max);
}
