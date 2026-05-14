export type EmailConfigResult = {
  valid: boolean
  issues: string[]
  appBaseUrl: string | null
  appBaseUrlValid: boolean
}

export function validateEmailConfig(): EmailConfigResult {
  const issues: string[] = []

  if (!process.env.SMTP_USER) issues.push('SMTP_USER is missing')
  if (!process.env.SMTP_PASSWORD) issues.push('SMTP_PASSWORD is missing')
  if (!process.env.SMTP_FROM_EMAIL) issues.push('SMTP_FROM_EMAIL is missing')

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
