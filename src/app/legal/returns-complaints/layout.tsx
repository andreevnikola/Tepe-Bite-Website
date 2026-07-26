import type { Metadata } from "next";
import {
  getRequestLang,
  languageAlternates,
  ogLocale,
  retrievalMeta,
} from "@/lib/i18n/metadata";
import { LEGAL_PAGES } from "@/lib/legal/pages";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const en = lang === "en";
  const def = LEGAL_PAGES["returns-complaints"];
  const title = en ? def.copy.titleEn : def.copy.titleBg;
  const description = en ? def.descriptionEn : def.descriptionBg;
  return {
    title,
    description,
    alternates: languageAlternates(def.path),
    openGraph: { title, description, type: "website", locale: ogLocale(lang) },
    other: retrievalMeta({ lang, pageType: "legal", topic: def.topic }),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
