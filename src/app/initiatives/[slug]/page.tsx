import Footer from "@/components/Footer";
import InitiativeDetail from "@/components/public/InitiativeDetail";
import { getPublicInitiativeBySlug } from "@/lib/public/initiatives";
import {
  composeDescription,
  getRequestLang,
  languageAlternates,
  META_DESCRIPTION_MAX,
  ogLocale,
  retrievalMeta,
} from "@/lib/i18n/metadata";
import {
  INITIATIVE_CATEGORY_LABELS,
  INITIATIVE_STATUS_LABELS,
} from "@/lib/dashboard/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

/**
 * Compose `lead` plus as many context fragments as fit whole inside the meta
 * description budget. A fragment that would be cut in half ("Локация: Гребна
 * ба…") is dropped instead, so a long initiative description simply keeps the
 * page's own words while a short one gets enriched with the published context.
 */
function packDescription(
  lead: string,
  extras: Array<string | false | null | undefined>,
): string {
  const parts = [lead];
  for (const extra of extras) {
    if (!extra) continue;
    const candidate = [...parts, extra].join(". ").replace(/\s+/g, " ");
    if (candidate.length + 1 <= META_DESCRIPTION_MAX) parts.push(extra);
  }
  return composeDescription(parts);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [detail, lang] = await Promise.all([
      getPublicInitiativeBySlug(slug),
      getRequestLang(),
    ]);
    if (!detail) return {};
    const i = detail.initiative;
    const en = lang === "en";
    const title = (en && i.titleEn) || i.titleBg;

    // Same fields the page body renders: description, location, category chip,
    // status. Nothing money-related or admin-only is exposed here.
    const own = ((en && i.descriptionEn) || i.descriptionBg || "").trim();
    const location = ((en && i.locationEn) || i.locationBg || "").trim();
    const statusLabel = INITIATIVE_STATUS_LABELS[i.status][en ? "en" : "bg"];
    const categoryLabel = i.category
      ? INITIATIVE_CATEGORY_LABELS[i.category][en ? "en" : "bg"]
      : "";

    const context = [
      location && (en ? `Location: ${location}` : `Локация: ${location}`),
      categoryLabel && (en ? `Category: ${categoryLabel}` : `Категория: ${categoryLabel}`),
      en ? `Status: ${statusLabel}` : `Статус: ${statusLabel}`,
    ];

    const description = packDescription(
      own || (en ? "A ТЕПЕ bite Impact initiative" : "Инициатива на ТЕПЕ bite Impact"),
      context,
    );

    return {
      title,
      description,
      alternates: languageAlternates(`/initiatives/${slug}`),
      openGraph: {
        title,
        description,
        images: i.coverImage ? [{ url: i.coverImage.url }] : [],
        type: "article",
        locale: ogLocale(lang),
      },
      other: retrievalMeta({
        lang,
        pageType: "initiative",
        topic: "initiatives",
        status: i.status,
      }),
    };
  } catch {
    return {};
  }
}

export default async function InitiativeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let detail;
  try {
    detail = await getPublicInitiativeBySlug(slug);
  } catch (err) {
    console.error("Failed to load initiative:", err);
    notFound();
  }
  if (!detail) notFound();

  return (
    <>
      <InitiativeDetail detail={detail} />
      <Footer />
    </>
  );
}
