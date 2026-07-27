import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'
import { defineModel } from '../define-model'

/**
 * One row per escalation the assistant sent to a ТЕПЕ bite mailbox.
 *
 * The unique `submissionId` is what makes the flow idempotent: the browser
 * generates it once per draft and reuses it on every retry, so a request that
 * timed out *after* Resend accepted the message cannot deliver a second copy.
 * We insert BEFORE sending — a duplicate key on the retry proves the first
 * attempt already got past this point.
 *
 * `expiresAt` keeps the collection from growing forever; 30 days is longer than
 * any plausible retry and long enough to investigate a complaint.
 */
const ChatContactSubmissionSchema = new Schema(
  {
    submissionId: { type: String, required: true, unique: true, trim: true },
    category: { type: String, enum: ['office', 'impact'], required: true },
    recipient: { type: String, required: true, trim: true },
    lang: { type: String, enum: ['bg', 'en'], required: true },
    /** Sender identity, as typed by the visitor and validated server-side. */
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    messageId: { type: String, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, collection: 'chat_contact_submissions' },
)

// TTL index — MongoDB removes the document once `expiresAt` passes.
ChatContactSubmissionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type ChatContactSubmissionDoc = InferSchemaType<
  typeof ChatContactSubmissionSchema
> & { _id: mongoose.Types.ObjectId }

export const ChatContactSubmission: Model<ChatContactSubmissionDoc> =
  defineModel<ChatContactSubmissionDoc>(
    'ChatContactSubmission',
    ChatContactSubmissionSchema,
  )
