import 'server-only'
import { getMongoose } from '@/lib/mongo'
import { Initiative } from '@/lib/mongo/models/Initiative'
import { Partner } from '@/lib/mongo/models/Partner'
import { serializeInitiative, serializePartner } from '@/lib/dashboard/serialize'
import type { InitiativeDTO, PartnerDTO, InflowDTO } from '@/lib/dashboard/dto'
import type { InitiativeStatus } from '@/lib/dashboard/constants'

/**
 * Public read layer for the data-driven Initiatives pages.
 *
 * Design note: we deliberately do NOT keep a denormalized summary document
 * (drift risk). The overview fetches all published initiatives once + all
 * partners once, then derives every stat/section in memory. Pages using these
 * helpers should set `export const revalidate = 300` (ISR) so the work is
 * cached, not recomputed per request.
 */

export type OverviewStats = {
  /** Realized (available-phase) money from the ТЕПЕ bite Impact fund, in cents. */
  investedImpactCents: number
  /** Realized (available-phase) money from partners + external donors, in cents. */
  investedExternalCents: number
  /** investedImpact + investedExternal. */
  investedTotalCents: number
  /** Sum of all planned-phase inflows across published initiatives, in cents. */
  plannedTotalCents: number
  /** Sum of all arranged-phase inflows across published initiatives, in cents. */
  arrangedTotalCents: number
  /** Number of published initiatives with status 'done'. */
  realisedCount: number
  /** Distinct partners involved across published initiatives. */
  partnerCount: number
}

/** A partner's money across a set of initiatives, split by inflow phase. */
export type PartnerFinancial = {
  available: number
  arranged: number
  planned: number
  total: number
  recordCount: number
}

/** Enriched partner for the overview carousel + reuse elsewhere. */
export type PartnerCarouselItem = {
  partner: PartnerDTO
  /** Number of published initiatives this partner is formally linked to. */
  initiativeCount: number
  /** Their combined partner-inflows across published initiatives, by phase. */
  financial: PartnerFinancial
}

export type OverviewData = {
  stats: OverviewStats
  featured: InitiativeDTO | null
  /** Partners for the carousel: involved-in-published ∪ star partners, stars first. */
  partners: PartnerCarouselItem[]
  byStatus: Record<InitiativeStatus, InitiativeDTO[]>
  /** Up to 3 most recently completed initiatives (by completionDateISO), for the hero carousel. */
  recentlyCompleted: InitiativeDTO[]
  /** True when at least one initiative is published. */
  hasAnyInitiative: boolean
  /** True when at least one partner exists in the carousel. */
  hasAnyPartner: boolean
}

/** Sum a single partner's partner-inflows across the given initiatives, by phase. */
function partnerFinancialAcross(
  initiatives: InitiativeDTO[],
  partnerId: string,
): PartnerFinancial {
  const t: PartnerFinancial = { available: 0, arranged: 0, planned: 0, total: 0, recordCount: 0 }
  for (const i of initiatives) {
    for (const f of i.inflows) {
      if (f.source === 'partner' && f.partnerId === partnerId) {
        t[f.phase] += f.amountCents
        t.total += f.amountCents
        t.recordCount += 1
      }
    }
  }
  return t
}

/** How many of the given initiatives formally list this partner. */
function partnerInitiativeCount(initiatives: InitiativeDTO[], partnerId: string): number {
  return initiatives.filter((i) => i.partners.some((p) => p.partnerId === partnerId)).length
}

function sumInflows(initiatives: InitiativeDTO[], pred: (f: InflowDTO) => boolean): number {
  let total = 0
  for (const i of initiatives) {
    for (const f of i.inflows) if (pred(f)) total += f.amountCents
  }
  return total
}

