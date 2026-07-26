export type EmailConfigResult = {
  valid: boolean
  issues: string[]
  appBaseUrl: string | null
  appBaseUrlValid: boolean
}

export function validateEmailConfig(): EmailConfigResult {
  const issues: string[] = []

  if (!process.env.RESEND_API_KEY) issues.push('RESEND_API_KEY is missing')
  if (!process.env.EMAIL_FROM_ADDRESS) issues.push('EMAIL_FROM_ADDRESS is missing')

  const appBaseUrl = process.env.APP_BASE_URL ?? null
  let appBaseUrlValid = false

  if (!appBaseUrl) {
    issues.push('APP_BASE_URL is missing')
  } else {
    try {
      const parsed = new URL(appBaseUrl)
      if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
        issues.push('APP_BASE_URL must use https:// in production')
      } else {
        appBaseUrlValid = true
      }
    } catch {
      issues.push('APP_BASE_URL is not a valid URL')
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    appBaseUrl,
    appBaseUrlValid,
  }
}
