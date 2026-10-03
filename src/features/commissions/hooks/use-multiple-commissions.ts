'use client'

import type { UseQueryResult } from '@tanstack/react-query'
import { useQueries } from '@tanstack/react-query'
import type { SalesPayout } from '../api/commissions.api'
import { commissionsApi } from '../api/commissions.api'

export function useSalesPayouts(salesIds: number[] | undefined, params?: Record<string, unknown>) {
  const queries = useQueries({
    queries: (salesIds ?? []).map((id) => ({
      queryKey: ['commissions', 'payout', id, params ?? {}],
      queryFn: () => commissionsApi.getSalesPayout(id, params),
      enabled: Boolean(id && (salesIds?.length ?? 0) > 0),
      retry: 0,
    })),
  })

  const isLoading = queries.some((q) => q.isPending)
  const isError = queries.some((q) => q.isError)
  const data = queries.map((q) => q.data as SalesPayout | undefined)

  return { data, isLoading, isError, queries }
}

export default useSalesPayouts
