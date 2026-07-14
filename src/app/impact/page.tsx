import Footer from "@/components/Footer";
import ImpactPageContent from "@/components/impact/ImpactPageContent";
import { RECONNECT_INITIATIVE_ID } from "@/lib/config/initiatives";
import {
  getPublicInitiativeById,
  getPublicOverviewData,
  type InitiativeDetail,
  type OverviewData,
} from "@/lib/public/initiatives";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import type { Metadata } from "next";

// ISR: derive the overview + pinned deep-dive once, refresh every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "ТЕПЕ bite Impact | Инициативи за Пловдив",
  description:
    "ТЕПЕ bite Impact е социалната ни дейност за Пловдив: избираме видими инициативи, работим с партньори, общини и външно финансиране, а фиксираните 0.15 € от всяко барче захранват фонда. Всичко — открито и отчетено.",
  keywords: [
    "ТЕПЕ bite",
    "ТЕПЕ bite Impact",
    "Пловдив",
    "инициативи",
    "прозрачност",
    "партньори",
    "социално въздействие",
    "0.15 €",
  ],
  openGraph: {
    title: "ТЕПЕ bite Impact | Инициативи за Пловдив",
    description:
      "Видими инициативи за Пловдив през ТЕПЕ bite Impact — партньори, външно финансиране и фиксираните 0.15 € от всяко барче, отчетени открито.",
    type: "website",
    images: [{ url: "/TEPEbiteImpact.png" }],
  },
  alternates: {
    languages: {
      bg: "/impact",
      en: "/impact",
    },
  },
};

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

/**
 * Pick the initiative for the dynamic hero "focus" card.
 *
 * Default to the most recent / most active initiative, but if that one already
 * appears elsewhere on this page (the §2 type-proof card or the §5 deep-dive),
 * spotlight a *different* realised/active one at random so the page shows variety
 * instead of the same initiative three times. Picked on the server so the choice
 * is stable within the ISR window and can't cause a hydration mismatch.
 */
function pickHeroInitiative(
  data: OverviewData,
  alreadyShownIds: Set<string>,
): InitiativeDTO | null {
  const preferred: InitiativeDTO[] = [
    ...data.byStatus.in_progress,
    ...data.recentlyCompleted,
    ...data.byStatus.done.filter(
      (i) => !data.recentlyCompleted.some((r) => r.id === i.id),
    ),
  ];

  const seen = new Set<string>();
  const pool = preferred.filter((i) => (seen.has(i.id) ? false : seen.add(i.id)));

  if (pool.length === 0) return null;

  const primary = pool[0];
  if (!alreadyShownIds.has(primary.id)) return primary;

  const fresh = pool.filter((i) => !alreadyShownIds.has(i.id));
  if (fresh.length > 0) return fresh[Math.floor(Math.random() * fresh.length)];

  return primary;
}

export default async function ImpactPage() {
  let data: OverviewData;
  let reconnect: InitiativeDetail | null = null;
  try {
    [data, reconnect] = await Promise.all([
      getPublicOverviewData(),
      getPublicInitiativeById(RECONNECT_INITIATIVE_ID),
    ]);
  } catch (err) {
    // Never hard-fail the public page if the datastore is unreachable.
    console.error("Failed to load impact page data:", err);
    data = EMPTY_OVERVIEW;
    reconnect = null;
  }

  // Ids that already appear elsewhere: the deep-dive subject and the §2 card.
  const deepDive = data.featured ?? reconnect?.initiative ?? null;
  const alreadyShownIds = new Set<string>();
  if (deepDive) alreadyShownIds.add(deepDive.id);
  if (reconnect?.initiative) alreadyShownIds.add(reconnect.initiative.id);

  const heroPick = pickHeroInitiative(data, alreadyShownIds);

  return (
    <>
      <main>
        <ImpactPageContent data={data} reconnect={reconnect} heroPick={heroPick} />
      </main>
      <Footer />
    </>
  );
}
