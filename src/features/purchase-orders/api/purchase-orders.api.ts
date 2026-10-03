import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import { env } from '@/config/env'
import type { ApiEnvelope } from '@/types/api'
import { mockPurchaseOrdersApi } from './purchase-orders.mock'

export interface PurchaseOrderItem {
  product_id: number
  outlet_id: number
  requested_qty: number
  approved_qty?: number
}

export interface PurchaseOrderApprovalItem {
  product_id: number
  outlet_id: number
  approved_qty: number
}

export interface PurchaseOrderCreatePayload {
  notes: string
  items: PurchaseOrderItem[]
}

export interface PurchaseOrderApprovalPayload {
  status: 'approved' | 'rejected'
  admin_notes?: string
  items: PurchaseOrderApprovalItem[]
}

export interface PurchaseOrder {
  id: number
  sales_id: number
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  notes: string
  admin_notes?: string
  items: PurchaseOrderItem[]
  createdAt: string
  updatedAt: string
}

const realApi = {
  async create(body: PurchaseOrderCreatePayload): Promise<PurchaseOrder> {
    const { data } = await apiClient.post<ApiEnvelope<PurchaseOrder>>(API_ROUTES.purchaseOrders.base, body)
    return data.data
  },

  async list(params?: Record<string, unknown>): Promise<PurchaseOrder[]> {
    const { data } = await apiClient.get<ApiEnvelope<PurchaseOrder[]>>(API_ROUTES.purchaseOrders.base, { params })
    return data.data
  },

  async getById(id: number): Promise<PurchaseOrder> {
    const { data } = await apiClient.get<ApiEnvelope<PurchaseOrder>>(API_ROUTES.purchaseOrders.byId(id))
    return data.data
  },

  async update(id: number, body: PurchaseOrderApprovalPayload): Promise<PurchaseOrder> {
    const { data } = await apiClient.put<ApiEnvelope<PurchaseOrder>>(API_ROUTES.purchaseOrders.byId(id), body)
    return data.data
  },

  async delete(id: number): Promise<{ id: number }> {
    const { data } = await apiClient.delete<ApiEnvelope<{ id: number }>>(API_ROUTES.purchaseOrders.byId(id))
    return data.data
  },

  async getAnalytics(id: number, params?: Record<string, unknown>): Promise<any> {
    const { data } = await apiClient.get<ApiEnvelope<any>>(API_ROUTES.purchaseOrders.analytics(id), { params })
    return data.data
  },
}

export const purchaseOrdersApi = (env.NEXT_PUBLIC_ENABLE_MOCK_AUTH ? mockPurchaseOrdersApi : realApi) as typeof realApi
