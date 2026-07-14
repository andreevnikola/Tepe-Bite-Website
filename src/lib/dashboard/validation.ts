import { z } from 'zod'
import {
  INITIATIVE_STATUSES,
  INITIATIVE_CATEGORIES,
  PARTNERSHIP_TYPES,
  INFLOW_SOURCES,
  INFLOW_PHASES,
  ARRANGED_TYPES,
} from './constants'

/** A URL or an empty string (fields are optional links). */
const urlOrEmpty = z.union([z.string().url(), z.literal('')]).default('')

export const ImageInputSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
})

export const PartnerLinksSchema = z
  .object({
    website: urlOrEmpty,
    instagram: urlOrEmpty,
    facebook: urlOrEmpty,
    tiktok: urlOrEmpty,
  })
  .partial()

export const PartnerCreateSchema = z.object({
  nameBg: z.string().min(1).max(200),
  nameEn: z.string().max(200).optional(), // manual EN override (org names)
  descriptionBg: z.string().max(5000).default(''),
  descriptionEn: z.string().max(5000).optional(),
  isStarPartner: z.boolean().default(false),
  isYouthLed: z.boolean().default(false),
  image: ImageInputSchema.nullable().optional(),
  links: PartnerLinksSchema.optional(),
})

export const PartnerUpdateSchema = PartnerCreateSchema.partial()

// ─── Initiatives ────────────────────────────────────────────────────────────

export const StepInputSchema = z.object({
  labelBg: z.string().min(1).max(300),
  labelEn: z.string().max(300).optional(),
  detailBg: z.string().max(2000).default(''),
  detailEn: z.string().max(2000).optional(),
  done: z.boolean().default(false),
  completedDateISO: z.string().default(''),
  outcomeBg: z.string().max(2000).default(''),
  outcomeEn: z.string().max(2000).optional(),
})

export const InitiativePartnerInputSchema = z.object({
  partnerId: z.string().min(1),
  partnershipTypes: z.array(z.enum(PARTNERSHIP_TYPES)).min(1),
  contributionBg: z.string().max(2000).default(''),
  contributionEn: z.string().max(2000).optional(),
})

export const InflowInputSchema = z.object({
  source: z.enum(INFLOW_SOURCES),
  partnerId: z.string().nullable().optional(),
  sourceLabelBg: z.string().max(300).default(''),
  sourceLabelEn: z.string().max(300).optional(),
  amountCents: z.number().int().min(0),
  dateISO: z.string().min(1),
  phase: z.enum(INFLOW_PHASES).default('planned'),
  arrangedType: z.enum(ARRANGED_TYPES).nullable().optional(),
  noteBg: z.string().max(1000).default(''),
  noteEn: z.string().max(1000).optional(),
})

export const ExpenseInputSchema = z.object({
  amountCents: z.number().int().min(0),
  descriptionBg: z.string().min(1).max(1000),
  descriptionEn: z.string().max(1000).optional(),
  dateISO: z.string().min(1),
  // Image proof is mandatory for every expense.
  proof: ImageInputSchema,
})

export const GalleryItemInputSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
  captionBg: z.string().max(500).default(''),
  captionEn: z.string().max(500).optional(),
})

const InitiativeCreateBase = z.object({
  titleBg: z.string().min(1).max(300),
  titleEn: z.string().min(1).max(300), // required manual EN
  descriptionBg: z.string().min(1).max(20000),
  descriptionEn: z.string().max(20000).optional(),
  status: z.enum(INITIATIVE_STATUSES).default('planned'),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  frozenReasonBg: z.string().max(2000).default(''),
  frozenReasonEn: z.string().max(2000).optional(),
  completionDateISO: z.string().default(''),
  category: z.enum(INITIATIVE_CATEGORIES).nullable().optional(),
  locationBg: z.string().max(300).default(''),
  locationEn: z.string().max(300).optional(),
  coverImage: ImageInputSchema.nullable().optional(),
  gallery: z.array(GalleryItemInputSchema).max(50).default([]),
  steps: z.array(StepInputSchema).max(50).default([]),
  currentStepIndex: z.number().int().min(0).default(0),
  expectedCostCents: z.number().int().min(0).default(0),
  partners: z.array(InitiativePartnerInputSchema).max(50).default([]),
  inflows: z.array(InflowInputSchema).max(200).default([]),
  expenses: z.array(ExpenseInputSchema).max(200).default([]),
})

// A completed step must carry a completion date (enforced on both create + update).
export const InitiativeCreateSchema = InitiativeCreateBase.superRefine((data, ctx) => {
  data.steps.forEach((s, i) => {
    if (s.done && !s.completedDateISO.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['steps', i, 'completedDateISO'],
        message: 'Дата на завършване е задължителна за завършена стъпка.',
      })
    }
    if (s.done && !s.outcomeBg.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['steps', i, 'outcomeBg'],
        message: 'Описание на завършеното е задължително за завършена стъпка.',
      })
    }
  })
  if (data.status === 'done' && !data.completionDateISO.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['completionDateISO'],
      message: 'Дата на завършване е задължителна за завършена инициатива.',
    })
  }
})

export const InitiativeUpdateSchema = InitiativeCreateBase.partial()
