import Footer from "@/components/Footer";
import InitiativesOverview from "@/components/public/InitiativesOverview";
import {
  getPublicOverviewData,
  type OverviewData,
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
  const title = en ? "Our initiatives" : "Нашите инициативи";
  const description = en
    ? "A transparent overview of ТЕПЕ bite's initiatives for Plovdiv — money invested, partners, progress and every inflow."
    : "Прозрачен преглед на инициативите на ТЕПЕ bite за Пловдив — вложени средства, партньори, напредък и всяко постъпление.";
  return {
    title,
    description,
    keywords: [
      "ТЕПЕ bite",
      "ТЕПЕ bite Impact",
      en ? "initiatives" : "инициативи",
      "Пловдив",
      en ? "transparency" : "прозрачност",
      en ? "partners" : "партньори",
      en ? "social impact" : "социално въздействие",
    ],
    alternates: languageAlternates("/initiatives"),
    openGraph: {
      title: en
        ? "Our initiatives | ТЕПЕ bite"
        : "Нашите инициативи | ТЕПЕ bite",
      description: en
        ? "A transparent overview of ТЕПЕ bite's social initiatives for Plovdiv."
        : "Прозрачен преглед на социалните инициативи на ТЕПЕ bite за Пловдив.",
      type: "website",
      locale: ogLocale(lang),
    },
    other: retrievalMeta({ lang, pageType: "listing", topic: "initiatives" }),
  };
}

const EMPTY_OVERVIEW: OverviewData = {
  stats: {
    investedImpactCents: 0,
    investedExternalCents: 0,
    investedTotalCents: 0,
    plannedTotalCents: 0,
    arrangedTotalCents: 0,
    fundedImpactAllPhasesCents: 0,
    fundedExternalAllPhasesCents: 0,
    accountedExpensesTotalCents: 0,
    realisedCount: 0,
    partnerCount: 0,
  },
  featured: null,
  partners: [],
  byStatus: { planned: [], in_progress: [], frozen: [], done: [] },
  recentlyCompleted: [],
  hasAnyInitiative: false,
  hasAnyPartner: false,
};

export default async function InitiativesRegistryPage() {
  let data: OverviewData;
  try {
    data = await getPublicOverviewData();
  } catch (err) {
    // Never hard-fail the public page if the datastore is unreachable.
    console.error("Failed to load initiatives overview:", err);
    data = EMPTY_OVERVIEW;
  }

  return (
    <>
      <InitiativesOverview data={data} />
      <Footer />
    </>
  );
}
