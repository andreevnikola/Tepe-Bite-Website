import { SITE_URL } from "@/lib/config/site-info";
import { getPublicPages } from "@/lib/public/public-pages";
import type { MetadataRoute } from "next";

// Regenerate at most hourly so lastmod tracks real content changes (via ISR)
// without recomputing the datastore reads on every crawl hit.
export const revalidate = 3600;

/** Build one sitemap entry with clean canonical URL + bg/en `?lang=` hreflang
 * alternates so crawlers discover both languages. The unparameterised URL is the
 * one we want ranked; `/ai-sitemap.xml` is the separate retrieval-oriented feed
 * that lists the explicit language variants instead. */
function entry(
  path: string,
  lastModified?: Date | string,
): MetadataRoute.Sitemap[number] {
  const clean = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    url: clean,
    ...(lastModified ? { lastModified } : {}),
    alternates: {
      languages: {
        bg: `${clean}?lang=bg`,
        en: `${clean}?lang=en`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublicPages();
  return pages.map((p) => entry(p.path, p.lastModified));
}
