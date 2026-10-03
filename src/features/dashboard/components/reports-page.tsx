'use client'

import React, { useState, useEffect } from 'react'
import { FiDownload, FiFilter, FiRefreshCw, FiTable } from 'react-icons/fi'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import { DateRangeFilter } from './date-range-filter'
import { useDashboardStore, selectDateRange } from '../stores/dashboard.store'
import {
  useTransactionReport,
  useSalesAggregateReport,
  useSuppliesReport,
  useReturnsReport,
  usePerformanceReport,
  exportTransactionReportToExcel,
  exportSalesAggregateReportToExcel,
  exportSuppliesReportToExcel,
  exportReturnsReportToExcel,
  exportPerformanceReportToExcel,
} from '../hooks/use-reports'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'

type ReportType = 'transactions' | 'sales-aggregate' | 'supplies' | 'returns' | 'performance'

const REPORT_TABS: Array<{ id: ReportType; label: string; description: string }> = [
  { id: 'transactions', label: 'Transactions', description: 'Transaction-level detail with pagination' },
  { id: 'sales-aggregate', label: 'Sales Aggregate', description: 'Aggregated by outlet and sales person' },
  { id: 'supplies', label: 'Supplies', description: 'Supply document records' },
  { id: 'returns', label: 'Returns', description: 'Return document records' },
  { id: 'performance', label: 'Performance', description: 'Comprehensive performance analysis' },
]

/**
 * Reports Page Component
 *
 * Complete reporting interface with:
 * - Multiple report types (Transactions, Sales, Supplies, Returns, Performance)
 * - Date range filtering
 * - Excel export
 * - Pagination for large datasets
 * - Field name updates for consistency
 *
 * Usage:
 * ```tsx
 * <ReportsPage />
 * ```
 */
