import "server-only";
import { getAllLocations, getAllNewsPosts } from "@/sanity/queries";
import {
  getPublicPartnerSlugs,
  getPublishedInitiativeSlugs,
} from "./sitemap-data";

/**
 * Single source of truth for the public, indexable page list. Shared by the SEO
 * sitemap (`/sitemap.xml`, clean canonical URLs) and the AI Search sitemap
 * (`/ai-sitemap.xml`, explicit ?lang= variants) so the two can never drift.
 */
export type PublicPage = {
  /** Route path, always leading-slash. `/` for the homepage. */
  path: string;
  /** Real content timestamp; omitted for static pages that have none. */
  lastModified?: Date | string;
};

/** Public routes that are always present. `lastModified` is intentionally
 * omitted — we have no per-page content timestamp, and emitting `now` on every
 * regeneration would falsely flag them as freshly modified. */
export const STATIC_PATHS = [
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

/**
 * Every public page, static first then dynamic (Mongo initiatives/partners,
 * Sanity news/locations). Transactional and private routes (`/cart`,
 * `/checkout`, `/order*`, `/admin/*`, `/studio/*`, `/api/*`) are deliberately
 * absent — they are also disallowed in robots.txt.
 */
export async function getPublicPages(): Promise<PublicPage[]> {
  const [initiatives, partners, news, locations] = await Promise.all([
    getPublishedInitiativeSlugs(),
    getPublicPartnerSlugs(),
    getAllNewsPosts(),
    getAllLocations(),
  ]);

  return [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...initiatives.map((i) => ({
      path: `/initiatives/${i.slug}`,
      lastModified: i.updatedAt,
    })),
    ...partners.map((p) => ({
      path: `/initiatives/partners/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...news.map((n) => ({
      path: `/news/${n.slug.current}`,
      lastModified: n.publishedAt,
    })),
    ...locations.map((l) => ({
      path: `/partnering-locations/${l.slug.current}`,
      lastModified: l._createdAt,
    })),
  ];
}
