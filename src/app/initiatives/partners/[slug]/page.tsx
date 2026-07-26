import Footer from "@/components/Footer";
import PartnerDetail from "@/components/public/PartnerDetail";
import { getPublicPartnerBySlug } from "@/lib/public/initiatives";
import {
  composeDescription,
  getRequestLang,
  languageAlternates,
  META_DESCRIPTION_MAX,
  ogLocale,
  retrievalMeta,
} from "@/lib/i18n/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

/**
 * Compose `lead` plus as many short facts as fit whole inside the meta
 * description budget — a fact that would be cut in half ("Involved in 2 ТЕПЕ
 * bite…") is dropped instead of half-rendered.
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
      getPublicPartnerBySlug(slug),
      getRequestLang(),
    ]);
    if (!detail) return {};
    const p = detail.partner;
    const en = lang === "en";
    const name = (en && p.nameEn) || p.nameBg;
    const desc = ((en && p.descriptionEn) || p.descriptionBg || "").trim();
    const title = en ? `${name} — partner` : `${name} — партньор`;

    // Only the badges the profile itself shows, and only when actually true.
    const traits = [
      p.isStarPartner && (en ? "Star partner" : "Звезден партньор"),
      p.isYouthLed && (en ? "Youth-led organisation" : "Младежка организация"),
    ];

    // The same count the page renders in its summary ("Инициативи / Initiatives").
    const count = detail.initiatives.length;
    const involvement =
      count > 0 &&
      (en
        ? `Involved in ${count} ТЕПЕ bite Impact initiative${count === 1 ? "" : "s"}`
        : `Участва в ${count} ${count === 1 ? "инициатива" : "инициативи"} на ТЕПЕ bite Impact`);

    const description = packDescription(
      desc ||
        (en
          ? `${name} — a partner in ТЕПЕ bite's initiatives`
          : `${name} — партньор на инициативите на ТЕПЕ bite`),
      [...traits, involvement],
    );

    return {
      title,
      description,
      alternates: languageAlternates(`/initiatives/partners/${slug}`),
      openGraph: { title, description, locale: ogLocale(lang) },
      other: retrievalMeta({ lang, pageType: "partner", topic: "partners" }),
    };
  } catch {
    return {};
  }
}

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let detail;
  try {
    detail = await getPublicPartnerBySlug(slug);
  } catch (err) {
    console.error("Failed to load partner:", err);
    notFound();
  }
  if (!detail) notFound();

  return (
    <>
      <PartnerDetail detail={detail} />
      <Footer />
    </>
  );
}
