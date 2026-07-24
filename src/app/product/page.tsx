import Footer from "@/components/Footer";
import ProductPageContent from "@/components/ProductPageContent";
import { getAllLocations } from "@/sanity/queries";
import type { Location } from "@/sanity/types";
import {
  contentMeta,
  getRequestLang,
  languageAlternates,
  ogLocale,
} from "@/lib/i18n/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const en = lang === "en";
  const title = en
    ? "ТЕПЕ bite — Salted caramel | A wholesome bar with a cause"
    : "ТЕПЕ bite — Солен карамел | Здравословно барче с кауза";
  const description = en
    ? "ТЕПЕ bite is a low-carb salted-caramel bar created in Plovdiv — with fibre, plant protein and a mission behind every purchase."
    : "ТЕПЕ bite е нисковъглехидратно барче със солен карамел, създадено в Пловдив — с фибри, растителен протеин и мисия зад всяка покупка.";
  return {
    title,
    description,
    keywords: [
      "ТЕПЕ bite",
      en ? "salted caramel" : "солен карамел",
      en ? "keto bar" : "кето барче",
      en ? "low carb" : "нисковъглехидратно",
      "Пловдив",
      "BioStyle",
      en ? "protein snack" : "протеинова закуска",
    ],
    alternates: languageAlternates("/product"),
    openGraph: {
      title,
      description,
      type: "website",
      locale: ogLocale(lang),
    },
    other: contentMeta(lang, "page", { topic: "product" }),
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "ТЕПЕ bite — Солен карамел",
  brand: {
    "@type": "Brand",
    name: "ТЕПЕ bite",
  },
  manufacturer: {
    "@type": "Organization",
    name: "BioStyle Ltd.",
  },
  description:
    "Нисковъглехидратно барче със солен карамел, създадено в Пловдив — с фибри, растителен протеин, ядки и семена.",
  weight: {
    "@type": "QuantitativeValue",
    value: 40,
    unitCode: "GRM",
  },
};

export default async function ProductPage() {
  let locations: Location[] = [];
  try {
    locations = await getAllLocations();
  } catch {
    // Sanity not configured or unavailable
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <ProductPageContent locations={locations} />
      </main>
      <Footer />
    </>
  );
}
