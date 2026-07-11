import Footer from "@/components/Footer";
import PartnerDetail from "@/components/public/PartnerDetail";
import { getPublicPartnerBySlug } from "@/lib/public/initiatives";
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
    const detail = await getPublicPartnerBySlug(slug);
    if (!detail) return {};
    const p = detail.partner;
    return {
      title: `${p.nameBg} — партньор | ТЕПЕ bite`,
      description: p.descriptionBg
        ? p.descriptionBg.slice(0, 160)
        : `${p.nameBg} — партньор на инициативите на ТЕПЕ bite.`,
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
