'use client'

import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { parseApiError } from '@/lib/api/error'
import { authService } from '../services/auth.service'
import type { LoginCredentials } from '../types/auth.types'

/**
 * Login mutation. On success, persists the user into the auth store.
 * Navigation is left to the caller (separation of concerns).
 */
export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (user) => setUser(user),
    // Normalize errors so the component renders a clean message.
    onError: () => undefined,
    meta: { parseError: parseApiError },
  })
}
