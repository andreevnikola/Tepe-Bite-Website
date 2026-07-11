import Footer from "@/components/Footer";
import InitiativesOverview from "@/components/public/InitiativesOverview";
import { getPublicOverviewData, type OverviewData } from "@/lib/public/initiatives";
import type { Metadata } from "next";

// ISR: cache the derived overview and refresh every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Всички социални инициативи | ТЕПЕ bite",
  description:
    "Прозрачен преглед на инициативите на ТЕПЕ bite за Пловдив — вложени средства, партньори, напредък и всяко постъпление.",
  openGraph: {
    title: "Всички социални инициативи | ТЕПЕ bite",
    description:
      "Прозрачен преглед на социалните инициативи на ТЕПЕ bite за Пловдив.",
    type: "website",
  },
};

const EMPTY_OVERVIEW: OverviewData = {
  stats: {
    investedImpactCents: 0,
    investedExternalCents: 0,
    investedTotalCents: 0,
    plannedTotalCents: 0,
    arrangedTotalCents: 0,
    realisedCount: 0,
    partnerCount: 0,
  },
  featured: null,
  partners: [],
  byStatus: { planned: [], in_progress: [], frozen: [], done: [] },
  hasAnyInitiative: false,
  hasAnyPartner: false,
};

export default async function InitiativesOverviewPage() {
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
