import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'

/** UploadThing asset reference — store both so we can render and later delete. */
export const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, required: true },
  },
  { _id: false },
)

const PartnerLinksSchema = new Schema(
  {
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
  },
  { _id: false },
)

const PartnerSchema = new Schema(
  {
    // Admin types BG; EN is auto-translated on save but stays editable
    // (org names shouldn't be translated literally).
    nameBg: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    descriptionBg: { type: String, default: '' },
    descriptionEn: { type: String, default: '' },
    image: { type: ImageSchema, default: null },
    links: { type: PartnerLinksSchema, default: () => ({}) },
    needsTranslationReview: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'partners' },
)

export type PartnerDoc = InferSchemaType<typeof PartnerSchema> & { _id: mongoose.Types.ObjectId }

export const Partner: Model<PartnerDoc> =
  (mongoose.models.Partner as Model<PartnerDoc>) ||
  mongoose.model<PartnerDoc>('Partner', PartnerSchema)