export async function getPublicOverviewData(): Promise<OverviewData> {
  await getMongoose()

  const [rawInitiatives, rawPartners] = await Promise.all([
    Initiative.find({ isPublished: true }).sort({ updatedAt: -1 }).lean(),
    Partner.find({}).lean(),
  ])

  const initiatives = rawInitiatives.map(serializeInitiative)
  const allPartners = rawPartners.map(serializePartner)

  // ── Stats ────────────────────────────────────────────────────────────────
  const investedImpactCents = sumInflows(
    initiatives,
    (f) => f.phase === 'available' && f.source === 'impact_fund',
  )
  const investedExternalCents = sumInflows(
    initiatives,
    (f) => f.phase === 'available' && (f.source === 'partner' || f.source === 'external_other'),
  )
  const plannedTotalCents = sumInflows(initiatives, (f) => f.phase === 'planned')
  const arrangedTotalCents = sumInflows(initiatives, (f) => f.phase === 'arranged')

  const involvedPartnerIds = new Set<string>()
  for (const i of initiatives) {
    for (const p of i.partners) if (p.partnerId) involvedPartnerIds.add(p.partnerId)
  }

  const stats: OverviewStats = {
    investedImpactCents,
    investedExternalCents,
    investedTotalCents: investedImpactCents + investedExternalCents,
    plannedTotalCents,
    arrangedTotalCents,
    realisedCount: initiatives.filter((i) => i.status === 'done').length,
    partnerCount: involvedPartnerIds.size,
  }

  // ── Featured (single spotlight) ──────────────────────────────────────────
  const featured = initiatives.find((i) => i.isFeatured) ?? null

  // ── Partners carousel: involved ∪ star; star first, then by initiative count ─
  const partners: PartnerCarouselItem[] = allPartners
    .filter((p) => p.isStarPartner || involvedPartnerIds.has(p.id))
    .map((partner) => ({
      partner,
      initiativeCount: partnerInitiativeCount(initiatives, partner.id),
      financial: partnerFinancialAcross(initiatives, partner.id),
    }))
    .sort((a, b) => {
      if (a.partner.isStarPartner !== b.partner.isStarPartner)
        return a.partner.isStarPartner ? -1 : 1
      if (a.initiativeCount !== b.initiativeCount) return b.initiativeCount - a.initiativeCount
      return a.partner.nameBg.localeCompare(b.partner.nameBg, 'bg')
    })

  // ── Sections by status ───────────────────────────────────────────────────
  const byStatus: Record<InitiativeStatus, InitiativeDTO[]> = {
    planned: [],
    in_progress: [],
    frozen: [],
    done: [],
  }
  for (const i of initiatives) byStatus[i.status].push(i)

  // ── Most recently completed (for the hero carousel) ─────────────────────
  const recentlyCompleted = byStatus.done
    .filter((i) => i.completionDateISO)
    .sort((a, b) => b.completionDateISO.localeCompare(a.completionDateISO))
    .slice(0, 3)

  return {
    stats,
    featured,
    partners,
    byStatus,
    recentlyCompleted,
    hasAnyInitiative: initiatives.length > 0,
    hasAnyPartner: partners.length > 0,
  }
}

/**
 * Just the single spotlighted initiative — a light read for surfaces that only
 * need the featured card (e.g. the /links hub), without computing the full
 * overview (stats + partner carousel). Pages should set ISR revalidate.
 */
export async function getFeaturedInitiative(): Promise<InitiativeDTO | null> {
  await getMongoose()
  const raw = await Initiative.findOne({ isPublished: true, isFeatured: true })
    .sort({ updatedAt: -1 })
    .lean()
  return raw ? serializeInitiative(raw) : null
}

export type InitiativeDetail = {
  initiative: InitiativeDTO
  /** Referenced partners (from partners[] and inflows[]) keyed by id. */
  partnersById: Record<string, PartnerDTO>
}

export async function getPublicInitiativeBySlug(slug: string): Promise<InitiativeDetail | null> {
  await getMongoose()
  const raw = await Initiative.findOne({ slug, isPublished: true }).lean()
  if (!raw) return null

  const initiative = serializeInitiative(raw)

  const ids = new Set<string>()
  for (const p of initiative.partners) if (p.partnerId) ids.add(p.partnerId)
  for (const f of initiative.inflows) if (f.partnerId) ids.add(f.partnerId)

  const partnersById: Record<string, PartnerDTO> = {}
  if (ids.size > 0) {
    const rawPartners = await Partner.find({ _id: { $in: [...ids] } }).lean()
    for (const rp of rawPartners) {
      const dto = serializePartner(rp)
      partnersById[dto.id] = dto
    }
  }

  return { initiative, partnersById }
}

export type PartnerInitiativeLink = {
  initiative: InitiativeDTO
  partnershipType: InitiativeDTO['partners'][number]['partnershipType']
  contributionBg: string
  contributionEn: string
  /** This partner's money on THIS initiative, by phase. */
  financial: PartnerFinancial
}

export type PartnerDetail = {
  partner: PartnerDTO
  initiatives: PartnerInitiativeLink[]
  /** Sum of this partner's realized (available-phase) donations, in cents. */
  totalDonatedCents: number
  /** This partner's money across ALL published initiatives, by phase. */
  financial: PartnerFinancial
}

export async function getPublicPartnerBySlug(slug: string): Promise<PartnerDetail | null> {
  await getMongoose()
  const rawPartner = await Partner.findOne({ slug }).lean()
  if (!rawPartner) return null
  const partner = serializePartner(rawPartner)

  const rawInitiatives = await Initiative.find({
    isPublished: true,
    $or: [{ 'partners.partnerId': partner.id }, { 'inflows.partnerId': partner.id }],
  })
    .sort({ updatedAt: -1 })
    .lean()

  const allDtos = rawInitiatives.map(serializeInitiative)
  const initiatives: PartnerInitiativeLink[] = []

  for (const dto of allDtos) {
    // Their commitment (only when formally listed as a partner on the initiative).
    const link = dto.partners.find((p) => p.partnerId === partner.id)
    if (link) {
      initiatives.push({
        initiative: dto,
        partnershipType: link.partnershipType,
        contributionBg: link.contributionBg,
        contributionEn: link.contributionEn,
        financial: partnerFinancialAcross([dto], partner.id),
      })
    }
  }

  const financial = partnerFinancialAcross(allDtos, partner.id)

  return { partner, initiatives, totalDonatedCents: financial.available, financial }
}
