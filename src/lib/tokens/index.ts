import crypto from 'crypto'

export function generateRawToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

export function generateConfirmationToken(): {
  rawToken: string
  hash: string
  expiresAt: Date
} {
  const rawToken = generateRawToken()
  return {
    rawToken,
    hash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }
}

export function generateEmailRetryToken(): {
  rawToken: string
  hash: string
  expiresAt: Date
} {
  const rawToken = generateRawToken()
  return {
    rawToken,
    hash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  }
}

export function computePayloadHash(normalized: string): string {
  return crypto.createHash('sha256').update(normalized).digest('hex')
}
