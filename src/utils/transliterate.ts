const BG_ABBREV: [RegExp, string][] = [
  [/\bбул\./gi, "bul."],
  [/\bул\./gi, "ul."],
  [/\bкв\./gi, "kv."],
  [/\bпл\./gi, "pl."],
  [/\bбл\./gi, "bl."],
  [/\bвх\./gi, "vkh."],
  [/\bет\./gi, "et."],
  [/\bж\.к\./gi, "zh.k."],
  [/\bс\./gi, "s."],
  [/\bгр\./gi, "gr."],
];

const CHAR_MAP: Record<string, string> = {
  А: "A", а: "a",
  Б: "B", б: "b",
  В: "V", в: "v",
  Г: "G", г: "g",
  Д: "D", д: "d",
  Е: "E", е: "e",
  Ж: "Zh", ж: "zh",
  З: "Z", з: "z",
  И: "I", и: "i",
  Й: "Y", й: "y",
  К: "K", к: "k",
  Л: "L", л: "l",
  М: "M", м: "m",
  Н: "N", н: "n",
  О: "O", о: "o",
  П: "P", п: "p",
  Р: "R", р: "r",
  С: "S", с: "s",
  Т: "T", т: "t",
  У: "U", у: "u",
  Ф: "F", ф: "f",
  Х: "H", х: "h",
  Ц: "Ts", ц: "ts",
  Ч: "Ch", ч: "ch",
  Ш: "Sh", ш: "sh",
  Щ: "Sht", щ: "sht",
  Ъ: "A", ъ: "a",
  Ь: "", ь: "",
  Ю: "Yu", ю: "yu",
  Я: "Ya", я: "ya",
};

export function transliterateAddress(text: string): string {
  let result = text;
  for (const [pattern, replacement] of BG_ABBREV) {
    result = result.replace(pattern, replacement);
  }
  return result
    .split("")
    .map((ch) => CHAR_MAP[ch] ?? ch)
    .join("");
}
