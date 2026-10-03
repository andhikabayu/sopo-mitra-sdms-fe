'use client'

import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { DateRangeFilter } from './date-range-filter'
import { PerformanceRank } from './performance-rank'
import { useDashboardSales } from '../hooks/use-dashboard'
import { useDashboardStore, selectDateRange } from '../stores/dashboard.store'
import clsx from 'clsx'

interface UpdatedSalesListProps {
  onSelectSales?: (salesId: number) => void
}

/**
 * Updated Sales List Component
 *
 * Displays all sales people with:
 * - Date range filtering via DateRangeFilter
 * - Top 5 sales by revenue with ranking
 * - Full table with all sales metrics
 * - Conditional styling based on performance
 * - New field names (total_sold, efficiency_percent, return_rate_percent, etc.)
 *
 * Usage:
 * ```tsx
 * <UpdatedSalesList onSelectSales={(id) => console.log(id)} />
 * ```
 */
export function UpdatedSalesList({ onSelectSales }: UpdatedSalesListProps): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)
  const { data, isLoading, error, refetch } = useDashboardSales(dateRange)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-muted-foreground">Loading sales data…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8">
        <h3 className="font-semibold text-destructive">Failed to load sales data</h3>
        <p className="mt-2 text-sm text-muted-foreground">Unable to fetch sales analytics</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No sales data available</p>
      </div>
    )
  }

  // Sort by revenue descending
  const sortedData = [...data].sort((a, b) => b.total_revenue - a.total_revenue)
  const topSales = sortedData.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-semibold text-gray-900">Sales Performance Analytics</h2>
        <DateRangeFilter />
      </div>

      {/* Top 5 Sales */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Top 5 Sales (by Revenue)</h3>
        <div className="space-y-2">
          {topSales.map((sales, index) => (
            <div
              key={sales.sales_id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-200 cursor-pointer transition-colors"
              onClick={() => onSelectSales?.(sales.sales_id)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <PerformanceRank
                  rank={index + 1}
                  name={sales.sales_name}
                  value={formatCurrency(sales.total_revenue)}
                  metricLabel="Revenue"
                  size="sm"
                />
              </div>
              <FiArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Full Sales Table */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">All Sales ({data.length})</h3>
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Sales Name</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Outlets</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Sold</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Returned</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Stock</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Efficiency %</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Return Rate %</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedData.map((sales) => (
                  <tr key={sales.sales_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium truncate">
                      {sales.sales_name}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {sales.outlets_count || 0}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      {formatCurrency(sales.total_revenue)}
                    </td>
                    <td className="px-4 py-3 text-right">{formatNumber(sales.total_sold)}</td>
                    <td className="px-4 py-3 text-right text-red-600">
                      {formatNumber(sales.total_returned)}
                    </td>
                    <td className="px-4 py-3 text-right">{formatNumber(sales.current_stock)}</td>
                    <td className={clsx(
                      'px-4 py-3 text-right font-semibold',
                      sales.efficiency_percent >= 70 ? 'text-green-600' : sales.efficiency_percent >= 50 ? 'text-orange-600' : 'text-red-600'
                    )}>
                      {formatPercent(sales.efficiency_percent)}
                    </td>
                    <td className={clsx(
                      'px-4 py-3 text-right font-semibold',
                      sales.return_rate_percent <= 10 ? 'text-green-600' : sales.return_rate_percent <= 20 ? 'text-orange-600' : 'text-red-600'
                    )}>
                      {formatPercent(sales.return_rate_percent)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectSales?.(sales.sales_id)
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
