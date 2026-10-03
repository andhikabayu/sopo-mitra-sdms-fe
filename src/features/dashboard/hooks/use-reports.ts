/**
 * TanStack Query hooks for Reports endpoints
 *
 * Features:
 * - Support for pagination
 * - Support for date filtering
 * - Support for entity filtering (outlet, sales, product)
 * - Excel export functionality
 *
 * Usage:
 * ```tsx
 * const { data, isLoading } = useTransactionReport({ page: 1, page_size: 50 })
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
  ReportParams,
} from '../types/reports.types'

// ============================================================================
// Transaction Report
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
// Sales Aggregate Report
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
// Supplies Report
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
// Returns Report
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
// Performance Report
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
