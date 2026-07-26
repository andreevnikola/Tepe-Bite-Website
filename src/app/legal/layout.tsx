import type { Metadata } from "next";
import {
  getRequestLang,
  languageAlternates,
  ogLocale,
  retrievalMeta,
  TITLE_TEMPLATE,
} from "@/lib/i18n/metadata";
import { LEGAL_PAGES } from "@/lib/legal/pages";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const en = lang === "en";
  const def = LEGAL_PAGES["index"];
  const title = en ? def.copy.titleEn : def.copy.titleBg;
  const description = en ? def.descriptionEn : def.descriptionBg;
  return {
    // Re-declares the root template: a bare string here would strip the brand
    // suffix from every nested legal page.
    title: { default: title, template: TITLE_TEMPLATE },
    description,
    alternates: languageAlternates(def.path),
    openGraph: { title, description, type: "website", locale: ogLocale(lang) },
    other: retrievalMeta({ lang, pageType: "legal", topic: def.topic }),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
