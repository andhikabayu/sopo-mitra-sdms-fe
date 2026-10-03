'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { parseApiError } from '@/lib/api/error'
import { commissionInvoicesApi } from '../api/commission-invoices.api'

export function useCommissionInvoicesList(params?: Record<string, unknown>, enabled = true) {
  return useQuery({
    queryKey: ['commission-invoices', 'list', params ?? {}],
    queryFn: () => commissionInvoicesApi.list(params),
    enabled,
    meta: { parseError: parseApiError },
  })
}

export function useCommissionInvoiceGenerate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { sales_id: number; start_date: string; end_date: string }) => commissionInvoicesApi.generate(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['commission-invoices'] }),
    meta: { parseError: parseApiError },
  })
}

export function useCommissionInvoicePay() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (invoiceId: number) => commissionInvoicesApi.pay(invoiceId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['commission-invoices'] }),
    meta: { parseError: parseApiError },
  })
}

export function useSalesSummary(salesId?: number, enabled = true) {
  return useQuery({
    queryKey: ['commission-invoices', 'summary', salesId],
    queryFn: () => commissionInvoicesApi.salesSummary(salesId ?? 0),
    enabled: Boolean(enabled && salesId),
    meta: { parseError: parseApiError },
  })
}

export function useCommissionInvoiceById(id?: number, enabled = true) {
  return useQuery({
    queryKey: ['commission-invoices', 'byId', id],
    queryFn: () => commissionInvoicesApi.getById(id ?? 0),
    enabled: Boolean(enabled && id !== undefined),
    meta: { parseError: parseApiError },
  })
}
