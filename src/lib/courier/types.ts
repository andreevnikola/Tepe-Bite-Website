export type PickupPointType = 'locker' | 'office'

export type CourierPickupPoint = {
  code: string
  type: PickupPointType
  courier: 'speedy'
  city: string
  name: string
  address: string
  workingTime?: string
  lat?: number
  lng?: number
  sourceUrl: string
  /** ISO date string. Must be set and within 90 days for the point to be selectable in production. */
  lastVerifiedAt: string | null
}

const VERIFICATION_WINDOW_DAYS = 90

/**
 * A pickup point is verified only if lastVerifiedAt is set and within the last 90 days.
 * Unverified or stale points must not be offered in production checkout.
 */
export function isPickupPointVerified(
  point: CourierPickupPoint,
  now: Date = new Date(),
): boolean {
  if (!point.lastVerifiedAt) return false
  const verifiedAt = new Date(point.lastVerifiedAt)
  if (isNaN(verifiedAt.getTime())) return false
  const diffMs = now.getTime() - verifiedAt.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays <= VERIFICATION_WINDOW_DAYS
}
