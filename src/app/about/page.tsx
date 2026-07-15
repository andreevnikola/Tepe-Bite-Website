import AboutPageContent from "@/components/about/AboutPageContent";
import Footer from "@/components/Footer";
import { RECONNECT_INITIATIVE_ID } from "@/lib/config/initiatives";
import {
  getPublicInitiativeById,
  getYouthLedPartnersEnriched,
  type InitiativeDetail,
  type PartnerCarouselItem,
} from "@/lib/public/initiatives";
import type { Metadata } from "next";

// ISR: the youth partners + first initiative are derived once and refreshed
// every 5 minutes, matching the other data-driven public pages.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "За нас | ТЕПЕ bite — младежите зад барчето с кауза",
  description:
    "Историята на ТЕПЕ bite: ученически екип от Пловдив, който изгражда истински бранд с кауза. Пътят ни от Teenovator до първата инициатива, екипът, партньорите и подкрепата на Fantastico.",
  keywords: [
    "ТЕПЕ bite",
    "за нас",
    "Пловдив",
    "Teenovator",
    "Fantastico",
    "младежко предприемачество",
    "ТЕПЕ bite Impact",
  ],
  openGraph: {
    title: "За нас | ТЕПЕ bite",
    description:
      "Историята на един бранд от Пловдивчани, за Пловдив — младежите зад барчето с кауза.",
    type: "website",
    images: [{ url: "/photos/team.jpg" }],
  },
  alternates: {
    languages: {
      bg: "/about",
      en: "/about",
    },
  },
};

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
