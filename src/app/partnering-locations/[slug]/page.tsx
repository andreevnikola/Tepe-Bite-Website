import Footer from "@/components/Footer";
import LocationDetail from "@/components/locations/LocationDetail";
import { getAllLocationSlugs, getLocationBySlug } from "@/sanity/queries";
import {
  contentMeta,
  getRequestLang,
  languageAlternates,
  ogLocale,
} from "@/lib/i18n/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllLocationSlugs();
    return slugs.map((s) => ({ slug: s.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [loc, lang] = await Promise.all([
      getLocationBySlug(slug),
      getRequestLang(),
    ]);
    if (!loc) return {};
    const en = lang === "en";
    const name = (en && loc.nameEn) || loc.nameBg;
    const title = `${name} — ТЕПЕ bite`;
    const description = en
      ? `Find ТЕПЕ bite at ${name}, ${loc.address}.`
      : `Намери ТЕПЕ bite в ${name}, ${loc.address}.`;
    return {
      title,
      description,
      alternates: languageAlternates(`/partnering-locations/${slug}`),
      openGraph: { title, description, locale: ogLocale(lang) },
      other: contentMeta(lang, "location"),
    };
  } catch {
    return {};
  }
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let location;
  try {
    location = await getLocationBySlug(slug);
  } catch {
    notFound();
  }
  if (!location) notFound();

  return (
    <main>
      <LocationDetail location={location} />
      <Footer />
    </main>
  );
}
