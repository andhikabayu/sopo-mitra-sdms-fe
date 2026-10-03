'use client'

import { useState, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { makeQueryClient } from '@/lib/api/query-client'
import { AuthProvider } from '@/features/auth'
import { ToastProvider } from '@/components/ui/toast'

/**
 * Client-side provider tree. Server state (TanStack Query) is wired here.
 * Additional client providers (theme, toast) compose into this boundary.
 */
export function Providers({ children }: { children: ReactNode }) {
  // useState ensures a single QueryClient instance survives re-renders.
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  )
}
