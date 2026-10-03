import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import type { SalesPayout } from '@/features/commissions/api/commissions.api'

export const dashboardSalesApi = {
  async getMyPayout(salesId: number, params?: Record<string, unknown>): Promise<SalesPayout> {
    const { data } = await apiClient.get(API_ROUTES.commissions.salesPayout(salesId), { params })
    return data.data as SalesPayout
  },
}
