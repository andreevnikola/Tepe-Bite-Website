/**
 * Next 16 "proxy" (renamed from middleware). Guards the /admin/* page routes:
 * unauthenticated requests are redirected to /admin/login. Only verifies the
 * signed session cookie at the edge — API routes under /api/admin do their own
 * DB-backed auth check and return 401 instead of redirecting.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionTokenEdge } from '@/lib/auth/session-edge'
import { SESSION_COOKIE_NAME } from '@/lib/dashboard/constants'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The login page must stay reachable while unauthenticated.
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const secret = process.env.SESSION_SECRET

  let authenticated = false
  if (token && secret) {
    const result = await verifySessionTokenEdge(token, secret)
    authenticated = result !== null
  }

  if (!authenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
