import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth/session'

export const runtime = 'nodejs'

export async function GET(): Promise<NextResponse> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    admin: { username: admin.username, displayName: admin.displayName, role: admin.role },
  })
}
