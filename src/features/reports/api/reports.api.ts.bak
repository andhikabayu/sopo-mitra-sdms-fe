/**
 * Reports API Service
 *
 * Handles all report endpoints:
 * - Transaction-level reports (transactions, sales-aggregate, supplies, returns, performance)
 * - KPI reports (products, outlets, sales, areas)
 */

/* eslint-disable no-console */

import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import type { ApiEnvelope } from '@/types/api'
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

export const reportsApi = {
  // =========================================================================
  // TRANSACTION-LEVEL REPORTS
  // =========================================================================

  /**
   * GET /reports/transactions — Transaction-level report with pagination
   */
  async getTransactionReport(params?: ReportParams): Promise<TransactionReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<TransactionReport[] | { transactions: TransactionReport[], data: TransactionReport[], items: TransactionReport[] }>>(
      API_ROUTES.reports.transactions,
      { params },
    )
    console.log('[reportsApi] getTransactionReport full response:', data)
    console.log('[reportsApi] getTransactionReport data.data:', data.data)
    console.log('[reportsApi] getTransactionReport data.data type:', typeof data.data)

    // Handle various response formats
    let result: TransactionReport[] = []
    if (Array.isArray(data.data)) {
      result = data.data
    } else if (data.data && typeof data.data === 'object') {
      // Check if it's wrapped in a property like { transactions: [...] }
      const dataObj = data.data as Record<string, TransactionReport[] | unknown>
      if (Array.isArray(dataObj.transactions)) {
        result = dataObj.transactions
      } else if (Array.isArray(dataObj.data)) {
        result = dataObj.data
      } else if (Array.isArray(dataObj.items)) {
        result = dataObj.items
      }
    }

    console.log('[reportsApi] getTransactionReport final result count:', result.length)
    if (result.length > 0) {
      console.log('[reportsApi] getTransactionReport first row:', result[0])
    }
    return result
  },

  /**
   * GET /reports/sales — Sales aggregate report by outlet and sales
   */
  async getSalesAggregateReport(params?: ReportParams): Promise<SalesAggregateReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<SalesAggregateReport[]>>(
      API_ROUTES.reports.salesAggregate,
      { params },
    )
    console.log('[reportsApi] getSalesAggregateReport response:', data)
    const result = Array.isArray(data.data) ? data.data : []
    console.log('[reportsApi] getSalesAggregateReport returning:', result)
    return result
  },

  /**
   * GET /reports/supplies — Supply document report
   */
  async getSuppliesReport(params?: ReportParams): Promise<SupplyReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<SupplyReport[] | { supplies: SupplyReport[], data: SupplyReport[], items: SupplyReport[] }>>(
      API_ROUTES.reports.supplies,
      { params },
    )
    console.log('[reportsApi] getSuppliesReport full response:', data)
    console.log('[reportsApi] getSuppliesReport data.data:', data.data)
    console.log('[reportsApi] getSuppliesReport data.data type:', typeof data.data)

    // Handle various response formats
    let result: SupplyReport[] = []
    if (Array.isArray(data.data)) {
      result = data.data
    } else if (data.data && typeof data.data === 'object') {
      // Check if it's wrapped in a property like { supplies: [...] }
      const dataObj = data.data as Record<string, SupplyReport[] | unknown>
      if (Array.isArray(dataObj.supplies)) {
        result = dataObj.supplies
      } else if (Array.isArray(dataObj.data)) {
        result = dataObj.data
      } else if (Array.isArray(dataObj.items)) {
        result = dataObj.items
      }
    }

    console.log('[reportsApi] getSuppliesReport final result count:', result.length)
    if (result.length > 0) {
      console.log('[reportsApi] getSuppliesReport first row:', result[0])
    }
    return result
  },

  /**
   * GET /reports/returns — Return document report
   */
  async getReturnsReport(params?: ReportParams): Promise<ReturnReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<ReturnReport[] | { returns: ReturnReport[], data: ReturnReport[], items: ReturnReport[] }>>(
      API_ROUTES.reports.returns,
      { params },
    )
    console.log('[reportsApi] getReturnsReport full response:', data)
    console.log('[reportsApi] getReturnsReport data.data:', data.data)
    console.log('[reportsApi] getReturnsReport data.data type:', typeof data.data)

    // Handle various response formats
    let result: ReturnReport[] = []
    if (Array.isArray(data.data)) {
      result = data.data
    } else if (data.data && typeof data.data === 'object') {
      // Check if it's wrapped in a property like { returns: [...] }
      const dataObj = data.data as Record<string, ReturnReport[] | unknown>
      if (Array.isArray(dataObj.returns)) {
        result = dataObj.returns
      } else if (Array.isArray(dataObj.data)) {
        result = dataObj.data
      } else if (Array.isArray(dataObj.items)) {
        result = dataObj.items
      }
    }

    console.log('[reportsApi] getReturnsReport final result count:', result.length)
    if (result.length > 0) {
      console.log('[reportsApi] getReturnsReport first row:', result[0])
    }
    return result
  },

  /**
   * GET /reports/performance — Comprehensive performance analysis
   * NOTE: This endpoint does NOT support pagination
   */
  async getPerformanceReport(params?: ReportParams): Promise<PerformanceReport> {
    const { data } = await apiClient.get<ApiEnvelope<PerformanceReport>>(
      API_ROUTES.reports.performance,
      { params },
    )
    console.log('[reportsApi] getPerformanceReport response:', data)
    const result = data.data || { store_performance: [], sales_performance: [] }
    console.log('[reportsApi] getPerformanceReport returning:', result)
    return result
  },

  // =========================================================================
  // KPI REPORTS (reusing dashboard endpoints)
  // =========================================================================

  /**
   * GET /reports/products → Products KPI Report
   * Returns product performance metrics
   */
  async getProductKPIReport(params?: ReportParams): Promise<ProductKPIReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<ProductKPIReport[] | { products: ProductKPIReport[] }>>(
      API_ROUTES.reports.kpiProducts,
      { params },
    )
    console.log('[reportsApi] getProductKPIReport response:', data)
    // Handle both direct array and {products: [...]} structure
    let result: ProductKPIReport[] = []
    if (Array.isArray(data.data)) {
      result = data.data
    } else if (data.data && typeof data.data === 'object' && 'products' in data.data) {
      const dataWithProducts = data.data as { products: ProductKPIReport[] }
      if (Array.isArray(dataWithProducts.products)) {
        result = dataWithProducts.products
      }
    }
    console.log('[reportsApi] getProductKPIReport returning:', result)
    return result
  },

  /**
   * GET /reports/performance → Outlets KPI Report
   * Returns outlet performance metrics from performance endpoint
   */
  async getOutletKPIReport(params?: ReportParams): Promise<OutletKPIReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<PerformanceReport>>(
      API_ROUTES.reports.performance,
      { params },
    )
    console.log('[reportsApi] getOutletKPIReport response:', data)
    // Extract outlet data from performance report
    const performanceData = data.data || { store_performance: [], sales_performance: [] }
    const result = Array.isArray(performanceData.store_performance) ? performanceData.store_performance : []
    console.log('[reportsApi] getOutletKPIReport returning:', result)
    return result
  },

  /**
   * GET /reports/performance → Sales KPI Report
   * Returns sales person performance metrics from performance endpoint
   */
  async getSalesKPIReport(params?: ReportParams): Promise<SalesKPIReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<PerformanceReport>>(
      API_ROUTES.reports.performance,
      { params },
    )
    console.log('[reportsApi] getSalesKPIReport response:', data)
    // Extract sales data from performance report
    const performanceData = data.data || { sales_performance: [] }
    const result = Array.isArray(performanceData.sales_performance) ? performanceData.sales_performance : []
    console.log('[reportsApi] getSalesKPIReport returning:', result)
    return result
  },

  /**
   * GET /reports/areas → Areas KPI Report
   * Returns area performance metrics
   */
  async getAreaKPIReport(params?: ReportParams): Promise<AreaKPIReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<AreaKPIReport[]>>(
      API_ROUTES.reports.kpiAreas,
      { params },
    )
    console.log('[reportsApi] getAreaKPIReport response:', data)
    const result = Array.isArray(data.data) ? data.data : []
    console.log('[reportsApi] getAreaKPIReport returning:', result)
    return result
  },

  // =========================================================================
  // EXPORT FUNCTIONS
  // =========================================================================

  /**
   * Export transaction report to Excel
   * GET /reports/transactions?export=excel
   */
  async exportTransactionReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.transactions, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export sales aggregate report to Excel
   */
  async exportSalesAggregateReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.salesAggregate, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export supplies report to Excel
   */
  async exportSuppliesReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.supplies, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export returns report to Excel
   */
  async exportReturnsReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.returns, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export performance report to Excel (2-sheet workbook)
   */
  async exportPerformanceReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.performance, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export Product KPI to Excel
   */
  async exportProductKPIReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.kpiProducts, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export Outlet KPI to Excel (from performance endpoint)
   */
  async exportOutletKPIReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.performance, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export Sales KPI to Excel
   */
  async exportSalesKPIReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.kpiSales, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export Area KPI to Excel
   */
  async exportAreaKPIReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get(API_ROUTES.reports.kpiAreas, {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Helper function to trigger browser download
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}
