import Footer from "@/components/Footer";
import InitiativesClient from "@/components/InitiativesClient";
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
  title: "Нашите инициативи | ТЕПЕ bite",
  description:
    "Как ТЕПЕ bite превръща всяко барче в реална промяна за Пловдив: фиксирани 0.15 € във фонд ТЕПЕ bite Impact, умножени чрез партньори, и всяко евро — публикувано открито.",
  keywords: [
    "ТЕПЕ bite",
    "ТЕПЕ bite Impact",
    "инициативи",
    "Пловдив",
    "прозрачност",
    "партньори",
    "социално въздействие",
  ],
  openGraph: {
    title: "Нашите инициативи | ТЕПЕ bite",
    description:
      "Видими инициативи за Пловдив, захранвани от фонд ТЕПЕ bite Impact — прозрачно, с партньори, с публикувано всяко евро.",
    type: "website",
  },
  alternates: {
    languages: {
      bg: "/initiatives",
      en: "/initiatives",
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
 * Rule (product): default to the most recent / most active initiative, but if
 * that one already appears elsewhere on this page (the §2 type-proof card or the
 * §3 deep-dive), spotlight a *different* one chosen at random so the page shows
 * variety instead of the same initiative three times.
 *
 * The random pool is restricted to realised (done) and active (in_progress)
 * initiatives — a "focus" spotlight should celebrate real work, not a planned or
 * frozen one. If none of those are free, we fall back to the default (the
 * RepeatNote in the client then flags the intentional repeat).
 *
 * Picked on the server so the choice is stable within the ISR window and can't
 * cause a hydration mismatch.
 */
function pickHeroInitiative(
  data: OverviewData,
  alreadyShownIds: Set<string>,
): InitiativeDTO | null {
  // Preference order: active first, then most-recently completed.
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

  // Primary is already on the page → prefer a fresh done/in_progress at random.
  const fresh = pool.filter((i) => !alreadyShownIds.has(i.id));
  if (fresh.length > 0) return fresh[Math.floor(Math.random() * fresh.length)];

  // Everything is already shown — repeat the primary (RepeatNote will explain).
  return primary;
}

export default async function InitiativesPage() {
  let data: OverviewData;
  let reconnect: InitiativeDetail | null = null;
  try {
    [data, reconnect] = await Promise.all([
      getPublicOverviewData(),
      getPublicInitiativeById(RECONNECT_INITIATIVE_ID),
    ]);
  } catch (err) {
    // Never hard-fail the public page if the datastore is unreachable.
    console.error("Failed to load initiatives page data:", err);
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
        <InitiativesClient data={data} reconnect={reconnect} heroPick={heroPick} />
      </main>
      <Footer />
    </>
  );
}
