import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import { env } from '@/config/env'
import type { ApiEnvelope } from '@/types/api'
import { mockCommissionsApi } from './commissions.mock'

export interface CommissionBreakdownItem {
  outlet_id: number
  outlet_name: string
  units: number
  revenue: number
}

export interface SalesPayout {
  sales_id: number
  sales_name?: string
  period?: string
  start_date?: string
  end_date?: string
  total_units: number
  total_revenue: number
  commission_rate?: number
  commission_amount?: number
  payout_amount?: number
  breakdown: CommissionBreakdownItem[]
}

const realCommissionsApi = {
  async getSalesPayout(salesId: number, params?: Record<string, unknown>): Promise<SalesPayout> {
    const { data } = await apiClient.get<ApiEnvelope<SalesPayout>>(API_ROUTES.commissions.salesPayout(salesId), {
      params,
    })
    return data.data
  },
}

export const commissionsApi = env.NEXT_PUBLIC_ENABLE_MOCK_AUTH ? mockCommissionsApi : realCommissionsApi

// types already exported via `export interface ...` above
