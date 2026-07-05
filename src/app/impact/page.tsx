import Footer from "@/components/Footer";
import ImpactPageContent from "@/components/impact/ImpactPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ТЕПЕ bite Impact | Фондът зад инициативите",
  description:
    "ТЕПЕ bite Impact е фондът, в който влизат фиксираните 0.15 € от всяко барче. Обединяваме средствата, избираме каузата, намираме партньори и съфинансиране и отчитаме прозрачно — за Пловдив.",
  keywords: [
    "ТЕПЕ bite",
    "ТЕПЕ bite Impact",
    "фонд",
    "Пловдив",
    "прозрачност",
    "дарения",
    "0.15 €",
  ],
  openGraph: {
    title: "ТЕПЕ bite Impact | Фондът зад инициативите",
    description:
      "Фиксирани 0.15 € от всяко барче влизат във фонд ТЕПЕ bite Impact — избираме кауза, намираме партньори и съфинансиране, реализираме и отчитаме прозрачно.",
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

export default function ImpactPage() {
  return (
    <>
      <main>
        <ImpactPageContent />
      </main>
      <Footer />
    </>
  );
}
