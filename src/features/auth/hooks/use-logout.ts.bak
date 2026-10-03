'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { ROUTES } from '@/config/routes'
import { authService } from '../services/auth.service'

/**
 * Logout mutation. Clears server session + local tokens, resets client
 * state, and redirects to the login page.
 */
export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const clear = useAuthStore((s) => s.clear)

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clear()
      queryClient.clear()
      router.replace(ROUTES.login)
    },
  })
}
