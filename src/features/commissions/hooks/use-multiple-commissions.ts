'use client'

import { useQueries } from '@tanstack/react-query'
import { parseApiError } from '@/lib/api/error'
import { commissionsApi, SalesPayout } from '../api/commissions.api'

export function useSalesPayouts(salesIds: number[] | undefined, params?: Record<string, unknown>) {
  if (!salesIds || salesIds.length === 0) {
    return { data: [], isLoading: false, isError: false }
  }

  const queries = useQueries({
    queries: salesIds.map((id) => ({
      queryKey: ['commissions', 'payout', id, params ?? {}],
      queryFn: () => commissionsApi.getSalesPayout(id, params),
      enabled: Boolean(id),
      retry: 0,
      meta: { parseError },
    })),
  })

  const isLoading = queries.some((q) => q.isLoading)
  const isError = queries.some((q) => q.isError)
  const data = queries.map((q) => q.data as SalesPayout | undefined)

  return { data, isLoading, isError, queries }
}

export default useSalesPayouts
