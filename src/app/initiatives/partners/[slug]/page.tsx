import Footer from "@/components/Footer";
import PartnerDetail from "@/components/public/PartnerDetail";
import { getPublicPartnerBySlug } from "@/lib/public/initiatives";
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
      getPublicPartnerBySlug(slug),
      getRequestLang(),
    ]);
    if (!detail) return {};
    const p = detail.partner;
    const en = lang === "en";
    const name = (en && p.nameEn) || p.nameBg;
    const desc = (en && p.descriptionEn) || p.descriptionBg;
    const title = en
      ? `${name} — partner | ТЕПЕ bite`
      : `${name} — партньор | ТЕПЕ bite`;
    const description = desc
      ? desc.slice(0, 160)
      : en
        ? `${name} — a partner in ТЕПЕ bite's initiatives.`
        : `${name} — партньор на инициативите на ТЕПЕ bite.`;
    return {
      title,
      description,
      alternates: languageAlternates(`/initiatives/partners/${slug}`),
      openGraph: { title, description, locale: ogLocale(lang) },
      other: contentMeta(lang, "partner"),
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
