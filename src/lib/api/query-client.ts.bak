import { QueryClient } from '@tanstack/react-query'

/**
 * Factory for the TanStack Query client.
 * A new instance is created per request on the server to avoid
 * leaking state across users, and once on the client.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min: avoid immediate refetch on mount
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
