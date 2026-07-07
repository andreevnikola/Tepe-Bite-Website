import 'server-only'
import mongoose from 'mongoose'
import type { z } from 'zod'
import { translateFields } from '@/lib/translate'
import type { InitiativeCreateSchema } from './validation'

export type InitiativeInput = z.infer<typeof InitiativeCreateSchema>

/** Latin slug from the (required, English) title. */
export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'initiative'
  )
}

/**
 * Fill every English field (auto-translate where no manual override), normalize
 * step order + current-step pointer, and cast partner refs. Batches all BG→EN
 * strings into a single DeepL request. Used by both create and update.
 */
export async function composeInitiativeFields(data: InitiativeInput) {
  const toTranslate: Record<string, string> = {}
  const need = (override: string | undefined, bg: string) => !override?.trim() && bg.trim().length > 0

  if (need(data.descriptionEn, data.descriptionBg)) toTranslate.desc = data.descriptionBg
  if (need(data.locationEn, data.locationBg ?? '')) toTranslate.loc = data.locationBg ?? ''
  data.steps.forEach((s, i) => {
    if (need(s.labelEn, s.labelBg)) toTranslate[`step_${i}_label`] = s.labelBg
    if (need(s.detailEn, s.detailBg ?? '')) toTranslate[`step_${i}_detail`] = s.detailBg ?? ''
  })
  data.partners.forEach((p, i) => {
    if (need(p.contributionEn, p.contributionBg ?? ''))
      toTranslate[`partner_${i}_contrib`] = p.contributionBg ?? ''
  })
  data.inflows.forEach((f, i) => {
    if (need(f.sourceLabelEn, f.sourceLabelBg ?? ''))
      toTranslate[`inflow_${i}_src`] = f.sourceLabelBg ?? ''
    if (need(f.noteEn, f.noteBg ?? '')) toTranslate[`inflow_${i}_note`] = f.noteBg ?? ''
  })

  const { result, ok } = await translateFields(toTranslate)
  const en = (key: string, override: string | undefined, fallback = '') =>
    override?.trim() || result[key] || fallback

  const steps = data.steps.map((s, i) => ({
    order: i,
    labelBg: s.labelBg,
    labelEn: en(`step_${i}_label`, s.labelEn, s.labelBg),
    detailBg: s.detailBg ?? '',
    detailEn: en(`step_${i}_detail`, s.detailEn),
    done: s.done,
  }))

  const partners = data.partners.map((p, i) => ({
    partnerId: new mongoose.Types.ObjectId(p.partnerId),
    partnershipType: p.partnershipType,
    contributionBg: p.contributionBg ?? '',
    contributionEn: en(`partner_${i}_contrib`, p.contributionEn),
  }))

  const inflows = data.inflows.map((f, i) => ({
    source: f.source,
    partnerId:
      f.source === 'partner' && f.partnerId ? new mongoose.Types.ObjectId(f.partnerId) : null,
    sourceLabelBg: f.sourceLabelBg ?? '',
    sourceLabelEn: en(`inflow_${i}_src`, f.sourceLabelEn),
    amountCents: f.amountCents,
    dateISO: f.dateISO,
    noteBg: f.noteBg ?? '',
    noteEn: en(`inflow_${i}_note`, f.noteEn),
  }))

  const currentStepIndex =
    steps.length === 0 ? 0 : Math.min(Math.max(0, data.currentStepIndex), steps.length - 1)

  const fields = {
    titleBg: data.titleBg,
    titleEn: data.titleEn,
    descriptionBg: data.descriptionBg,
    descriptionEn: en('desc', data.descriptionEn),
    status: data.status,
    isPublished: data.isPublished,
    category: data.category ?? null,
    locationBg: data.locationBg ?? '',
    locationEn: en('loc', data.locationEn),
    coverImage: data.coverImage ?? null,
    gallery: data.gallery.map((g) => ({
      url: g.url,
      key: g.key,
      captionBg: g.captionBg ?? '',
      captionEn: g.captionEn?.trim() ?? '',
    })),
    steps,
    currentStepIndex,
    expectedCostCents: data.expectedCostCents,
    spentCents: data.spentCents,
    partners,
    inflows,
    needsTranslationReview: !ok,
  }

  return { fields, needsReview: !ok }
}
