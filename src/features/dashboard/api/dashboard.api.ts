import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import type { ApiEnvelope } from '@/types/api'
import type {
  DashboardOutletsResponse,
  DashboardProductsResponse,
  DashboardSalesResponse,
  DashboardAreasResponse,
  DashboardSummary,
  DateRangeParams,
  OutletDetailResponse,
  SalesDetailResponse,
  RevenueTrendResponse,
} from '../types/dashboard.types'

export interface TimeSeriesPoint {
  date: string
  series: { name: string; value: number }[]
}

export const dashboardApi = {
  // =========================================================================
  // TIER 1: Summary
  // =========================================================================

  async getSummary(): Promise<DashboardSummary> {
    const { data } = await apiClient.get<ApiEnvelope<DashboardSummary>>(API_ROUTES.dashboard.summary)
    return data.data
  },

  // =========================================================================
  // TIER 2: List/Analytics (with optional date filtering)
  // =========================================================================

  async getOutlets(params?: DateRangeParams): Promise<DashboardOutletsResponse> {
    const { data } = await apiClient.get<ApiEnvelope<DashboardOutletsResponse>>(
      API_ROUTES.dashboard.outlets,
      { params },
    )
    return data.data
  },

  async getProducts(params?: DateRangeParams): Promise<DashboardProductsResponse> {
    const { data } = await apiClient.get<ApiEnvelope<DashboardProductsResponse>>(
      API_ROUTES.dashboard.products,
      { params },
    )
    console.log('[dashboardApi] getProducts response:', data)
    const result = data.data || { products: [], best_seller: [], slow_moving: [] }
    console.log('[dashboardApi] getProducts returning:', result)
    return result
  },

  async getSales(params?: DateRangeParams): Promise<DashboardSalesResponse> {
    const { data } = await apiClient.get<ApiEnvelope<DashboardSalesResponse>>(
      API_ROUTES.dashboard.sales,
      { params },
    )
    return data.data
  },

  async getAreas(params?: DateRangeParams): Promise<DashboardAreasResponse> {
    const { data } = await apiClient.get<ApiEnvelope<DashboardAreasResponse>>(
      API_ROUTES.dashboard.areas,
      { params },
    )
    return data.data
  },

  // =========================================================================
  // TIER 3: Detail/Performance (NEW - requires ID, with date filtering)
  // =========================================================================

  async getOutletDetail(
    outletId: number,
    params?: DateRangeParams,
  ): Promise<OutletDetailResponse> {
    const { data } = await apiClient.get<ApiEnvelope<OutletDetailResponse>>(
      API_ROUTES.dashboard.outletDetail(outletId),
      { params },
    )
    return data.data
  },

  async getSalesDetail(
    salesId: number,
    params?: DateRangeParams,
  ): Promise<SalesDetailResponse> {
    const { data } = await apiClient.get<ApiEnvelope<SalesDetailResponse>>(
      API_ROUTES.dashboard.salesDetail(salesId),
      { params },
    )
    return data.data
  },

  // =========================================================================
  // TIER 4: Analytics/Trends
  // =========================================================================

  async getRevenueTrend(query?: Record<string, unknown>): Promise<RevenueTrendResponse> {
    const { data } = await apiClient.get<ApiEnvelope<RevenueTrendResponse>>(
      API_ROUTES.dashboard.analyticsRevenueTrend,
      { params: query },
    )
    return data.data
  },
}
