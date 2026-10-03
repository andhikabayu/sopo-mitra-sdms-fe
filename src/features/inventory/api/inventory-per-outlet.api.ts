import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import type { ApiEnvelope } from '@/types/api'

export interface PerOutletStockItem {
  product_name?: string
  quantity: number
}

export interface PerOutletResponse {
  outlet_id: number
  outlet_name: string
  stocks: PerOutletStockItem[]
}

export interface PerOutletApiResponse {
  code: number
  data: PerOutletResponse
  metadata: {
    total: number
    limit: number
    offset: number
  }
}

export const inventoryPerOutletApi = {
  async getPerOutletData(outletId: number, params?: { limit?: number; offset?: number }): Promise<PerOutletResponse> {
    const { data } = await apiClient.get<ApiEnvelope<PerOutletApiResponse>>(API_ROUTES.inventory.perOutlet, {
      params: { outlet_id: outletId, ...params },
    })
    return data.data.data
  },
}
