import Footer from "@/components/Footer";
import InitiativeDetail from "@/components/public/InitiativeDetail";
import { getPublicInitiativeBySlug } from "@/lib/public/initiatives";
import {
  contentMeta,
  getRequestLang,
  languageAlternates,
  ogLocale,
} from "@/lib/i18n/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

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
    const title = `${(en && i.titleEn) || i.titleBg} | ТЕПЕ bite`;
    const description = ((en && i.descriptionEn) || i.descriptionBg).slice(0, 160);
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
      other: contentMeta(lang, "initiative", { "initiative-status": i.status }),
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
