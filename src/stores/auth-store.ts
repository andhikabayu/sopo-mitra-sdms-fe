import { create } from 'zustand'

/** Authenticated user (aligned with API_DOCS.md user object). */
export interface AuthUser {
  id?: number
  name: string
  username?: string
  email?: string
  /** Single role string: Sales | Manager | Store Inspector | Super Admin. */
  role?: string
  avatarUrl?: string
}

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  setUser: (user: AuthUser) => void
  clear: () => void
  setStatus: (status: AuthStatus) => void
}

/**
 * Client-side auth state. Holds the current user + status only.
 * Tokens are intentionally NOT stored here — they live in cookies
 * (see token-storage) so middleware can read them. This keeps Zustand
 * focused on UI-facing client state, separate from server state.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  setUser: (user) => set({ user, status: 'authenticated' }),
  setStatus: (status) => set({ status }),
  clear: () => set({ user: null, status: 'unauthenticated' }),
}))
