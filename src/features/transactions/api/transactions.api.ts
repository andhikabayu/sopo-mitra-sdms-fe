import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import type { ApiEnvelope } from '@/types/api'

export interface TransactionSalesItem {
  name: string
}

export interface TransactionRecord {
  id: number
  outlet_name: string
  product_name: string
  sales: TransactionSalesItem[]
  sold_quantity: number
  revenue: number
  createdAt: string
}

export interface TransactionListMetadata {
  total: number
  limit: number
  offset: number
  page?: number
  total_pages?: number
}

export interface TransactionListResponse {
  items: TransactionRecord[]
  metadata?: TransactionListMetadata
}

export const transactionsApi = {
  async list(params?: Record<string, unknown>): Promise<TransactionListResponse> {
    const { data } = await apiClient.get<ApiEnvelope<unknown>>(API_ROUTES.transactions.base, {
      params: {
        sort: 'desc',
        limit: 50,
        offset: 0,
        ...params,
      },
    })

    const payload = data.data as
      | TransactionRecord[]
      | { items?: TransactionRecord[]; data?: { items?: TransactionRecord[]; metadata?: TransactionListMetadata }; metadata?: TransactionListMetadata }
      | undefined

    const nestedPayload = payload && !Array.isArray(payload) && 'data' in payload ? payload.data : undefined

    const items = Array.isArray(payload) ? payload : payload?.items ?? nestedPayload?.items ?? []

    const metadata = Array.isArray(payload)
      ? (data as { metadata?: TransactionListMetadata }).metadata
      : payload?.metadata ?? nestedPayload?.metadata ?? (data as { metadata?: TransactionListMetadata }).metadata

    return { items, metadata }
  },
}
