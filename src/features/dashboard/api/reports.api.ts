import { apiClient } from '@/lib/api/axios'
import type {
  TransactionReport,
  SalesAggregateReport,
  SupplyReport,
  ReturnReport,
  PerformanceReport,
  ReportParams,
} from '../types/reports.types'
import type { ApiEnvelope } from '@/types/api'

export const reportsApi = {
  /**
   * GET /reports/transactions — Transaction-level report with pagination
   */
  async getTransactionReport(params?: ReportParams): Promise<TransactionReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<TransactionReport[]>>(
      '/reports/transactions',
      { params },
    )
    console.log('[reportsApi] getTransactionReport response:', data)
    const result = Array.isArray(data.data) ? data.data : []
    console.log('[reportsApi] getTransactionReport returning:', result)
    return result
  },

  /**
   * GET /reports/sales — Sales aggregate report by outlet and sales
   */
  async getSalesAggregateReport(params?: ReportParams): Promise<SalesAggregateReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<SalesAggregateReport[]>>(
      '/reports/sales',
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
    const { data } = await apiClient.get<ApiEnvelope<SupplyReport[]>>(
      '/reports/supplies',
      { params },
    )
    console.log('[reportsApi] getSuppliesReport response:', data)
    const result = Array.isArray(data.data) ? data.data : []
    console.log('[reportsApi] getSuppliesReport returning:', result)
    return result
  },

  /**
   * GET /reports/returns — Return document report
   */
  async getReturnsReport(params?: ReportParams): Promise<ReturnReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<ReturnReport[]>>(
      '/reports/returns',
      { params },
    )
    console.log('[reportsApi] getReturnsReport response:', data)
    const result = Array.isArray(data.data) ? data.data : []
    console.log('[reportsApi] getReturnsReport returning:', result)
    return result
  },

  /**
   * GET /reports/performance — Comprehensive performance analysis
   * NOTE: This endpoint does NOT support pagination
   */
  async getPerformanceReport(params?: ReportParams): Promise<PerformanceReport> {
    const { data } = await apiClient.get<ApiEnvelope<PerformanceReport>>(
      '/reports/performance',
      { params },
    )
    console.log('[reportsApi] getPerformanceReport response:', data)
    const result = data.data || { store_performance: [], sales_performance: [] }
    console.log('[reportsApi] getPerformanceReport returning:', result)
    return result
  },

  /**
   * Export transaction report to Excel
   * GET /reports/transactions?export=excel
   */
  async exportTransactionReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get('/reports/transactions', {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export sales aggregate report to Excel
   */
  async exportSalesAggregateReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get('/reports/sales', {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export supplies report to Excel
   */
  async exportSuppliesReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get('/reports/supplies', {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export returns report to Excel
   */
  async exportReturnsReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get('/reports/returns', {
      params: { ...params, export: 'excel' },
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Export performance report to Excel (2-sheet workbook)
   */
  async exportPerformanceReport(params?: Omit<ReportParams, 'export'>): Promise<Blob> {
    const response = await apiClient.get('/reports/performance', {
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
