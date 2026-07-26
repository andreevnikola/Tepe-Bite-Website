import { getPricingConfig } from '../pricing'

export type CheckoutConfigIssue = {
  envVar: string
  message: string
}

export type CheckoutConfigResult = {
  valid: boolean
  issues: CheckoutConfigIssue[]
  baseLockerCentsSet: boolean
}

/**
 * Validates delivery pricing config for checkout readiness.
 * Reports each missing/invalid env var individually.
 * Does not throw — returns structured issues for system health reporting.
 */
export function validateCheckoutConfig(): CheckoutConfigResult {
  const issues: CheckoutConfigIssue[] = []

  const checks: Array<{ name: string; minValue: number; label: string }> = [
    { name: 'TEPE_DELIVERY_BASE_LOCKER_CENTS',       minValue: 1, label: 'base Speedy locker delivery cost' },
    { name: 'TEPE_DELIVERY_OFFICE_SURCHARGE_CENTS',  minValue: 0, label: 'office delivery surcharge' },
    { name: 'TEPE_DELIVERY_ADDRESS_SURCHARGE_CENTS', minValue: 0, label: 'address delivery surcharge' },
    { name: 'TEPE_FREE_DELIVERY_THRESHOLD_CENTS',    minValue: 1, label: 'free delivery threshold' },
  ]

  for (const { name, minValue, label } of checks) {
    const raw = process.env[name]
    if (!raw || raw.trim() === '') {
      issues.push({ envVar: name, message: `${name} is not set (${label})` })
      continue
    }
    const v = Number(raw.trim())
    if (!Number.isInteger(v)) {
      issues.push({ envVar: name, message: `${name} must be an integer (got: "${raw}")` })
      continue
    }
    if (v < minValue) {
      issues.push({ envVar: name, message: `${name} must be >= ${minValue} (got: ${v}) — ${label}` })
    }
  }

  const baseLockerCentsSet = (() => {
    try { getPricingConfig(); return true } catch { return false }
  })()

  // The NEXT_PUBLIC_ copies are inlined into the client bundle at build time;
  // the bare vars are read at runtime from /etc/tepebite.env. If they drift,
  // the client-side progress bar / surcharge preview silently disagrees with
  // what checkout actually charges.
  const pairs: Array<[string, string]> = [
    ['NEXT_PUBLIC_TEPE_DELIVERY_BASE_LOCKER_CENTS', 'TEPE_DELIVERY_BASE_LOCKER_CENTS'],
    ['NEXT_PUBLIC_TEPE_DELIVERY_OFFICE_SURCHARGE_CENTS', 'TEPE_DELIVERY_OFFICE_SURCHARGE_CENTS'],
    ['NEXT_PUBLIC_TEPE_DELIVERY_ADDRESS_SURCHARGE_CENTS', 'TEPE_DELIVERY_ADDRESS_SURCHARGE_CENTS'],
    ['NEXT_PUBLIC_TEPE_FREE_DELIVERY_THRESHOLD_CENTS', 'TEPE_FREE_DELIVERY_THRESHOLD_CENTS'],
  ]
  for (const [publicName, serverName] of pairs) {
    const publicRaw = process.env[publicName]
    const serverRaw = process.env[serverName]
    if (publicRaw !== undefined && serverRaw !== undefined && publicRaw.trim() !== serverRaw.trim()) {
      issues.push({
        envVar: publicName,
        message: `${publicName} ("${publicRaw}") does not match ${serverName} ("${serverRaw}") — the public build value and server runtime value must be identical`,
      })
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    baseLockerCentsSet,
  }
}
