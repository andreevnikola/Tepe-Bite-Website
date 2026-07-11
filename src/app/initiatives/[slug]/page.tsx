import Footer from "@/components/Footer";
import InitiativeDetail from "@/components/public/InitiativeDetail";
import { getPublicInitiativeBySlug } from "@/lib/public/initiatives";
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
    const detail = await getPublicInitiativeBySlug(slug);
    if (!detail) return {};
    const i = detail.initiative;
    return {
      title: `${i.titleBg} | ТЕПЕ bite`,
      description: i.descriptionBg.slice(0, 160),
      openGraph: {
        title: `${i.titleBg} | ТЕПЕ bite`,
        description: i.descriptionBg.slice(0, 160),
        images: i.coverImage ? [{ url: i.coverImage.url }] : [],
        type: "article",
      },
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
