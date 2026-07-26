import { SITE_URL } from "@/lib/config/site-info";
import {
  getPublicPagesResult,
  type PublicPage,
} from "@/lib/public/public-pages";
import { LANGS, type Lang } from "@/store/lang";

/**
 * Retrieval-oriented sitemap for Cloudflare AI Search.
 *
 * Unlike `/sitemap.xml` (which lists clean canonical URLs for normal SEO), this
 * feed lists ONLY the explicit `?lang=bg` / `?lang=en` variants of each public
 * page. The unparameterised URL is deliberately excluded: it renders Bulgarian
 * by default, so indexing it too would feed the retriever a duplicate of every
 * Bulgarian document and skew results toward Bulgarian.
 *
 * Each entry still carries `xhtml:link` alternates for the whole language pair,
 * so the crawler can tell the two variants are translations of one another
 * rather than unrelated pages.
 */
export const revalidate = 3600;

/** Escape the five XML predefined entities. URLs here carry a `?lang=` query,
 * so `&` would break the document if a path ever gained a second parameter. */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Absolute URL for one language variant. The homepage keeps its trailing
 * slash (`/?lang=bg`) so these match the hreflang tags rendered on the pages. */
function langUrl(path: string, lang: Lang): string {
  return `${SITE_URL}${path}?lang=${lang}`;
}

function toW3CDate(value: Date | string): string | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** One `<url>` block per language variant, cross-linked to its siblings. */
function urlEntry(page: PublicPage, lang: Lang): string {
  const lastmod = page.lastModified ? toW3CDate(page.lastModified) : null;
  const alternates = LANGS.map(
    (alt) =>
      `    <xhtml:link rel="alternate" hreflang="${alt}" href="${xmlEscape(
        langUrl(page.path, alt),
      )}" />`,
  ).join("\n");

  return [
    "  <url>",
    `    <loc>${xmlEscape(langUrl(page.path, lang))}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    alternates,
    "  </url>",
  ].join("\n");
}

export async function GET(): Promise<Response> {
  const { pages, degraded } = await getPublicPagesResult();

  // Group by page so both language variants of a page sit next to each other.
  const body = pages
    .flatMap((page) => LANGS.map((lang) => urlEntry(page, lang)))
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // A degraded feed is missing a whole content type (a datastore read
      // failed), so it must never be cached: one transient MongoDB failure
      // previously pinned an incomplete feed for an hour and every initiative
      // and partner URL disappeared from the AI Search index.
      "Cache-Control": degraded
        ? "no-store"
        : "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      ...(degraded ? { "X-Sitemap-Degraded": "1" } : {}),
    },
  });
}
