import { tokenStorage } from '@/lib/auth/token-storage'
import { decodeJwt } from '@/lib/auth/jwt'
import { extractRoleFromClaims, normalizeRole } from '@/lib/auth/roles'
import { env } from '@/config/env'
import { authApi } from '../api/auth.api'
import type { AuthUser, LoginCredentials } from '../types/auth.types'

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function buildUserFromLogin(
  res: { id?: number; name: string; role?: string; access_token: string },
  credentials: LoginCredentials,
): AuthUser {
  const claims = decodeJwt<Record<string, unknown>>(res.access_token) ?? {}

  // Prefer server-provided `res.id` when available; otherwise fall back to JWT claims.
  const idFromRes = typeof res.id === 'number' ? res.id : undefined
  const idFromClaims = typeof claims.id === 'number' ? claims.id : typeof claims.user_id === 'number' ? claims.user_id : undefined

  return {
    name: res.name,
    username: asString(claims.username) ?? asString(claims.sub) ?? credentials.username,
    role: normalizeRole(res.role ?? extractRoleFromClaims(claims)),
    email: asString(claims.email),
    id: idFromRes ?? idFromClaims,
  }
}

/**
 * Business logic for authentication. Orchestrates the API layer and
 * token persistence so hooks/components stay declarative.
 */
export const authService = {
  /** Re-read role (and profile fields) from the persisted access token. */
  enrichUserFromToken(user: AuthUser): AuthUser {
    const token = tokenStorage.getAccessToken()
    if (!token) return user

    const claims = decodeJwt<Record<string, unknown>>(token) ?? {}
    const role = user.role ?? extractRoleFromClaims(claims)
    const id =
      user.id ??
      (typeof claims.id === 'number'
        ? claims.id
        : typeof claims.user_id === 'number'
          ? claims.user_id
          : undefined)

    return {
      ...user,
      role: normalizeRole(role),
      id,
      username: user.username ?? asString(claims.username) ?? asString(claims.sub),
      email: user.email ?? asString(claims.email),
    }
  },

  /** Fallback when JWT has no role claim — fetch from GET /users/{id}. */
  async resolveUserRole(user: AuthUser): Promise<AuthUser> {
    const enriched = this.enrichUserFromToken(user)
    if (enriched.role || !enriched.id || env.NEXT_PUBLIC_ENABLE_MOCK_AUTH) {
      return enriched
    }

    try {
      const profile = await authApi.getUserProfile(enriched.id)
      const resolved: AuthUser = {
        ...enriched,
        role: normalizeRole(profile.role),
        email: enriched.email ?? profile.email,
        username: enriched.username ?? profile.username,
        name: enriched.name || profile.name || enriched.name,
      }
      tokenStorage.setUser(resolved)
      return resolved
    } catch {
      return enriched
    }
  },

  /** Authenticate, persist tokens + user, and return the user. */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const res = await authApi.login(credentials)
    console.log('authService.login: got response with tokens', {
      accessTokenLength: res.access_token?.length,
      refreshTokenLength: res.refresh_token?.length,
    })
    tokenStorage.setTokens(res.access_token, res.refresh_token)

    let user = buildUserFromLogin(res, credentials)
    user = this.enrichUserFromToken(user)
    user = await this.resolveUserRole(user)
    tokenStorage.setUser(user)
    return user
  },

  /** No server logout endpoint exists — clear local session only. */
  async logout(): Promise<void> {
    tokenStorage.clear()
  },

  /** Rehydrate the persisted user and refresh role from token/API. */
  getStoredUser(): AuthUser | null {
    const stored = tokenStorage.getUser<AuthUser>()
    if (!stored) return null
    return this.enrichUserFromToken(stored)
  },

  hasSession(): boolean {
    return tokenStorage.hasSession()
  },
}
