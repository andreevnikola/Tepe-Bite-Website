import "server-only";
import { getMongoose } from "@/lib/mongo";
import { Initiative } from "@/lib/mongo/models/Initiative";
import { Partner } from "@/lib/mongo/models/Partner";

/**
 * Lightweight slug + lastmod feeds for the sitemap. Deliberately projected to
 * just `slug` + `updatedAt` (never the full documents) and resilient: a
 * datastore hiccup returns `null` so the sitemap still builds instead of
 * failing the whole route. `updatedAt` comes from Mongoose `{timestamps}`.
 *
 * `null` (read failed) and `[]` (genuinely no records) are deliberately
 * distinct: callers must not cache a feed that silently lost a whole content
 * type. A degraded feed once pinned an hour-long cache with zero initiative
 * URLs, which removed them from the AI Search index entirely.
 */
export type SitemapSlug = { slug: string; updatedAt: Date };

export async function getPublishedInitiativeSlugs(): Promise<SitemapSlug[] | null> {
  try {
    await getMongoose();
    const docs = await Initiative.find(
      { isPublished: true },
      "slug updatedAt",
    ).lean();
    return docs
      .filter((d): d is typeof d & { slug: string } => Boolean(d.slug))
      .map((d) => ({ slug: d.slug, updatedAt: d.updatedAt ?? new Date() }));
  } catch (err) {
    console.error("sitemap: failed to load initiative slugs:", err);
    return null;
  }
}

export async function getPublicPartnerSlugs(): Promise<SitemapSlug[] | null> {
  try {
    await getMongoose();
    const docs = await Partner.find(
      { slug: { $exists: true, $ne: null } },
      "slug updatedAt",
    ).lean();
    return docs
      .filter((d): d is typeof d & { slug: string } => Boolean(d.slug))
      .map((d) => ({ slug: d.slug, updatedAt: d.updatedAt ?? new Date() }));
  } catch (err) {
    console.error("sitemap: failed to load partner slugs:", err);
    return [];
  }
}
