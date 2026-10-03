'use client'

import { useQuery } from '@tanstack/react-query'
import { parseApiError } from '@/lib/api/error'
import { transactionsApi } from '../api/transactions.api'

export function useTransactionsList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['transactions', 'list', params ?? {}],
    queryFn: () => transactionsApi.list(params),
    meta: { parseError: parseApiError },
  })
}
