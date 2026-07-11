import LinksClient from "@/components/links/LinksClient";
import type { Metadata } from "next";

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

export default function LinksPage() {
  return <LinksClient />;
}
