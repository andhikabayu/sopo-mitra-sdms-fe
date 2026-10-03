import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_TOKEN_KEY } from '@/lib/auth/constants'
import { AUTH_ROUTES, PROTECTED_PREFIXES, ROUTES } from '@/config/routes'

/**
 * Edge route protection.
 *  - Unauthenticated access to a protected prefix -> redirect to /login
 *    (preserving the intended destination via ?returnUrl).
 *  - Authenticated access to a public auth route -> redirect to /dashboard.
 *
 * Token presence is a coarse gate; true validity is enforced server-side
 * (Axios 401 + refresh) once the app loads.
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl
  const hasToken = Boolean(request.cookies.get(ACCESS_TOKEN_KEY)?.value)

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
  const isAuthRoute = AUTH_ROUTES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  if (isProtected && !hasToken) {
    const url = request.nextUrl.clone()
    url.pathname = ROUTES.login
    url.search = ''
    url.searchParams.set('returnUrl', `${pathname}${search}`)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && hasToken) {
    const url = request.nextUrl.clone()
    // If a Sales user logs in, send them to the Sales Dashboard instead
    // Middleware cannot safely decode JWT; rely on a lightweight claim in cookie if present.
    const access = request.cookies.get(ACCESS_TOKEN_KEY)?.value
    if (access && access.includes('Sales')) {
      url.pathname = '/dashboard-sales'
    } else {
      url.pathname = ROUTES.dashboard
    }
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Skip API proxy routes, Next internals, and static assets.
  matcher: ['/((?!api/app/v1|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
