'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { setSessionExpiredHandler } from '@/lib/api/axios'
import { ROUTES } from '@/config/routes'
import { authService } from '../services/auth.service'

/**
 * Bootstraps client auth state on load:
 *  - Rehydrates the user from the persisted session cookie (no /auth/me
 *    endpoint exists — see API_DOCS.md).
 *  - Refreshes role from JWT claims and falls back to GET /users/{id}.
 *  - Wires the Axios "session expired" hook so an expired/invalid token
 *    clears state and redirects to /login.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const setStatus = useAuthStore((s) => s.setStatus)
  const clear = useAuthStore((s) => s.clear)

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clear()
      router.replace(ROUTES.login)
    })
  }, [clear, router])

  useEffect(() => {
    let cancelled = false

    async function bootstrapSession() {
      if (!authService.hasSession()) {
        setStatus('unauthenticated')
        return
      }

      const stored = authService.getStoredUser()
      if (!stored) {
        clear()
        return
      }

      const user = await authService.resolveUserRole(stored)
      if (!cancelled) {
        setUser(user)
      }
    }

    bootstrapSession()

    return () => {
      cancelled = true
    }
  }, [setUser, setStatus, clear])

  return <>{children}</>
}
