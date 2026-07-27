import "server-only";
import { getAllLocations, getAllNewsPosts } from "@/sanity/queries";
import { withContentSchemaFloor } from "./content-schema";
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

export type PublicPagesResult = {
  pages: PublicPage[];
  /**
   * True when at least one dynamic source failed to load, so the list is
   * missing a whole content type rather than genuinely being empty. Callers
   * must not cache a degraded list: a single transient MongoDB failure once
   * pinned an hour-long sitemap with zero initiative URLs, which silently
   * removed every initiative from the AI Search index.
   */
  degraded: boolean;
};

/**
 * Every public page, static first then dynamic (Mongo initiatives/partners,
 * Sanity news/locations). Transactional and private routes (`/cart`,
 * `/checkout`, `/order*`, `/admin/*`, `/studio/*`, `/api/*`) are deliberately
 * absent — they are also disallowed in robots.txt.
 */
export async function getPublicPagesResult(): Promise<PublicPagesResult> {
  const [initiatives, partners, news, locations] = await Promise.all([
    getPublishedInitiativeSlugs(),
    getPublicPartnerSlugs(),
    getAllNewsPosts().catch((err) => {
      console.error("sitemap: failed to load news posts:", err);
      return null;
    }),
    getAllLocations().catch((err) => {
      console.error("sitemap: failed to load locations:", err);
      return null;
    }),
  ]);

  const pages = [
    ...STATIC_PATHS.map((path) => ({ path })),
    // Initiative and partner pages carry a rendering-version floor as well as
    // their own `updatedAt` — a code change to how their facts are rendered
    // must invalidate them once, even though the records never moved. See
    // `content-schema.ts`. News/locations come from Sanity and are unaffected.
    ...(initiatives ?? []).map((i) => ({
      path: `/initiatives/${i.slug}`,
      lastModified: withContentSchemaFloor(i.updatedAt),
    })),
    ...(partners ?? []).map((p) => ({
      path: `/initiatives/partners/${p.slug}`,
      lastModified: withContentSchemaFloor(p.updatedAt),
    })),
    ...(news ?? []).map((n) => ({
      path: `/news/${n.slug.current}`,
      lastModified: n.publishedAt,
    })),
    ...(locations ?? []).map((l) => ({
      path: `/partnering-locations/${l.slug.current}`,
      lastModified: l._createdAt,
    })),
  ];

  return {
    pages,
    degraded: [initiatives, partners, news, locations].some((r) => r === null),
  };
}

/** Convenience wrapper for callers that cannot react to degradation. */
export async function getPublicPages(): Promise<PublicPage[]> {
  return (await getPublicPagesResult()).pages;
}
