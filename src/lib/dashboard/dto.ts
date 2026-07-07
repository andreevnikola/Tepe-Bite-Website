/**
 * Plain, JSON-serializable shapes passed from server components/handlers to
 * client components. No mongoose types here so this file is client-safe.
 */
import type {
  InitiativeStatus,
  InitiativeCategory,
  PartnershipType,
  InflowSource,
} from './constants'

export type ImageDTO = { url: string; key: string }

export type PartnerDTO = {
  id: string
  nameBg: string
  nameEn: string
  descriptionBg: string
  descriptionEn: string
  image: ImageDTO | null
  links: { website: string; instagram: string; facebook: string; tiktok: string }
  needsTranslationReview: boolean
}

export type GalleryItemDTO = ImageDTO & { id: string; captionBg: string; captionEn: string }

export type StepDTO = {
  id: string
  order: number
  labelBg: string
  labelEn: string
  detailBg: string
  detailEn: string
  done: boolean
}

export type InitiativePartnerDTO = {
  id: string
  partnerId: string
  partnershipType: PartnershipType
  contributionBg: string
  contributionEn: string
}

export type InflowDTO = {
  id: string
  source: InflowSource
  partnerId: string | null
  sourceLabelBg: string
  sourceLabelEn: string
  amountCents: number
  dateISO: string
  noteBg: string
  noteEn: string
}

export type InitiativeDTO = {
  id: string
  titleBg: string
  titleEn: string
  slug: string
  descriptionBg: string
  descriptionEn: string
  status: InitiativeStatus
  isPublished: boolean
  category: InitiativeCategory | null
  locationBg: string
  locationEn: string
  coverImage: ImageDTO | null
  gallery: GalleryItemDTO[]
  steps: StepDTO[]
  currentStepIndex: number
  expectedCostCents: number
  spentCents: number
  partners: InitiativePartnerDTO[]
  inflows: InflowDTO[]
  needsTranslationReview: boolean
}
