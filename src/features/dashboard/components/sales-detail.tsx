'use client'

import React from 'react'
import { FiArrowLeft, FiUser, FiMapPin } from 'react-icons/fi'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { MetricCard } from './metric-card'
import { PerformanceRank } from './performance-rank'
import { useDashboardSalesDetail } from '../hooks/use-dashboard'
import { useDashboardStore, selectDateRange } from '../stores/dashboard.store'
import clsx from 'clsx'

interface SalesDetailProps {
  /** Sales person ID (required; API will not call if undefined/null) */
  salesId: number
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * Sales Detail Component
 *
 * Displays detailed analytics for a single sales person including:
 * - Key metrics (revenue, sold items, stock, supply)
 * - Performance indicators (efficiency, return rate, avg revenue per outlet)
 * - Top outlets ranking by revenue
 * - Outlets breakdown table with product performance
 *
 * ⚠️ IMPORTANT: Only pass a valid salesId
 * - When salesId is undefined/null, the hook will NOT call the API
 * - Always verify salesId has been selected from dropdown before rendering this component
 *
 * Usage:
 * ```tsx
 * const [selectedId, setSelectedId] = useState<number | null>(null)
 *
 * // ✅ CORRECT: Only render when selection is made
 * {selectedId && <SalesDetail salesId={selectedId} onBack={() => setSelectedId(null)} />}
 *
 * // ❌ WRONG: Will not call API
 * {<SalesDetail salesId={selectedId || 0} />}
 * ```
 */
export function SalesDetail({ salesId, onBack }: SalesDetailProps): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)
  // ✅ Hook only fetches data when salesId is valid (truthy)
  const { data, isLoading, error, refetch } = useDashboardSalesDetail(salesId, dateRange)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-muted-foreground">Loading sales details…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8">
        <h3 className="font-semibold text-destructive">Failed to load sales details</h3>
        <p className="mt-2 text-sm text-muted-foreground">Unable to fetch data for this sales person</p>
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

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available for this sales person</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
        </div>

        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <FiUser className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{data.sales_name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                    <FiMapPin className="h-4 w-4" />
                    <span>{data.outlets_count} outlets</span>
                  </div>
                </div>
              </div>
            </div>
            {data.rank_by_revenue && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Performance Rank</p>
                <p className="text-2xl font-bold text-blue-600">#{data.rank_by_revenue}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Revenue"
            value={formatCurrency(data.total_revenue)}
            icon="💰"
          />
          <MetricCard
            label="Total Sold"
            value={formatNumber(data.total_sold)}
            unit="units"
            icon="📦"
          />
          <MetricCard
            label="Current Stock"
            value={formatNumber(data.current_stock)}
            unit="units"
            icon="🏭"
          />
          <MetricCard
            label="Total Supply"
            value={formatNumber(data.total_supply)}
            unit="units"
            icon="🚚"
          />
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label="Efficiency Rate"
            value={formatPercent(data.efficiency_percent)}
            icon="⚡"
            change={
              data.efficiency_percent >= 70
                ? { value: '✓ Excellent', isPositive: true }
                : data.efficiency_percent >= 50
                  ? { value: '↗ Good', isPositive: true }
                  : { value: '↘ Needs improvement', isPositive: false }
            }
          />
          <MetricCard
            label="Return Rate"
            value={formatPercent(data.return_rate_percent)}
            icon="🔄"
            change={
              data.return_rate_percent <= 10
                ? { value: '✓ Low', isPositive: true }
                : data.return_rate_percent <= 20
                  ? { value: '⚠ Moderate', isPositive: false }
                  : { value: '↗ High', isPositive: false }
            }
          />
          <MetricCard
            label="Total Returned"
            value={formatNumber(data.total_returned)}
            unit="units"
            icon="📉"
          />
        </div>
      </section>

      {/* Top Outlets */}
      {data.top_outlets && data.top_outlets.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Top Outlets (by Revenue)</h2>
          <div className="space-y-2">
            {data.top_outlets.slice(0, 5).map((outlet, index) => (
              <PerformanceRank
                key={outlet.outlet_id}
                rank={index + 1}
                name={outlet.outlet_name}
                value={formatCurrency(outlet.outlet_revenue)}
                metricLabel="Revenue"
                size="md"
              />
            ))}
          </div>
        </section>
      )}

      {/* Outlets Breakdown Table */}
      {data.outlets_breakdown && data.outlets_breakdown.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Outlets Breakdown</h2>
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Outlet</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Area</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Sold</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Returned</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Stock</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Efficiency %</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Return Rate %</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.outlets_breakdown.map((outlet) => (
                    <tr key={outlet.outlet_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium truncate">
                        {outlet.outlet_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{outlet.sales_area}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(outlet.total_sold)}</td>
                      <td className="px-4 py-3 text-right text-red-600">
                        {formatNumber(outlet.total_returned)}
                      </td>
                      <td className="px-4 py-3 text-right">{formatNumber(outlet.current_stock)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">
                        {formatCurrency(outlet.total_revenue)}
                      </td>
                      <td className={clsx(
                        'px-4 py-3 text-right font-semibold',
                        outlet.efficiency_percent >= 70 ? 'text-green-600' : outlet.efficiency_percent >= 50 ? 'text-orange-600' : 'text-red-600'
                      )}>
                        {formatPercent(outlet.efficiency_percent)}
                      </td>
                      <td className={clsx(
                        'px-4 py-3 text-right font-semibold',
                        outlet.return_rate_percent <= 10 ? 'text-green-600' : outlet.return_rate_percent <= 20 ? 'text-orange-600' : 'text-red-600'
                      )}>
                        {formatPercent(outlet.return_rate_percent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!data.outlets_breakdown || data.outlets_breakdown.length === 0) && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No outlets data available for this sales person</p>
        </div>
      )}
    </div>
  )
}
