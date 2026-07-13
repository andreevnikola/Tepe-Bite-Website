/**
 * Convert lean mongoose docs into JSON-serializable DTOs (ObjectId -> string).
 * Kept server-side; consumed by server components before handing data to the
 * client forms.
 */
import type { PartnerDTO, InitiativeDTO } from './dto'

function idStr(v: unknown): string {
  return v == null ? '' : String(v)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializePartner(p: any): PartnerDTO {
  return {
    id: idStr(p._id),
    nameBg: p.nameBg ?? '',
    nameEn: p.nameEn ?? '',
    slug: p.slug ?? '',
    descriptionBg: p.descriptionBg ?? '',
    descriptionEn: p.descriptionEn ?? '',
    isStarPartner: Boolean(p.isStarPartner),
    image: p.image ? { url: p.image.url, key: p.image.key } : null,
    links: {
      website: p.links?.website ?? '',
      instagram: p.links?.instagram ?? '',
      facebook: p.links?.facebook ?? '',
      tiktok: p.links?.tiktok ?? '',
    },
    needsTranslationReview: Boolean(p.needsTranslationReview),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeInitiative(i: any): InitiativeDTO {
  return {
    id: idStr(i._id),
    titleBg: i.titleBg ?? '',
    titleEn: i.titleEn ?? '',
    slug: i.slug ?? '',
    descriptionBg: i.descriptionBg ?? '',
    descriptionEn: i.descriptionEn ?? '',
    status: i.status,
    isPublished: Boolean(i.isPublished),
    isFeatured: Boolean(i.isFeatured),
    frozenReasonBg: i.frozenReasonBg ?? '',
    frozenReasonEn: i.frozenReasonEn ?? '',
    completionDateISO: i.completionDateISO ?? '',
    category: i.category ?? null,
    locationBg: i.locationBg ?? '',
    locationEn: i.locationEn ?? '',
    coverImage: i.coverImage ? { url: i.coverImage.url, key: i.coverImage.key } : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gallery: (i.gallery ?? []).map((g: any) => ({
      id: idStr(g._id),
      url: g.url,
      key: g.key,
      captionBg: g.captionBg ?? '',
      captionEn: g.captionEn ?? '',
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    steps: (i.steps ?? []).map((s: any) => ({
      id: idStr(s._id),
      order: s.order,
      labelBg: s.labelBg ?? '',
      labelEn: s.labelEn ?? '',
      detailBg: s.detailBg ?? '',
      detailEn: s.detailEn ?? '',
      done: Boolean(s.done),
      completedDateISO: s.completedDateISO ?? '',
      outcomeBg: s.outcomeBg ?? '',
      outcomeEn: s.outcomeEn ?? '',
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    partners: (i.partners ?? []).map((p: any) => ({
      id: idStr(p._id),
      partnerId: idStr(p.partnerId),
      partnershipType: p.partnershipType,
      contributionBg: p.contributionBg ?? '',
      contributionEn: p.contributionEn ?? '',
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inflows: (i.inflows ?? []).map((f: any) => ({
      id: idStr(f._id),
      source: f.source,
      partnerId: f.partnerId ? idStr(f.partnerId) : null,
      sourceLabelBg: f.sourceLabelBg ?? '',
      sourceLabelEn: f.sourceLabelEn ?? '',
      amountCents: f.amountCents ?? 0,
      dateISO: f.dateISO ?? '',
      phase: f.phase ?? 'planned',
      arrangedType: f.arrangedType ?? null,
      noteBg: f.noteBg ?? '',
      noteEn: f.noteEn ?? '',
    })),
    currentStepIndex: i.currentStepIndex ?? 0,
    expectedCostCents: i.expectedCostCents ?? 0,
    spentCents: i.spentCents ?? 0,
    needsTranslationReview: Boolean(i.needsTranslationReview),
  }
}
