'use client'

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { parseApiError } from '@/lib/api/error'
import { dashboardApi } from '../api/dashboard.api'
import type {
  DashboardOutletsResponse,
  DashboardProductsResponse,
  DashboardSalesResponse,
  DashboardAreasResponse,
  DateRangeParams,
  OutletDetailResponse,
  SalesDetailResponse,
  RevenueTrendResponse,
  DashboardSummary,
} from '../types/dashboard.types'

export const dashboardQueryKey = ['dashboard'] as const

// ============================================================================
// Individual query hooks - all required APIs
// ============================================================================

/**
 * Fetch overall KPI summary (no date filtering)
 * Stale time: 5 minutes (longer since this is overall summary)
 */
export function useDashboardSummary(): UseQueryResult<DashboardSummary> {
  return useQuery({
    queryKey: [...dashboardQueryKey, 'summary'],
    queryFn: () => dashboardApi.getSummary(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
    meta: { parseError: parseApiError },
  })
}

/**
 * Fetch outlets with optional date range
 * Stale time: 3 minutes
 */
export function useDashboardOutlets(
  params?: DateRangeParams,
): UseQueryResult<DashboardOutletsResponse> {
  return useQuery({
    queryKey: ['dashboard', 'outlets', params],
    queryFn: () => dashboardApi.getOutlets(params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch products with optional date range
 * Stale time: 3 minutes
 */
export function useDashboardProducts(
  params?: DateRangeParams,
): UseQueryResult<DashboardProductsResponse> {
  return useQuery({
    queryKey: ['dashboard', 'products', params],
    queryFn: () => dashboardApi.getProducts(params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch sales people with optional date range
 * Stale time: 3 minutes
 */
export function useDashboardSales(
  params?: DateRangeParams,
): UseQueryResult<DashboardSalesResponse> {
  return useQuery({
    queryKey: ['dashboard', 'sales', params],
    queryFn: () => dashboardApi.getSales(params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch areas with optional date range
 * Stale time: 3 minutes
 */
export function useDashboardAreas(
  params?: DateRangeParams,
): UseQueryResult<DashboardAreasResponse> {
  return useQuery({
    queryKey: ['dashboard', 'areas', params],
    queryFn: () => dashboardApi.getAreas(params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Fetch single outlet detail with product breakdown
 *
 * ⚠️ IMPORTANT: API is ONLY called when outletId is provided (not null/undefined)
 * - Prevents errors from API calls with missing outlet_id
 * - Use this hook only AFTER user selects an outlet from dropdown
 *
 * @param outletId - Outlet ID (optional; API only calls when provided)
 * @param params - Date range parameters
 *
 * Stale time: 3 minutes
 * Enabled only when outletId is provided
 *
 * @example
 * ```tsx
 * const [selectedOutletId, setSelectedOutletId] = useState<number | null>(null)
 * const { data } = useDashboardOutletDetail(selectedOutletId) // API won't call if null
 *
 * // Only render detail when selection is made
 * {selectedOutletId ? <DetailComponent /> : <ListComponent />}
 * ```
 */
export function useDashboardOutletDetail(
  outletId?: number,
  params?: DateRangeParams,
): UseQueryResult<OutletDetailResponse> {
  return useQuery({
    queryKey: ['dashboard', 'outlet-detail', outletId, params],
    queryFn: () => dashboardApi.getOutletDetail(outletId!, params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
    enabled: !!outletId, // ✅ API only calls when outletId is truthy
  })
}

/**
 * Fetch single sales person detail with outlet breakdown
 *
 * ⚠️ IMPORTANT: API is ONLY called when salesId is provided (not null/undefined)
 * - Prevents errors from API calls with missing sales_id
 * - Use this hook only AFTER user selects a sales person from dropdown
 *
 * @param salesId - Sales person ID (optional; API only calls when provided)
 * @param params - Date range parameters
 *
 * Stale time: 3 minutes
 * Enabled only when salesId is provided
 *
 * @example
 * ```tsx
 * const [selectedSalesId, setSelectedSalesId] = useState<number | null>(null)
 * const { data } = useDashboardSalesDetail(selectedSalesId) // API won't call if null
 *
 * // Only render detail when selection is made
 * {selectedSalesId ? <DetailComponent /> : <ListComponent />}
 * ```
 */
export function useDashboardSalesDetail(
  salesId?: number,
  params?: DateRangeParams,
): UseQueryResult<SalesDetailResponse> {
  return useQuery({
    queryKey: ['dashboard', 'sales-detail', salesId, params],
    queryFn: () => dashboardApi.getSalesDetail(salesId!, params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
    enabled: !!salesId, // ✅ API only calls when salesId is truthy
  })
}

/**
 * Fetch revenue trend data for charting
 * Supports daily/monthly/yearly periods
 * Supports outlets or sales entity type
 * Stale time: 2 minutes
 */
export function useDashboardRevenueTrend(
  query?: Record<string, unknown>,
): UseQueryResult<RevenueTrendResponse> {
  return useQuery({
    queryKey: ['dashboard', 'revenue-trend', query],
    queryFn: () => dashboardApi.getRevenueTrend(query),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}
