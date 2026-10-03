/**
 * TanStack Query hooks for Reports endpoints
 *
 * Includes:
 * - Transaction-level reports (transactions, sales-aggregate, supplies, returns, performance)
 * - KPI reports (products, outlets, sales, areas)
 * - Export functionality
 *
 * Usage:
 * ```tsx
 * const { data, isLoading } = useProductKPIReport({ page: 1, page_size: 50 })
 * ```
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { reportsApi } from '../api/reports.api'
import type {
  TransactionReport,
  SalesAggregateReport,
  SupplyReport,
  ReturnReport,
  PerformanceReport,
  ProductKPIReport,
  OutletKPIReport,
  SalesKPIReport,
  AreaKPIReport,
  ReportParams,
} from '../types/reports.types'

// ============================================================================
// TRANSACTION-LEVEL REPORTS
// ============================================================================

/**
 * Fetch transaction report with pagination and filtering
 * Stale time: 2 minutes
 */
export function useTransactionReport(
  params?: ReportParams,
): UseQueryResult<TransactionReport[]> {
  return useQuery({
    queryKey: ['reports', 'transactions', params],
    queryFn: () => reportsApi.getTransactionReport(params),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export transaction report to Excel
 */
export async function exportTransactionReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportTransactionReport(params)
  const filename = `transactions-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}

// ============================================================================
// SALES AGGREGATE REPORT
// ============================================================================

/**
 * Fetch sales aggregate report with pagination and filtering
 * Stale time: 2 minutes
 */
export function useSalesAggregateReport(
  params?: ReportParams,
): UseQueryResult<SalesAggregateReport[]> {
  return useQuery({
    queryKey: ['reports', 'sales-aggregate', params],
    queryFn: () => reportsApi.getSalesAggregateReport(params),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export sales aggregate report to Excel
 */
export async function exportSalesAggregateReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportSalesAggregateReport(params)
  const filename = `sales-aggregate-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}

// ============================================================================
// SUPPLIES REPORT
// ============================================================================

/**
 * Fetch supplies report with pagination and filtering
 * Stale time: 2 minutes
 */
export function useSuppliesReport(
  params?: ReportParams,
): UseQueryResult<SupplyReport[]> {
  return useQuery({
    queryKey: ['reports', 'supplies', params],
    queryFn: () => reportsApi.getSuppliesReport(params),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export supplies report to Excel
 */
export async function exportSuppliesReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportSuppliesReport(params)
  const filename = `supplies-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}

// ============================================================================
// RETURNS REPORT
// ============================================================================

/**
 * Fetch returns report with pagination and filtering
 * Stale time: 2 minutes
 */
export function useReturnsReport(
  params?: ReportParams,
): UseQueryResult<ReturnReport[]> {
  return useQuery({
    queryKey: ['reports', 'returns', params],
    queryFn: () => reportsApi.getReturnsReport(params),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export returns report to Excel
 */
export async function exportReturnsReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportReturnsReport(params)
  const filename = `returns-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}

// ============================================================================
// PERFORMANCE REPORT
// ============================================================================

/**
 * Fetch performance report (no pagination)
 * Stale time: 2 minutes
 */
export function usePerformanceReport(
  params?: ReportParams,
): UseQueryResult<PerformanceReport> {
  return useQuery({
    queryKey: ['reports', 'performance', params],
    queryFn: () => reportsApi.getPerformanceReport(params),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export performance report to Excel (2-sheet workbook)
 */
export async function exportPerformanceReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportPerformanceReport(params)
  const filename = `performance-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}

// ============================================================================
// KPI REPORTS
// ============================================================================

/**
 * Fetch Product KPI Report
 * Stale time: 3 minutes
 */
export function useProductKPIReport(
  params?: ReportParams,
): UseQueryResult<ProductKPIReport[]> {
  return useQuery({
    queryKey: ['reports', 'kpi-product', params],
    queryFn: () => reportsApi.getProductKPIReport(params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export Product KPI to Excel
 */
export async function exportProductKPIReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportProductKPIReport(params)
  const filename = `product-kpi-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}

/**
 * Fetch Outlet KPI Report
 * Stale time: 3 minutes
 */
export function useOutletKPIReport(
  params?: ReportParams,
): UseQueryResult<OutletKPIReport[]> {
  return useQuery({
    queryKey: ['reports', 'kpi-outlet', params],
    queryFn: () => reportsApi.getOutletKPIReport(params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export Outlet KPI to Excel
 */
export async function exportOutletKPIReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportOutletKPIReport(params)
  const filename = `outlet-kpi-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}

/**
 * Fetch Sales KPI Report
 * Stale time: 3 minutes
 */
export function useSalesKPIReport(
  params?: ReportParams,
): UseQueryResult<SalesKPIReport[]> {
  return useQuery({
    queryKey: ['reports', 'kpi-sales', params],
    queryFn: () => reportsApi.getSalesKPIReport(params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export Sales KPI to Excel
 */
export async function exportSalesKPIReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportSalesKPIReport(params)
  const filename = `sales-kpi-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}

/**
 * Fetch Area KPI Report
 * Stale time: 3 minutes
 */
export function useAreaKPIReport(
  params?: ReportParams,
): UseQueryResult<AreaKPIReport[]> {
  return useQuery({
    queryKey: ['reports', 'kpi-area', params],
    queryFn: () => reportsApi.getAreaKPIReport(params),
    staleTime: 3 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Export Area KPI to Excel
 */
export async function exportAreaKPIReportToExcel(
  params?: Omit<ReportParams, 'export'>,
): Promise<void> {
  const blob = await reportsApi.exportAreaKPIReport(params)
  const filename = `area-kpi-${new Date().toISOString().split('T')[0]}.xlsx`
  reportsApi.downloadFile(blob, filename)
}
