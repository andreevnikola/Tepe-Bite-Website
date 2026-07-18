import AboutTeaser from "@/components/AboutTeaser";
import Community from "@/components/Community";
import FantasticoTrust from "@/components/FantasticoTrust";
import FirstInitiative from "@/components/FirstInitiative";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MissionSection from "@/components/WhySection";
import NewsStrip from "@/components/NewsStrip";
import OrderOnlineStrip from "@/components/OrderOnlineStrip";
import PartnersImpactSection from "@/components/PartnersImpactSection";
import ProductSection from "@/components/ProductSection";
import StoresSection from "@/components/StoresSection";
import TrustSection from "@/components/TrustSection";
import { RECONNECT_INITIATIVE_ID } from "@/lib/config/initiatives";
import {
  getPublicInitiativeById,
  getPublicOverviewData,
  getYouthLedPartnersEnriched,
  type InitiativeDetail,
  type OverviewData,
  type PartnerCarouselItem,
} from "@/lib/public/initiatives";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import { getAllNewsPosts } from "@/sanity/queries";

// ISR: the landing now derives Impact-fund initiatives, the pinned first
// initiative and the youth partners from the datastore. Cache the work and
// refresh every 5 minutes, matching the other data-driven public pages.
export const revalidate = 300;

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
 * Ordered set of initiatives for the Mission "portfolio" rail. The flagship
 * (featured / "start") initiative leads; then completed initiatives most-recent
 * first; then in-progress, planned and frozen. Deduped and capped at 3. Derived
 * on the server so the choice is stable within the ISR window.
 */
function pickMissionCards(data: OverviewData): InitiativeDTO[] {
  const doneByRecent = [...data.byStatus.done].sort((a, b) =>
    (b.completionDateISO || "").localeCompare(a.completionDateISO || ""),
  );
  const ordered: InitiativeDTO[] = [
    ...(data.featured ? [data.featured] : []),
    ...doneByRecent,
    ...data.byStatus.in_progress,
    ...data.byStatus.planned,
    ...data.byStatus.frozen,
  ];
  const seen = new Set<string>();
  const out: InitiativeDTO[] = [];
  for (const i of ordered) {
    if (seen.has(i.id)) continue;
    seen.add(i.id);
    out.push(i);
    if (out.length >= 3) break;
  }
  return out;
}

export default async function Home() {
  const allPosts = await getAllNewsPosts();
  const latestPosts = allPosts.slice(0, 4);

  let overview: OverviewData = EMPTY_OVERVIEW;
  let reconnect: InitiativeDetail | null = null;
  let youthPartners: PartnerCarouselItem[] = [];
  try {
    [overview, reconnect, youthPartners] = await Promise.all([
      getPublicOverviewData(),
      getPublicInitiativeById(RECONNECT_INITIATIVE_ID),
      getYouthLedPartnersEnriched(),
    ]);
  } catch (err) {
    // Never hard-fail the landing page if the datastore is unreachable.
    console.error("Failed to load landing page data:", err);
    overview = EMPTY_OVERVIEW;
    reconnect = null;
    youthPartners = [];
  }

  const missionCards = pickMissionCards(overview);

  // Total distinct initiatives across every status. Drives the portfolio rail's
  // trailing "see more" card: it only appears when more exist than the rail shows.
  const totalInitiatives = new Set(
    [
      ...overview.byStatus.in_progress,
      ...overview.byStatus.done,
      ...overview.byStatus.planned,
      ...overview.byStatus.frozen,
    ].map((i) => i.id),
  ).size;
  const moreCount = Math.max(0, totalInitiatives - missionCards.length);

  return (
    <>
      <main>
        <Hero />
        <ProductSection />
        <MissionSection cards={missionCards} moreCount={moreCount} />
        <FirstInitiative reconnect={reconnect} />
        <PartnersImpactSection youthPartners={youthPartners} />
        <FantasticoTrust />
        {latestPosts.length > 0 && <NewsStrip posts={latestPosts} />}
        <AboutTeaser />
        <TrustSection />
        <StoresSection />
        <OrderOnlineStrip />
        <Community />
      </main>
      <Footer />
    </>
  );
}
