import LinksClient from "@/components/links/LinksClient";
import { getFeaturedInitiative } from "@/lib/public/initiatives";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import {
  getRequestLang,
  languageAlternates,
  ogLocale,
  retrievalMeta,
} from "@/lib/i18n/metadata";
import type { Metadata } from "next";

// ISR: cache the featured spotlight and refresh every 5 minutes.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const en = lang === "en";
  const title = en ? "All links" : "Всички връзки";
  const description = en
    ? "Find ТЕПЕ bite in one place — order online, follow our initiatives for Plovdiv and get in touch."
    : "Открий ТЕПЕ bite на едно място — поръчай онлайн, следи инициативите ни за Пловдив и се свържи с нас.";
  return {
    title,
    description,
    alternates: languageAlternates("/links"),
    openGraph: {
      title: en ? "ТЕПЕ bite — All links" : "ТЕПЕ bite — Всички връзки",
      description: en
        ? "Delicious for you. Meaningful for the community."
        : "Вкусно за теб. Смислено за общността.",
      type: "website",
      locale: ogLocale(lang),
    },
    other: retrievalMeta({ lang, pageType: "links", topic: "links" }),
  };
}

export default async function LinksPage() {
  let featured: InitiativeDTO | null = null;
  try {
    featured = await getFeaturedInitiative();
  } catch (err) {
    // Never hard-fail the hub if the datastore is unreachable — just hide the card.
    console.error("Failed to load featured initiative for /links:", err);
  }

  return <LinksClient featured={featured} />;
}
