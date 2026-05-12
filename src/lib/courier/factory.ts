import { ManualCourierProvider } from './manual.provider'
import type { CourierProvider } from './provider.interface'
import { SpeedyApiCourierProvider } from './speedy-api.provider'

type CourierProviderName = 'manual' | 'speedy_api'

/**
 * Returns the active courier provider based on COURIER_LOCATION_PROVIDER env var.
 * - "mock" is refused in production.
 * - Defaults to "manual" if env var is unset.
 */
export function getCourierProvider(): CourierProvider {
  const raw = process.env.COURIER_LOCATION_PROVIDER ?? 'manual'

  if (raw === 'mock') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'COURIER_LOCATION_PROVIDER=mock is not allowed in production. Use "manual" or "speedy_api".',
      )
    }
    // In dev/test, mock falls back to manual provider
    return new ManualCourierProvider()
  }

  const provider = raw as CourierProviderName

  switch (provider) {
    case 'manual':
      return new ManualCourierProvider()
    case 'speedy_api':
      return new SpeedyApiCourierProvider()
    default:
      throw new Error(
        `Unknown COURIER_LOCATION_PROVIDER: "${raw}". Allowed values: manual, speedy_api`,
      )
  }
}
