import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { ADMIN_ROLES } from '../../dashboard/constants'
import { defineModel } from '../define-model'

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ADMIN_ROLES, default: 'admin' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'admins' },
)

export type AdminDoc = InferSchemaType<typeof AdminSchema> & { _id: mongoose.Types.ObjectId }

export const Admin: Model<AdminDoc> = defineModel<AdminDoc>('Admin', AdminSchema)
