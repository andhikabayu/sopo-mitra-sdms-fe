'use client'

import React from 'react'
import { FiArrowUpRight, FiBarChart2, FiLoader } from 'react-icons/fi'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import { useDashboardOutlets } from '../hooks/use-dashboard'
import { useDashboardStore, selectDateRange } from '../stores/dashboard.store'
import { DateRangeFilter } from './date-range-filter'
import { PerformanceRank } from './performance-rank'
import { Spinner } from '@/components/ui/spinner'
import clsx from 'clsx'

/**
 * Updated Outlets List Component
 *
 * Displays outlets with:
 * - NEW field names (total_sold, total_returned, current_stock, efficiency_percent, return_rate_percent)
 * - Date range filtering
 * - Performance ranking
 * - Sorting by revenue
 *
 * Usage:
 * ```tsx
 * <UpdatedOutletsList />
 * ```
 */
export function UpdatedOutletsList(): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)
  const { data: outlets, isLoading, error } = useDashboardOutlets(dateRange)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading outlets…</p>
      </div>
    )
  }

  if (error || !outlets) {
    return (
      <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
        <h3 className="font-semibold text-destructive">Failed to load outlets</h3>
        <p className="mt-2 text-sm text-muted-foreground">Unable to fetch outlet data</p>
      </section>
    )
  }

  const outletRows = outlets.outlets ?? []

  // Sort by revenue descending
  const sortedOutlets = [...outletRows].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))

  // Top 5 outlets
  const topOutlets = sortedOutlets.slice(0, 5)

  return (
    <section aria-label="Outlets Analytics">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FiBarChart2 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Outlets ({outletRows.length} total)
          </h2>
        </div>
        <DateRangeFilter />
      </div>

      {/* Top 5 Outlets */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Top 5 by Revenue</h3>
        <div className="space-y-2">
          {topOutlets.map((outlet, index) => (
            <PerformanceRank
              key={outlet.outlet_id}
              rank={index + 1}
              name={outlet.outlet_name}
              value={formatCurrency(outlet.revenue || 0)}
              metricLabel="Revenue"
              size="sm"
              badge={
                <span className="text-xs font-medium text-gray-600">
                  {outlet.sales_area}
                </span>
              }
            />
          ))}
        </div>
      </div>

      {/* Full Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Outlet</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Area</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Sold</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Returned</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Efficiency %</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Return Rate %</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedOutlets.map((outlet, index) => (
                <tr key={outlet.outlet_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 truncate">
                    {outlet.outlet_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{outlet.sales_area}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    {formatCurrency(outlet.revenue || 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatNumber(outlet.sold || 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600">
                    {formatNumber(outlet.returned || 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatNumber(outlet.current_stock || 0)}
                  </td>
                  <td className={clsx(
                    'px-4 py-3 text-right font-semibold',
                    (outlet.efficiency_percent || 0) >= 70 ? 'text-green-600' : 'text-orange-600'
                  )}>
                    {formatPercent(outlet.efficiency_percent || 0)}
                  </td>
                  <td className={clsx(
                    'px-4 py-3 text-right font-semibold',
                    (outlet.return_rate_percent || 0) <= 10 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {formatPercent(outlet.return_rate_percent || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {outlet.rank_by_revenue ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                        {outlet.rank_by_revenue}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {outletRows.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No outlets found for the selected date range</p>
        </div>
      )}
    </section>
  )
}
