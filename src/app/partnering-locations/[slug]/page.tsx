import Footer from "@/components/Footer";
import LocationDetail from "@/components/locations/LocationDetail";
import { getAllLocationSlugs, getLocationBySlug } from "@/sanity/queries";
import {
  composeDescription,
  getRequestLang,
  languageAlternates,
  ogLocale,
  retrievalMeta,
} from "@/lib/i18n/metadata";
import { transliterateAddress } from "@/utils/transliterate";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

/**
 * Minimal portable-text reader: concatenates the spans of top-level blocks.
 * Anything that is not a plain block with string children (custom objects,
 * embeds) is skipped rather than rendered as broken text.
 */
function portableTextToPlainText(
  blocks: Array<{ _type: string; [key: string]: unknown }> | undefined,
): string {
  if (!Array.isArray(blocks)) return "";
  const paragraphs: string[] = [];
  for (const block of blocks) {
    if (!block || block._type !== "block") continue;
    const children = block.children;
    if (!Array.isArray(children)) continue;
    const text = children
      .map((child) =>
        child && typeof child === "object" && typeof (child as { text?: unknown }).text === "string"
          ? (child as { text: string }).text
          : "",
      )
      .join("")
      .trim();
    if (text) paragraphs.push(text);
  }
  return paragraphs.join(" ").replace(/\s+/g, " ").trim();
}

/** Month + year, matching how the page prints `partneringSince`. */
function formatPartneringSince(dateStr: string, en: boolean): string {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(en ? "en-GB" : "bg-BG", {
    month: "long",
    year: "numeric",
  });
}

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
    const title = name;

    // Address is transliterated for EN exactly as the page body renders it;
    // the neighbourhood gets the same treatment so the English sentence stays
    // in one script (Sanity has no separate `neighborhoodEn`).
    const address = en ? transliterateAddress(loc.address) : loc.address;
    const rawNeighborhood = loc.neighborhood?.trim();
    const neighborhood =
      rawNeighborhood && en ? transliterateAddress(rawNeighborhood) : rawNeighborhood;
    const place = neighborhood ? `${name} — ${neighborhood}, ${address}` : `${name}, ${address}`;
    const since = formatPartneringSince(loc.partneringSince, en);
    const blurb = portableTextToPlainText(
      en && loc.descriptionEn?.length ? loc.descriptionEn : loc.descriptionBg,
    );

    const description = composeDescription([
      en ? `Find ТЕПЕ bite at ${place}` : `Намери ТЕПЕ bite в ${place}`,
      since && (en ? `Partner since ${since}` : `Партньор от ${since}`),
      blurb,
    ]);

    return {
      title,
      description,
      alternates: languageAlternates(`/partnering-locations/${slug}`),
      openGraph: { title, description, locale: ogLocale(lang) },
      other: retrievalMeta({ lang, pageType: "location", topic: "stores" }),
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