export function ReportsPage(): React.ReactElement {
  const [reportType, setReportType] = useState<ReportType>('transactions')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [isExporting, setIsExporting] = useState(false)

  const dateRange = useDashboardStore(selectDateRange)
  const params = { ...dateRange, page, page_size: pageSize }

  // Fetch different reports based on selection
  const transactionsQuery = useTransactionReport(reportType === 'transactions' ? params : undefined)
  const salesAggregateQuery = useSalesAggregateReport(reportType === 'sales-aggregate' ? params : undefined)
  const suppliesQuery = useSuppliesReport(reportType === 'supplies' ? params : undefined)
  const returnsQuery = useReturnsReport(reportType === 'returns' ? params : undefined)
  const performanceQuery = usePerformanceReport(reportType === 'performance' ? params : undefined)

  const currentQuery =
    reportType === 'transactions'
      ? transactionsQuery
      : reportType === 'sales-aggregate'
        ? salesAggregateQuery
        : reportType === 'supplies'
          ? suppliesQuery
          : reportType === 'returns'
            ? returnsQuery
            : performanceQuery

  // Debug logging
  useEffect(() => {
    console.log('[ReportsPage] reportType:', reportType)
    console.log('[ReportsPage] currentQuery data:', currentQuery.data)
    console.log('[ReportsPage] currentQuery isLoading:', currentQuery.isPending)
    console.log('[ReportsPage] currentQuery error:', currentQuery.error)
  }, [reportType, currentQuery.data, currentQuery.isPending, currentQuery.error])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params_export = { ...dateRange }

      switch (reportType) {
        case 'transactions':
          await exportTransactionReportToExcel(params_export)
          break
        case 'sales-aggregate':
          await exportSalesAggregateReportToExcel(params_export)
          break
        case 'supplies':
          await exportSuppliesReportToExcel(params_export)
          break
        case 'returns':
          await exportReturnsReportToExcel(params_export)
          break
        case 'performance':
          await exportPerformanceReportToExcel(params_export)
          break
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 text-sm mt-1">
              Detailed reporting with date filtering and Excel export capabilities
            </p>
          </div>
          <DateRangeFilter />
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setReportType(tab.id)
              setPage(1)
            }}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium text-sm transition-all',
              reportType === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Description */}
      <div className="text-sm text-gray-600">
        {REPORT_TABS.find((t) => t.id === reportType)?.description}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {currentQuery.isPending ? (
            <>
              <Spinner className="h-4 w-4" />
              <span>Loading…</span>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => currentQuery.refetch()}
            disabled={currentQuery.isFetching}
            className="gap-2"
          >
            <FiRefreshCw className={`h-4 w-4 ${currentQuery.isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleExport}
            disabled={isExporting || !currentQuery.data}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <FiDownload className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Content */}
      {currentQuery.isPending ? (
        <div className="flex items-center justify-center h-64 gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading report…</p>
        </div>
      ) : currentQuery.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8">
          <h3 className="font-semibold text-destructive">Failed to load report</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {(currentQuery.error as any)?.message || 'Unable to fetch report data'}
          </p>
          <pre className="mt-4 text-xs bg-white p-3 rounded border overflow-auto max-h-40">
            {JSON.stringify(currentQuery.error, null, 2)}
          </pre>
        </div>
      ) : (
        <>
          {/* Transactions Report */}
          {reportType === 'transactions' && (
            <>
              {Array.isArray(currentQuery.data) && currentQuery.data.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Outlet</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Sales</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Qty</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Unit Price</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(currentQuery.data as any[]).map((record) => (
                      <tr key={record.transaction_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600 text-xs">{record.date}</td>
                        <td className="px-4 py-3 text-gray-900 font-medium truncate">
                          {record.outlet_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{record.sales_name}</td>
                        <td className="px-4 py-3 text-gray-600">{record.product_name}</td>
                        <td className="px-4 py-3">
                          <span
                            className={clsx(
                              'px-2 py-1 rounded text-xs font-medium',
                              record.transaction_type === 'SUPPLY'
                                ? 'bg-blue-100 text-blue-800'
                                : record.transaction_type === 'SALE'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800',
                            )}
                          >
                            {record.transaction_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">{formatNumber(record.quantity)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {formatCurrency(record.unit_price)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {formatCurrency(record.total_value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              ) : (
                <div className="text-center py-8 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="text-muted-foreground">No transaction data available for this date range</p>
                  {currentQuery.data === undefined && <p className="text-xs text-gray-500 mt-2">Data: undefined</p>}
                  {currentQuery.data === null && <p className="text-xs text-gray-500 mt-2">Data: null</p>}
                  {!Array.isArray(currentQuery.data) && <p className="text-xs text-gray-500 mt-2">Data is not an array: {typeof currentQuery.data}</p>}
                </div>
              )}
            </>
          )}

          {/* Sales Aggregate Report */}
          {reportType === 'sales-aggregate' && (
            <>
              {Array.isArray(currentQuery.data) && currentQuery.data.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Outlet</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Sales</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Supply</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Returned</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Sold</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Return Rate %</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Efficiency %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(currentQuery.data as any[]).map((record) => (
                      <tr key={`${record.outlet_id}-${record.sales_id}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium truncate">
                          {record.outlet_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{record.sales_name}</td>
                        <td className="px-4 py-3 text-right">{formatNumber(record.total_supply)}</td>
                        <td className="px-4 py-3 text-right text-red-600">
                          {formatNumber(record.total_returned)}
                        </td>
                        <td className="px-4 py-3 text-right">{formatNumber(record.total_sold)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                          {formatCurrency(record.total_revenue)}
                        </td>
                        <td className="px-4 py-3 text-right">{formatNumber(record.current_stock)}</td>
                        <td className={clsx(
                          'px-4 py-3 text-right font-semibold',
                          record.return_rate_percent <= 10 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {formatPercent(record.return_rate_percent)}
                        </td>
                        <td className={clsx(
                          'px-4 py-3 text-right font-semibold',
                          record.efficiency_percent >= 70 ? 'text-green-600' : 'text-orange-600'
                        )}>
                          {formatPercent(record.efficiency_percent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              ) : (
                <div className="text-center py-8 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="text-muted-foreground">No sales aggregate data available for this date range</p>
                </div>
              )}
            </>
          )}

          {/* Performance Report */}
          {reportType === 'performance' && currentQuery.data && 'store_performance' in (currentQuery.data as any) && (
            <div className="space-y-6">
              {/* Store Performance */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Store Performance</h3>
                <div className="rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Outlet</th>
                          <th className="px-4 py-3 text-left font-semibold">Area</th>
                          <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                          <th className="px-4 py-3 text-right font-semibold">Efficiency %</th>
                          <th className="px-4 py-3 text-right font-semibold">Return Rate %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {(currentQuery.data as any).store_performance?.map((store: any) => (
                          <tr key={store.outlet_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{store.outlet_name}</td>
                            <td className="px-4 py-3 text-gray-600">{store.sales_area}</td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600">
                              {formatCurrency(store.total_revenue)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                              {formatPercent(store.efficiency_percent)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                              {formatPercent(store.return_rate_percent)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Sales Performance */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sales Performance</h3>
                <div className="rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Sales Person</th>
                          <th className="px-4 py-3 text-right font-semibold">Outlets</th>
                          <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                          <th className="px-4 py-3 text-right font-semibold">Efficiency %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {  (currentQuery.data as any).sales_performance?.map((sales: any) => (
                          <tr key={sales.sales_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{sales.sales_name}</td>
                            <td className="px-4 py-3 text-right">{sales.outlet_count}</td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600">
                              {formatCurrency(sales.total_revenue)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                              {formatPercent(sales.efficiency_percent)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Empty State / Debug */}
          {!currentQuery.isPending && !currentQuery.error && (
            <>
              {!currentQuery.data ? (
                <div className="text-center py-8 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="text-muted-foreground">No data returned from API</p>
                  
                </div>
              ) : Array.isArray(currentQuery.data) && currentQuery.data.length === 0 ? (
                <div className="text-center py-8 rounded-lg border border-gray-200 bg-gray-50">
                  <p className="text-muted-foreground">No {reportType} records found for this date range</p>
                </div>
              ) : !Array.isArray(currentQuery.data) && !('store_performance' in (currentQuery.data as any)) ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
                  <p className="text-sm font-semibold text-yellow-800">Unexpected data structure</p>
                  <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                    {JSON.stringify(currentQuery.data, null, 2).substring(0, 500)}
                  </pre>
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  )
}
