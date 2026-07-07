import 'server-only'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME } from '@/lib/dashboard/constants'
import { getMongoose } from '@/lib/mongo'
import { Admin, type AdminDoc } from '@/lib/mongo/models/Admin'

const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET is missing or shorter than 32 characters')
  }
  return secret
}

/** token = base64url(payload).base64url(hmac-sha256(payload)) */
export function createSessionToken(adminId: string): string {
  const payload = { sub: adminId, exp: Date.now() + MAX_AGE_MS }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', getSecret()).update(payloadB64).digest('base64url')
  return `${payloadB64}.${sig}`
}

export function verifySessionToken(token: string): { sub: string } | null {
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sig] = parts

  const expected = crypto.createHmac('sha256', getSecret()).update(payloadB64).digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null
    if (typeof payload.sub !== 'string' || !payload.sub) return null
    return { sub: payload.sub }
  } catch {
    return null
  }
}

export async function setSessionCookie(adminId: string): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE_NAME, createSessionToken(adminId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(MAX_AGE_MS / 1000),
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE_NAME)
}

export async function getSessionAdminId(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)?.sub ?? null
}

/**
 * Resolve the currently authenticated admin from the session cookie.
 * Returns null if unauthenticated, the account is missing, or deactivated.
 */
export async function getCurrentAdmin(): Promise<AdminDoc | null> {
  const id = await getSessionAdminId()
  if (!id) return null
  try {
    await getMongoose()
    const admin = await Admin.findById(id).lean<AdminDoc>()
    if (!admin || !admin.isActive) return null
    return admin
  } catch {
    return null
  }
}
