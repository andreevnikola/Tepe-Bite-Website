/**
 * BG → EN auto-translation via DeepL (free tier). Admins enter Bulgarian; the
 * backend fills the English fields on save. On any error/quota issue we fall
 * back to the Bulgarian text and signal `ok:false` so callers can flag the
 * record for manual translation review — nothing ever hard-fails on translation.
 */
import * as deepl from 'deepl-node'

let translator: deepl.Translator | null | undefined

function getTranslator(): deepl.Translator | null {
  if (translator !== undefined) return translator
  const key = process.env.DEEPL_API_KEY
  translator = key ? new deepl.Translator(key) : null
  return translator
}

/**
 * Translate a map of Bulgarian field values to English in a single batched
 * request. Empty inputs stay empty. Returns the same keys with EN values plus
 * `ok` (false when translation failed and BG was used as fallback).
 */
export async function translateFields<T extends Record<string, string>>(
  fields: T,
): Promise<{ result: Record<keyof T, string>; ok: boolean }> {
  const keys = Object.keys(fields) as (keyof T)[]
  const result = {} as Record<keyof T, string>
  for (const k of keys) result[k] = ''

  const nonEmpty = keys.filter((k) => (fields[k] ?? '').trim().length > 0)
  if (nonEmpty.length === 0) return { result, ok: true }

  const tr = getTranslator()
  if (!tr) {
    for (const k of nonEmpty) result[k] = fields[k]
    return { result, ok: false }
  }

  try {
    const translated = await tr.translateText(
      nonEmpty.map((k) => fields[k]),
      'bg',
      'en-US',
    )
    nonEmpty.forEach((k, i) => {
      result[k] = translated[i].text
    })
    return { result, ok: true }
  } catch {
    for (const k of nonEmpty) result[k] = fields[k]
    return { result, ok: false }
  }
}

/** Convenience wrapper for a single string. */
export async function translateBgToEn(text: string): Promise<{ text: string; ok: boolean }> {
  const { result, ok } = await translateFields({ text })
  return { text: result.text, ok }
}
