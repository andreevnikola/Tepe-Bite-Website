import LinksClient from "@/components/links/LinksClient";
import { getFeaturedInitiative } from "@/lib/public/initiatives";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import type { Metadata } from "next";

// ISR: cache the featured spotlight and refresh every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "ТЕПЕ bite — Всички връзки",
  description:
    "Открий ТЕПЕ bite на едно място — поръчай онлайн, следи инициативите ни за Пловдив и се свържи с нас.",
  openGraph: {
    title: "ТЕПЕ bite — Всички връзки",
    description: "Вкусно за теб. Смислено за общността.",
    type: "website",
  },
};

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
