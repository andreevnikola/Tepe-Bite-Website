import { atom } from "jotai";

export type Lang = "bg" | "en";
export const DEFAULT_LANG: Lang = "bg";
export const LANG_COOKIE = "tepe-bite-lang";

export const isLang = (value: string | null | undefined): value is Lang =>
  value === "bg" || value === "en";

export const normalizeLang = (value: string | null | undefined): Lang =>
  isLang(value) ? value : DEFAULT_LANG;

export const langAtom = atom<Lang>(DEFAULT_LANG);

// Persist the chosen language for a year so the server can pick it up on the
// next request. Defined at module scope (not inside a component) so the write
// stays out of React's render path.
export function writeLangCookie(value: Lang) {
  if (typeof document === "undefined") return;
  document.cookie = `${LANG_COOKIE}=${encodeURIComponent(
    value,
  )}; path=/; max-age=31536000; samesite=lax`;
}
