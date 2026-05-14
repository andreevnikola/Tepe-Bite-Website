import Footer from "@/components/Footer";
import LocationDetail from "@/components/locations/LocationDetail";
import { getAllLocationSlugs, getLocationBySlug } from "@/sanity/queries";
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
    const loc = await getLocationBySlug(slug);
    if (!loc) return {};
    return {
      title: `${loc.nameBg} — ТЕПЕ bite`,
      description: `Намери ТЕПЕ bite в ${loc.nameBg}, ${loc.address}.`,
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
