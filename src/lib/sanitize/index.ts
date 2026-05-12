/**
 * Sanitization helpers for log and audit payloads.
 * Recursively redacts sensitive fields before any write to SystemLog or AdminAuditLog.
 */

const REDACTED = '[REDACTED]'

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'sessioncookie',
  'authorization',
  'confirmationtoken',
  'confirmationtokenhash',
  'emailretrytoken',
  'emailretrytokenhash',
  'invitetoken',
  'tokenhash',
  'bootstrapkey',
  'smtppassword',
  'telegrambottoken',
  'databaseurl',
  'connectionstring',
  'postgresql_url',
  'session_secret',
  'admin_bootstrap_key',
  'cron_secret',
])

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.has(key.toLowerCase())
}

function sanitize(data: unknown, depth: number): unknown {
  if (depth > 20) return '[MAX_DEPTH]'
  if (data === null || data === undefined) return data
  if (data instanceof Date) return data
  if (Array.isArray(data)) return data.map((item) => sanitize(item, depth + 1))
  if (typeof data === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      result[key] = isSensitiveKey(key) ? REDACTED : sanitize(value, depth + 1)
    }
    return result
  }
  return data
}

/** Redact sensitive fields before writing to SystemLog. */
export function sanitizeForLog(data: unknown): unknown {
  return sanitize(data, 0)
}

/** Redact sensitive fields before writing to AdminAuditLog before/after snapshots. */
export function sanitizeAuditPayload(data: unknown): unknown {
  return sanitize(data, 0)
}
