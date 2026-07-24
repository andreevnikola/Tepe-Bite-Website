import { SITE_URL } from "@/lib/config/site-info";
import {
  getPublicPartnerSlugs,
  getPublishedInitiativeSlugs,
} from "@/lib/public/sitemap-data";
import { getAllLocations, getAllNewsPosts } from "@/sanity/queries";
import type { MetadataRoute } from "next";

// Regenerate at most hourly so lastmod tracks real content changes (via ISR)
// without recomputing the datastore reads on every crawl hit.
export const revalidate = 3600;

/** Public routes that are always present. `lastModified` is intentionally
 * omitted — we have no per-page content timestamp, and emitting `now` on every
 * regeneration would falsely flag them as freshly modified. */
const STATIC_PATHS = [
  "/",
  "/about",
  "/impact",
  "/product",
  "/initiatives",
  "/news",
  "/partnering-locations",
  "/links",
  "/legal",
  "/legal/cookies",
  "/legal/delivery-payment",
  "/legal/initiative-transparency",
  "/legal/privacy",
  "/legal/product-info",
  "/legal/returns-complaints",
  "/legal/terms",
  "/legal/trader-info",
  "/legal/withdrawal-form",
] as const;

/** Build one sitemap entry with clean canonical URL + bg/en `?lang=` hreflang
 * alternates so crawlers and Cloudflare AI Search discover both languages. */
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
  const [initiatives, partners, news, locations] = await Promise.all([
    getPublishedInitiativeSlugs(),
    getPublicPartnerSlugs(),
    getAllNewsPosts(),
    getAllLocations(),
  ]);

  return [
    ...STATIC_PATHS.map((p) => entry(p)),
    ...initiatives.map((i) => entry(`/initiatives/${i.slug}`, i.updatedAt)),
    ...partners.map((p) =>
      entry(`/initiatives/partners/${p.slug}`, p.updatedAt),
    ),
    ...news.map((n) => entry(`/news/${n.slug.current}`, n.publishedAt)),
    ...locations.map((l) =>
      entry(`/partnering-locations/${l.slug.current}`, l._createdAt),
    ),
  ];
}
