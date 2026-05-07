import { atom } from "jotai";

export type Lang = "bg" | "en";
export const DEFAULT_LANG: Lang = "bg";
export const LANG_COOKIE = "tepe-bite-lang";

export const isLang = (value: string | null | undefined): value is Lang =>
  value === "bg" || value === "en";

export const normalizeLang = (value: string | null | undefined): Lang =>
  isLang(value) ? value : DEFAULT_LANG;

export const langAtom = atom<Lang>(DEFAULT_LANG);
