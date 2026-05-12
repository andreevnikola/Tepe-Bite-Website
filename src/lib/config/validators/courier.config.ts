export type CourierProvider = 'manual' | 'speedy_api'

export type CourierConfigResult = {
  valid: boolean
  issues: string[]
  provider: CourierProvider | null
  isMock: boolean
}

const ALLOWED_PROVIDERS: CourierProvider[] = ['manual', 'speedy_api']

export function validateCourierConfig(): CourierConfigResult {
  const issues: string[] = []
  const raw = process.env.COURIER_LOCATION_PROVIDER ?? ''

  const isMock = raw === 'mock'

  if (isMock && process.env.NODE_ENV === 'production') {
    issues.push('COURIER_LOCATION_PROVIDER=mock is not allowed in production')
  }

  const provider: CourierProvider | null = (ALLOWED_PROVIDERS as string[]).includes(raw)
    ? (raw as CourierProvider)
    : null

  if (!isMock && !provider) {
    issues.push(
      `COURIER_LOCATION_PROVIDER must be one of: ${ALLOWED_PROVIDERS.join(', ')} (got: "${raw || 'unset'}")`,
    )
  }

  if (raw === 'speedy_api') {
    if (!process.env.SPEEDY_API_CLIENT_ID) issues.push('SPEEDY_API_CLIENT_ID is required when COURIER_LOCATION_PROVIDER=speedy_api')
    if (!process.env.SPEEDY_API_SECRET) issues.push('SPEEDY_API_SECRET is required when COURIER_LOCATION_PROVIDER=speedy_api')
  }

  return {
    valid: issues.length === 0,
    issues,
    provider,
    isMock,
  }
}
