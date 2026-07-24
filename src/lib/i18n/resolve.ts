import { DEFAULT_LANG, isLang, type Lang } from "@/store/lang";

/**
 * Request header the proxy injects with the resolved language so server
 * components (root layout, generateMetadata) can read it for THIS request —
 * a response cookie only applies to the next request, so we cannot rely on it
 * for the initial SSR of a `?lang=` navigation.
 */
export const LANG_HEADER = "x-tepe-lang";

/**
 * Resolve the request language with the intended precedence:
 *   1. a valid explicit `?lang=` query value,
 *   2. the existing language cookie,
 *   3. Bulgarian (DEFAULT_LANG).
 * Invalid values at any level are ignored (never throw) and fall through.
 */
export function resolveLang(
  queryValue: string | null | undefined,
  cookieValue: string | null | undefined,
): Lang {
  if (isLang(queryValue)) return queryValue;
  if (isLang(cookieValue)) return cookieValue;
  return DEFAULT_LANG;
}
