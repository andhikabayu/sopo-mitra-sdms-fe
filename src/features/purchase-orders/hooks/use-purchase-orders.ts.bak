'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { modulesApi } from '@/features/modules/api/modules.api'
import { parseApiError } from '@/lib/api/error'
import { purchaseOrdersApi, type PurchaseOrderApprovalPayload } from '../api/purchase-orders.api'

export function usePurchaseOrdersList(params?: Record<string, unknown>, enabled = true) {
  return useQuery({
    queryKey: ['purchase-orders', 'list', params ?? {}],
    queryFn: () => purchaseOrdersApi.list(params),
    enabled,
    meta: { parseError: parseApiError },
  })
}

export function usePurchaseOrderDetail(id?: number) {
  return useQuery({
    queryKey: ['purchase-orders', id],
    queryFn: () => purchaseOrdersApi.getById(Number(id)),
    enabled: !!id,
    meta: { parseError: parseApiError },
  })
}

export function usePurchaseOrderCreate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof purchaseOrdersApi.create>[0]) => purchaseOrdersApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-orders'] })
      qc.invalidateQueries({ queryKey: ['module', '/purchase-orders'] })
    },
    meta: { parseError: parseApiError },
  })
}

export function usePurchaseOrderOutletOptions(salesId?: number, enabled = true) {
  return useQuery({
    queryKey: ['purchase-orders', 'outlets', salesId],
    queryFn: () => modulesApi.listWithMeta('/outlets', { approval: 'approve', sales_id: salesId }),
    enabled: enabled && Boolean(salesId),
    meta: { parseError: parseApiError },
  })
}

export function usePurchaseOrderUpdate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: PurchaseOrderApprovalPayload }) => purchaseOrdersApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-orders'] })
      qc.invalidateQueries({ queryKey: ['module', '/purchase-orders'] })
    },
    meta: { parseError: parseApiError },
  })
}

export function usePurchaseOrderDelete() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => purchaseOrdersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-orders'] })
      qc.invalidateQueries({ queryKey: ['module', '/purchase-orders'] })
    },
    meta: { parseError: parseApiError },
  })
}

export function usePurchaseOrderAnalytics(id?: number, params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['purchase-orders', 'analytics', id, params ?? {}],
    queryFn: () => purchaseOrdersApi.getAnalytics(Number(id), params),
    enabled: !!id,
    meta: { parseError: parseApiError },
  })
}
