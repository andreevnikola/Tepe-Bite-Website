/**
 * Next 16 "proxy" (renamed from middleware). Two responsibilities:
 *
 * 1. Language resolution for every public page. A valid `?lang=` query value
 *    overrides the language cookie; otherwise the cookie is used; otherwise
 *    Bulgarian. The resolved value is injected as the `x-tepe-lang` request
 *    header so the root layout can render the correct `<html lang>` and seed
 *    the Jotai store in the SAME initial response (a response cookie only
 *    takes effect on the next request, so it cannot drive this request's SSR).
 *    When an explicit valid `?lang=` is present we also persist it as the
 *    cookie for subsequent navigations.
 *
 * 2. Auth guard for `/admin/*` page routes: unauthenticated requests are
 *    redirected to `/admin/login`. Only verifies the signed session cookie at
 *    the edge — API routes under `/api/admin` do their own DB-backed auth and
 *    return 401 instead of redirecting.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionTokenEdge } from '@/lib/auth/session-edge'
import { SESSION_COOKIE_NAME } from '@/lib/dashboard/constants'
import { isLang, LANG_COOKIE } from '@/store/lang'
import { LANG_HEADER, resolveLang } from '@/lib/i18n/resolve'

const LANG_COOKIE_MAX_AGE = 31536000 // 1 year, matches writeLangCookie()

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Resolve the language for this request: valid ?lang= › cookie › bg.
  const queryLang = request.nextUrl.searchParams.get('lang')
  const cookieLang = request.cookies.get(LANG_COOKIE)?.value
  const lang = resolveLang(queryLang, cookieLang)
  const hasExplicitLang = isLang(queryLang)

  // Inject the resolved language so server components can read it this request.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LANG_HEADER, lang)

  const withLang = () => {
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    // Persist an explicit choice so the next navigation keeps it.
    if (hasExplicitLang && lang !== cookieLang) {
      response.cookies.set(LANG_COOKIE, lang, {
        path: '/',
        maxAge: LANG_COOKIE_MAX_AGE,
        sameSite: 'lax',
      })
    }
    return response
  }

  // Admin auth guard (login page stays reachable while unauthenticated).
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
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
  }

  return withLang()
}

export const config = {
  // Run on all page routes for language resolution; skip Next internals,
  // API routes, the Sanity Studio, and static files (anything with a dot).
  matcher: ['/((?!_next/static|_next/image|api|studio|favicon.ico|.*\\..*).*)'],
}
