import AboutPageContent from "@/components/about/AboutPageContent";
import Footer from "@/components/Footer";
import { RECONNECT_INITIATIVE_ID } from "@/lib/config/initiatives";
import {
  getPublicInitiativeById,
  getYouthLedPartnersEnriched,
  type InitiativeDetail,
  type PartnerCarouselItem,
} from "@/lib/public/initiatives";
import {
  getRequestLang,
  languageAlternates,
  ogLocale,
  retrievalMeta,
} from "@/lib/i18n/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const en = lang === "en";
  const title = en
    ? "About us — the young people behind the bar with a cause"
    : "За нас — младежите зад барчето с кауза";
  const description = en
    ? "The ТЕПЕ bite story: a student team from Plovdiv building a real brand with a cause. Our path from Teenovator to our first initiative, the team, our partners and the support of Fantastico."
    : "Историята на ТЕПЕ bite: ученически екип от Пловдив, който изгражда истински бранд с кауза. Пътят ни от Teenovator до първата инициатива, екипът, партньорите и подкрепата на Fantastico.";
  return {
    title,
    description,
    keywords: [
      "ТЕПЕ bite",
      en ? "about us" : "за нас",
      "Пловдив",
      "Teenovator",
      "Fantastico",
      en ? "youth entrepreneurship" : "младежко предприемачество",
      "ТЕПЕ bite Impact",
    ],
    alternates: languageAlternates("/about"),
    openGraph: {
      title: en ? "About us | ТЕПЕ bite" : "За нас | ТЕПЕ bite",
      description: en
        ? "The story of a brand by people from Plovdiv, for Plovdiv — the young people behind the bar with a cause."
        : "Историята на един бранд от Пловдивчани, за Пловдив — младежите зад барчето с кауза.",
      type: "website",
      images: [{ url: "/photos/team.jpg" }],
      locale: ogLocale(lang),
    },
    other: retrievalMeta({ lang, pageType: "about", topic: "team-story" }),
  };
}

export default async function AboutPage() {
  let reconnect: InitiativeDetail | null = null;
  let youthPartners: PartnerCarouselItem[] = [];
  try {
    [reconnect, youthPartners] = await Promise.all([
      getPublicInitiativeById(RECONNECT_INITIATIVE_ID),
      getYouthLedPartnersEnriched(),
    ]);
  } catch (err) {
    // Never hard-fail the public page if the datastore is unreachable.
    console.error("Failed to load about page data:", err);
    reconnect = null;
    youthPartners = [];
  }

  return (
    <>
      <main>
        <AboutPageContent reconnect={reconnect} youthPartners={youthPartners} />
      </main>
      <Footer />
    </>
  );
}
