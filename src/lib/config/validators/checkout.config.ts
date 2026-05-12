import { PRICING } from '../pricing'

export type CheckoutConfigResult = {
  valid: boolean
  issues: string[]
  baseLockerCentsSet: boolean
}

export function validateCheckoutConfig(): CheckoutConfigResult {
  const issues: string[] = []

  const baseLockerCentsSet = PRICING.DELIVERY.BASE_LOCKER_CENTS > 0

  if (!baseLockerCentsSet) {
    issues.push('PRICING.DELIVERY.BASE_LOCKER_CENTS is 0 — set the base Speedy locker delivery cost before enabling checkout')
  }

  return {
    valid: issues.length === 0,
    issues,
    baseLockerCentsSet,
  }
}
