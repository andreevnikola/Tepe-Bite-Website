export type AdminConfigResult = {
  valid: boolean
  issues: string[]
  hasBootstrapKey: boolean
  sessionSecretLength: number
}

const MIN_SESSION_SECRET_LENGTH = 32

export function validateAdminConfig(): AdminConfigResult {
  const issues: string[] = []

  const sessionSecret = process.env.SESSION_SECRET ?? ''
  if (!sessionSecret) {
    issues.push('SESSION_SECRET is missing')
  } else if (sessionSecret.length < MIN_SESSION_SECRET_LENGTH) {
    issues.push(`SESSION_SECRET must be at least ${MIN_SESSION_SECRET_LENGTH} characters`)
  }

  const hasBootstrapKey = Boolean(process.env.ADMIN_BOOTSTRAP_KEY)
  if (!hasBootstrapKey) {
    issues.push('ADMIN_BOOTSTRAP_KEY is missing')
  }

  return {
    valid: issues.length === 0,
    issues,
    hasBootstrapKey,
    sessionSecretLength: sessionSecret.length,
  }
}
