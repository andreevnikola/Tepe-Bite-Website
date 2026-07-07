import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { defineModel } from '../define-model'

/** Transparency-minded audit trail: one row per admin mutation. */
const AdminAuditLogSchema = new Schema(
  {
    actorAdminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
    actorDisplayName: { type: String, required: true },
    action: { type: String, required: true }, // e.g. 'initiative.create'
    entityType: { type: String, required: true }, // 'initiative' | 'partner'
    entityId: { type: String, required: true },
    before: { type: Schema.Types.Mixed, default: null },
    after: { type: Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'admin_audit_logs' },
)

export type AdminAuditLogDoc = InferSchemaType<typeof AdminAuditLogSchema> & {
  _id: mongoose.Types.ObjectId
}

export const AdminAuditLog: Model<AdminAuditLogDoc> = defineModel<AdminAuditLogDoc>(
  'AdminAuditLog',
  AdminAuditLogSchema,
)
