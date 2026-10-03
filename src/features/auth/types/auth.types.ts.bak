import type { AuthUser } from '@/stores/auth-store'

export type { AuthUser }

/** Login credentials. `username` accepts a username OR an email. */
export interface LoginCredentials {
  username: string
  password: string
}

/**
 * Raw login response from POST /auth/login (see API_DOCS.md).
 * Includes `role` directly on the response; JWT also carries `role` claim.
 */
export interface BackendLoginResponse {
  code: number
  message: string
  data: {
    id: number
    name: string
    role?: string
    access_token: string
    refresh_token: string
  }
}
