import "server-only";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { LANG_COOKIE, normalizeLang, type Lang } from "@/store/lang";
import { SITE_URL } from "@/lib/config/site-info";
import { LANG_HEADER, resolveLang } from "./resolve";

/**
 * The language resolved for the current request. Reads the header injected by
 * the proxy first (authoritative for `?lang=` navigations), then falls back to
 * the cookie, then Bulgarian. Safe to call from the root layout and from any
 * `generateMetadata`.
 */
export async function getRequestLang(): Promise<Lang> {
  const headerLang = (await headers()).get(LANG_HEADER);
  if (headerLang) return normalizeLang(headerLang);
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  return resolveLang(null, cookieLang);
}

/** OpenGraph locale tag for a language. */
export function ogLocale(lang: Lang): string {
  return lang === "en" ? "en_US" : "bg_BG";
}

/**
 * hreflang alternates for a public path. Canonical is the clean URL; the
 * bg/en variants use explicit `?lang=` so crawlers (and Cloudflare AI Search)
 * get stable, language-selecting URLs. `path` must start with "/".
 */
export function languageAlternates(path: string): NonNullable<Metadata["alternates"]> {
  const clean = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    canonical: clean,
    languages: {
      bg: `${clean}?lang=bg`,
      en: `${clean}?lang=en`,
    },
  };
}

/** Short retrieval-classification taxonomy exposed via `<meta name>` tags. */
export type ContentType =
  | "page"
  | "initiative"
  | "partner"
  | "news"
  | "location"
  | "legal";

export function contentMeta(
  lang: Lang,
  type: ContentType,
  extra?: Record<string, string>,
): Record<string, string> {
  return {
    "content-language": lang,
    "content-type": type,
    "content-scope": "public",
    ...extra,
  };
}
