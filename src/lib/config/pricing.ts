/**
 * Pricing configuration.
 *
 * Product prices are NOT stored here — they live in the ProductPlan DB table.
 *
 * Delivery pricing is loaded from environment variables at runtime:
 *   TEPE_DELIVERY_BASE_LOCKER_CENTS        — base Speedy locker delivery price (EUR cents)
 *   TEPE_DELIVERY_OFFICE_SURCHARGE_CENTS   — extra charge for Speedy office vs locker (EUR cents)
 *   TEPE_DELIVERY_ADDRESS_SURCHARGE_CENTS  — extra charge for home address delivery (EUR cents)
 *   TEPE_FREE_DELIVERY_THRESHOLD_CENTS     — subtotal at which base locker delivery is free (EUR cents)
 *
 * Business rules:
 *   Speedy locker total  = BASE_LOCKER_CENTS
 *   Speedy office total  = BASE_LOCKER_CENTS + OFFICE_SURCHARGE_CENTS
 *   Address total        = BASE_LOCKER_CENTS + ADDRESS_SURCHARGE_CENTS
 *   Free delivery waives BASE_LOCKER_CENTS only; surcharges always apply.
 */

export const CURRENCY = 'EUR' as const
export const EUR_TO_BGN = 1.95583

// ─── Server-side validated config ────────────────────────────────────────────

export type DeliveryPricingConfig = {
  baseLockerCents: number
  officeSurchargeCents: number
  addressSurchargeCents: number
  freeDeliveryThresholdCents: number
}

export type PricingConfig = {
  currency: typeof CURRENCY
  eurToBgn: number
  delivery: DeliveryPricingConfig
}

type ParseOk = { ok: true; value: number }
type ParseErr = { ok: false; error: string }
type ParseResult = ParseOk | ParseErr

function parseCentsEnv(name: string, minValue: number): ParseResult {
  const raw = process.env[name]
  if (!raw || raw.trim() === '') return { ok: false, error: `${name} is not set` }
  const v = Number(raw.trim())
  if (!Number.isInteger(v)) return { ok: false, error: `${name} must be an integer (got: "${raw}")` }
  if (v < minValue) return { ok: false, error: `${name} must be >= ${minValue} (got: ${v})` }
  return { ok: true, value: v }
}

/**
 * Validates and returns delivery pricing config. Server-side only.
 * Throws a descriptive error listing every invalid env var.
 * Call this at checkout/order creation time, not at build time.
 */
export function getPricingConfig(): PricingConfig {
  const results = {
    baseCents:       parseCentsEnv('TEPE_DELIVERY_BASE_LOCKER_CENTS',       1),
    officeSurcharge: parseCentsEnv('TEPE_DELIVERY_OFFICE_SURCHARGE_CENTS',  0),
    addrSurcharge:   parseCentsEnv('TEPE_DELIVERY_ADDRESS_SURCHARGE_CENTS', 0),
    threshold:       parseCentsEnv('TEPE_FREE_DELIVERY_THRESHOLD_CENTS',    1),
  }

  const errors = Object.values(results)
    .filter((r): r is ParseErr => !r.ok)
    .map((r) => r.error)

  if (errors.length > 0) {
    throw new Error(
      `Delivery pricing config invalid — set env vars before enabling checkout:\n` +
      errors.map((e) => `  • ${e}`).join('\n'),
    )
  }

  return {
    currency: CURRENCY,
    eurToBgn: EUR_TO_BGN,
    delivery: {
      baseLockerCents:            (results.baseCents       as ParseOk).value,
      officeSurchargeCents:       (results.officeSurcharge as ParseOk).value,
      addressSurchargeCents:      (results.addrSurcharge   as ParseOk).value,
      freeDeliveryThresholdCents: (results.threshold       as ParseOk).value,
    },
  }
}

// ─── Client-compatible display constants ─────────────────────────────────────
//
// Non-NEXT_PUBLIC_ env vars are unavailable in the client bundle.
// These resolve to 0 on the client side. Client components MUST guard
// against 0 before using in calculations (e.g. skip progress bar if 0).
// All checkout/order business logic MUST use getPricingConfig() instead.

function readCentsOrZero(name: string): number {
  if (typeof process === 'undefined') return 0
  // NEXT_PUBLIC_ version is available in the browser bundle; server-side var as fallback
  const raw = process.env[`NEXT_PUBLIC_${name}`] ?? process.env[name]
  if (!raw) return 0
  const v = parseInt(raw.trim(), 10)
  return Number.isInteger(v) && v >= 0 ? v : 0
}

export const PRICING = {
  CURRENCY,
  EUR_TO_BGN,
  DELIVERY: {
    BASE_LOCKER_CENTS:       readCentsOrZero('TEPE_DELIVERY_BASE_LOCKER_CENTS'),
    OFFICE_SURCHARGE_CENTS:  readCentsOrZero('TEPE_DELIVERY_OFFICE_SURCHARGE_CENTS'),
    ADDRESS_SURCHARGE_CENTS: readCentsOrZero('TEPE_DELIVERY_ADDRESS_SURCHARGE_CENTS'),
  },
  FREE_DELIVERY_THRESHOLD_CENTS: readCentsOrZero('TEPE_FREE_DELIVERY_THRESHOLD_CENTS'),
}
