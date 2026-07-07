import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimiter } from '@/lib/rate-limit'
import { getMongoose } from '@/lib/mongo'
import { Admin } from '@/lib/mongo/models/Admin'
import { verifyPassword } from '@/lib/auth/password'
import { setSessionCookie } from '@/lib/auth/session'

export const runtime = 'nodejs'

// A valid bcrypt hash of a random string — compared against on unknown users so
// response timing doesn't reveal whether a username exists.
const DUMMY_HASH = '$2b$12$OQUojo25zN3elyY0wePhdeNfae1f/ljqldVbX8VLQ6AjMl9r02Jna'

const LoginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(256),
})

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getIp(req)

  const rl = await rateLimiter.check(`admin_login:${ip}`, 10, 600)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 422 })
  }

  const { username, password } = parsed.data
  const invalid = NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })

  await getMongoose()
  const admin = await Admin.findOne({ username: username.trim().toLowerCase() })

  if (!admin || !admin.isActive) {
    await verifyPassword(password, DUMMY_HASH) // equalize timing
    return invalid
  }

  const ok = await verifyPassword(password, admin.passwordHash)
  if (!ok) return invalid

  admin.lastLoginAt = new Date()
  await admin.save()

  await setSessionCookie(admin._id.toString())

  return NextResponse.json({
    ok: true,
    admin: { username: admin.username, displayName: admin.displayName, role: admin.role },
  })
}
