import Cookies from 'js-cookie'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from './constants'

/**
 * Single owner of auth token + user persistence.
 * Stored in cookies (not localStorage) so that Next.js middleware can read
 * the token server-side for route protection.
 *
 * The backend has no /auth/me endpoint, so the user profile returned at
 * login is persisted here and rehydrated on reload.
 *
 * NOTE: With client-managed Bearer tokens these cookies are not HttpOnly.
 * If the backend later supports HttpOnly cookie auth, only this module
 * and the Axios interceptor need to change.
 */

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY }

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  expires: 7, // days; real expiry is enforced server-side via 401 + refresh
}

export const tokenStorage = {
  getAccessToken(): string | undefined {
    const raw = Cookies.get(ACCESS_TOKEN_KEY)
    console.log('tokenStorage.getAccessToken: raw', raw)
    if (!raw) return undefined
    // guard against cookies set to the literal strings 'undefined' or 'null'
    if (raw === 'undefined' || raw === 'null') return undefined
    return raw
  },

  getRefreshToken(): string | undefined {
    const raw = Cookies.get(REFRESH_TOKEN_KEY)
    if (!raw) return undefined
    if (raw === 'undefined' || raw === 'null') return undefined
    return raw
  },

  setTokens(accessToken: string, refreshToken: string): void {
    console.log('tokenStorage.setTokens: storing tokens', {
      accessTokenLength: accessToken?.length,
      refreshTokenLength: refreshToken?.length,
    })
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS)
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS)
    console.log('tokenStorage.setTokens: after Cookies.set, verify:', {
      stored_access: Cookies.get(ACCESS_TOKEN_KEY)?.substring(0, 20),
      stored_refresh: Cookies.get(REFRESH_TOKEN_KEY)?.substring(0, 20),
    })
  },

  /** Persist the authenticated user profile (no /auth/me endpoint exists). */
  setUser(user: unknown): void {
    Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS)
  },

  getUser<T>(): T | null {
    const raw = Cookies.get(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  clear(): void {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' })
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' })
    Cookies.remove(USER_KEY, { path: '/' })
  },

  hasSession(): boolean {
    const raw = Cookies.get(ACCESS_TOKEN_KEY)
    return Boolean(raw && raw !== 'undefined' && raw !== 'null')
  },
}
