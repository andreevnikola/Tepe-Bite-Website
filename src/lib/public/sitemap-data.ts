import "server-only";
import { getMongoose } from "@/lib/mongo";
import { Initiative } from "@/lib/mongo/models/Initiative";
import { Partner } from "@/lib/mongo/models/Partner";

/**
 * Lightweight slug + lastmod feeds for the sitemap. Deliberately projected to
 * just `slug` + `updatedAt` (never the full documents) and resilient: a
 * datastore hiccup returns an empty list so the sitemap still builds instead
 * of failing the whole route. `updatedAt` comes from Mongoose `{timestamps}`.
 */
export type SitemapSlug = { slug: string; updatedAt: Date };

export async function getPublishedInitiativeSlugs(): Promise<SitemapSlug[]> {
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
    return [];
  }
}

export async function getPublicPartnerSlugs(): Promise<SitemapSlug[]> {
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
