import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import {
  INITIATIVE_STATUSES,
  INITIATIVE_CATEGORIES,
  PARTNERSHIP_TYPES,
  INFLOW_SOURCES,
  INFLOW_PHASES,
  ARRANGED_TYPES,
} from '../../dashboard/constants'
import { ImageSchema } from './Partner'
import { defineModel } from '../define-model'

const GalleryItemSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
    captionBg: { type: String, default: '' },
    captionEn: { type: String, default: '' },
  },
  { _id: true },
)

const StepSchema = new Schema(
  {
    order: { type: Number, required: true },
    labelBg: { type: String, required: true },
    labelEn: { type: String, default: '' },
    detailBg: { type: String, default: '' },
    detailEn: { type: String, default: '' },
    done: { type: Boolean, default: false },
    // Manually set when a step is marked done (required in that case). Shown publicly.
    completedDateISO: { type: String, default: '' },
    // What was actually accomplished in this step. Required when done. EN auto-translated. Shown publicly.
    outcomeBg: { type: String, default: '' },
    outcomeEn: { type: String, default: '' },
  },
  { _id: true },
)

/** A reusable Partner attached to this initiative with partnership context. */
const InitiativePartnerSchema = new Schema(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
    partnershipType: { type: String, enum: PARTNERSHIP_TYPES, required: true },
    contributionBg: { type: String, default: '' },
    contributionEn: { type: String, default: '' },
  },
  { _id: true },
)

/** A financial inflow into this initiative. */
const InflowSchema = new Schema(
  {
    source: { type: String, enum: INFLOW_SOURCES, required: true },
    // Set only when source === 'partner' (a partner already linked to the initiative).
    partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', default: null },
    // Free-text label used when source === 'external_other'.
    sourceLabelBg: { type: String, default: '' },
    sourceLabelEn: { type: String, default: '' },
    amountCents: { type: Number, required: true, min: 0 },
    dateISO: { type: String, required: true },
    // Lifecycle phase: planned → arranged → available.
    phase: { type: String, enum: INFLOW_PHASES, default: 'planned' },
    // Only meaningful when phase === 'arranged'.
    arrangedType: { type: String, enum: ARRANGED_TYPES, default: null },
    noteBg: { type: String, default: '' },
    noteEn: { type: String, default: '' },
  },
  { _id: true },
)

const InitiativeSchema = new Schema(
  {
    titleBg: { type: String, required: true, trim: true },
    titleEn: { type: String, required: true, trim: true }, // manual
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    descriptionBg: { type: String, required: true },
    descriptionEn: { type: String, default: '' },
    status: { type: String, enum: INITIATIVE_STATUSES, default: 'planned' },
    isPublished: { type: Boolean, default: false },
    // Single-selected site-wide spotlight ("На фокус"). Enforced unique in the API layer.
    isFeatured: { type: Boolean, default: false },
    // Shown publicly when status === 'frozen'. EN is auto-translated like other BG fields.
    frozenReasonBg: { type: String, default: '' },
    frozenReasonEn: { type: String, default: '' },
    // Manually set when status === 'done' (required in that case). Shown publicly.
    completionDateISO: { type: String, default: '' },
    category: { type: String, enum: INITIATIVE_CATEGORIES, default: null },
    locationBg: { type: String, default: '' },
    locationEn: { type: String, default: '' },
    coverImage: { type: ImageSchema, default: null },
    gallery: { type: [GalleryItemSchema], default: [] },
    steps: { type: [StepSchema], default: [] },
    currentStepIndex: { type: Number, default: 0 },
    expectedCostCents: { type: Number, default: 0, min: 0 },
    spentCents: { type: Number, default: 0, min: 0 },
    partners: { type: [InitiativePartnerSchema], default: [] },
    inflows: { type: [InflowSchema], default: [] },
    needsTranslationReview: { type: Boolean, default: false },
    createdByAdminId: { type: Schema.Types.ObjectId, ref: 'Admin', default: null },
    updatedByAdminId: { type: Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  { timestamps: true, collection: 'initiatives' },
)

export type InitiativeDoc = InferSchemaType<typeof InitiativeSchema> & {
  _id: mongoose.Types.ObjectId
}

export const Initiative: Model<InitiativeDoc> = defineModel<InitiativeDoc>(
  'Initiative',
  InitiativeSchema,
)
