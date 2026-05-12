export type EmailConfigResult = {
  valid: boolean
  issues: string[]
  smtpHost: string | null
  smtpPort: number | null
  appBaseUrl: string | null
  appBaseUrlValid: boolean
}

export function validateEmailConfig(): EmailConfigResult {
  const issues: string[] = []

  if (!process.env.SMTP_HOST) issues.push('SMTP_HOST is missing')
  if (!process.env.SMTP_USER) issues.push('SMTP_USER is missing')
  if (!process.env.SMTP_PASSWORD) issues.push('SMTP_PASSWORD is missing')
  if (!process.env.SMTP_FROM_EMAIL) issues.push('SMTP_FROM_EMAIL is missing')

  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : null
  if (process.env.SMTP_PORT && (isNaN(smtpPort!) || smtpPort! < 1)) {
    issues.push('SMTP_PORT must be a valid port number')
  }

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
    smtpHost: process.env.SMTP_HOST ?? null,
    smtpPort,
    appBaseUrl,
    appBaseUrlValid,
  }
}
