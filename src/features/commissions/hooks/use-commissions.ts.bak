'use client'

import { useQuery } from '@tanstack/react-query'
import { parseApiError } from '@/lib/api/error'
import { commissionsApi } from '../api/commissions.api'

export function useSalesPayout(salesId?: number, params?: Record<string, unknown>, enabled = true) {
  return useQuery({
    queryKey: ['commissions', 'payout', salesId, params ?? {}],
    queryFn: () => commissionsApi.getSalesPayout(salesId ?? 0, params),
    enabled: Boolean(enabled && salesId),
    retry: 0,
    meta: { parseError: parseApiError },
  })
}
