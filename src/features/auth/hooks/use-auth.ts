'use client'

import { useAuthStore } from '@/stores/auth-store'

/**
 * Convenience selector hook for auth state.
 * Components read auth state through this instead of touching the store
 * shape directly, keeping the public surface stable.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated' && Boolean(user),
    isLoading: status === 'idle',
  }
}
