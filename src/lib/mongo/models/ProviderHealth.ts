import { Schema, type InferSchemaType, type Model } from 'mongoose'
import { defineModel } from '../define-model'

/**
 * Circuit-breaker state for the assistant's outbound providers — one tiny
 * document per provider.
 *
 * WHY Mongo instead of process memory: the site runs on serverless instances,
 * so an in-memory breaker is re-learned by every cold start and every parallel
 * instance. A provider that is definitively down (revoked key, daily quota
 * spent) would keep being called once per instance, per burst, and every one of
 * those calls makes a visitor wait for a failure we already knew about. Mongo is
 * already open for the dashboard, so the breaker rides on a connection the
 * process holds anyway.
 *
 * WHY the provider name is `_id`: `_id` is unique and indexed by definition, so
 * "exactly one document per provider" is enforced without a second index on a
 * collection that is written on every provider failure. It also makes the
 * breaker's upserts converge — two instances failing in the same instant update
 * one document instead of racing to insert two.
 *
 * Nothing here is a secret: no keys, no account ids, no provider response text.
 * The document holds counters and timestamps only, and none of it is ever
 * returned to the browser (the public surface is the coarse `ChatAvailability`).
 */

export const CHAT_PROVIDERS = ['groq', 'cloudflare', 'resend'] as const
export type ChatProvider = (typeof CHAT_PROVIDERS)[number]

/**
 * Exactly the `kind` union carried by `ProviderError` (Groq) and
 * `CloudflareSearchError` (Cloudflare). Kept structurally identical on purpose:
 * a caller passes `error.kind` straight into the breaker, with no adapter and
 * no chance of a typo silently becoming an unknown-and-ignored failure.
 */
export const PROVIDER_FAILURE_KINDS = [
  'auth',
  'quota_daily',
  'rate_limit',
  'request_too_large',
  'timeout',
  'server',
  'network',
  'bad_response',
] as const
export type ProviderFailureKind = (typeof PROVIDER_FAILURE_KINDS)[number]

/** A provider untouched for this long is retired or has been healthy all along. */
const PROVIDER_HEALTH_TTL_SECONDS = 30 * 24 * 60 * 60

const ProviderHealthSchema = new Schema(
  {
    /** The provider name IS the primary key — see the note above. */
    _id: { type: String, enum: CHAT_PROVIDERS, required: true },
    /** Consecutive failures since the last success; drives the open threshold. */
    consecutiveFailures: { type: Number, default: 0, min: 0 },
    /** Last classified failure. `quota_daily` is what makes the scope "daily". */
    lastFailureKind: {
      type: String,
      enum: [...PROVIDER_FAILURE_KINDS, null],
      default: null,
    },
    /**
     * The breaker is OPEN while this is in the future and HALF-OPEN once it has
     * passed — it is cleared only by a recorded success, so "the cooldown ended"
     * never silently means "the provider is healthy again".
     */
    openUntil: { type: Date, default: null },
    lastFailureAt: { type: Date, default: null },
    lastSuccessAt: { type: Date, default: null },
    /**
     * Single-flight lease for the half-open recovery probe. Stored as a deadline
     * rather than a boolean so a crashed prober cannot hold the slot forever.
     */
    probeInFlightUntil: { type: Date, default: null },
  },
  {
    // `updatedAt` only: there is nothing to learn from when a breaker row was
    // first created, and every write already refreshes `updatedAt`.
    timestamps: { createdAt: false, updatedAt: true },
    collection: 'provider_health',
    versionKey: false,
  },
)

// TTL — keeps the collection bounded without a maintenance job. Expiry is safe
// because a MISSING document means "closed", which is the healthy default, and
// a breaker that is actually open is rewritten (refreshing `updatedAt`) within
// at most 24h — far inside the 30-day window.
ProviderHealthSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: PROVIDER_HEALTH_TTL_SECONDS },
)

export type ProviderHealthDoc = InferSchemaType<typeof ProviderHealthSchema> & {
  _id: ChatProvider
  updatedAt?: Date
}

export const ProviderHealth: Model<ProviderHealthDoc> =
  defineModel<ProviderHealthDoc>('ProviderHealth', ProviderHealthSchema)
