import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth/session'
import type { AdminDoc } from '@/lib/mongo/models/Admin'

/**
 * Guard for /api/admin/* route handlers. Returns the authenticated admin, or a
 * ready-to-return 401 response. Usage:
 *   const { admin, response } = await requireAdmin()
 *   if (!admin) return response
 */
export async function requireAdmin(): Promise<
  { admin: AdminDoc; response: null } | { admin: null; response: NextResponse }
> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return { admin: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { admin, response: null }
}
