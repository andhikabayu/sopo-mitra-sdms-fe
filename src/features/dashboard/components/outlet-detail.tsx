'use client'

import React from 'react'
import { FiArrowLeft, FiMapPin, FiPackage } from 'react-icons/fi'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import { useDashboardOutletDetail } from '../hooks/use-dashboard'
import { useDashboardStore, selectDateRange } from '../stores/dashboard.store'
import { DateRangeFilter } from './date-range-filter'
import { MetricCard } from './metric-card'
import { PerformanceRank } from './performance-rank'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'

interface OutletDetailProps {
  /** Outlet ID (required; API will not call if undefined/null) */
  outletId: number
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * Outlet Detail Component
 *
 * Shows detailed performance for a single outlet including:
 * - Key metrics with new field names
 * - Product breakdown table
 * - Top products list
 * - Date range filtering
 *
 * ⚠️ IMPORTANT: Only pass a valid outletId
 * - When outletId is undefined/null, the hook will NOT call the API
 * - Always verify outletId has been selected from dropdown before rendering this component
 *
 * Usage:
 * ```tsx
 * const [selectedId, setSelectedId] = useState<number | null>(null)
 *
 * // ✅ CORRECT: Only render when selection is made
 * {selectedId && <OutletDetail outletId={selectedId} onBack={() => setSelectedId(null)} />}
 *
 * // ❌ WRONG: Will not call API
 * {<OutletDetail outletId={selectedId || 0} />}
 * ```
 */
export function OutletDetail({ outletId, onBack }: OutletDetailProps): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)
  // ✅ Hook only fetches data when outletId is valid (truthy)
  const { data: detail, isLoading, error } = useDashboardOutletDetail(outletId, dateRange)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading outlet detail…</p>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
        <h3 className="font-semibold text-destructive">Failed to load outlet detail</h3>
        <p className="mt-2 text-sm text-muted-foreground">Unable to fetch outlet information</p>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-start justify-between mb-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <FiArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <DateRangeFilter />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{detail.outlet_name}</h1>
        <div className="flex items-center gap-2 mt-2 text-gray-600">
          <FiMapPin className="h-4 w-4" />
          <span>{detail.sales_area}</span>
        </div>

        {detail.rank_by_revenue && (
          <div className="mt-3 inline-block">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Rank #{detail.rank_by_revenue}
            </span>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4">
          Period: {detail.date_from} to {detail.date_to}
        </p>
      </div>

      {/* Key Metrics */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Revenue"
            value={formatCurrency(detail.total_revenue)}
            icon="💰"
          />
          <MetricCard
            label="Total Sold"
            value={formatNumber(detail.total_sold)}
            icon="📦"
          />
          <MetricCard
            label="Returned"
            value={formatNumber(detail.total_returned)}
            icon="🔄"
          />
          <MetricCard
            label="Current Stock"
            value={formatNumber(detail.current_stock)}
            icon="🏪"
          />
        </div>
      </section>

      {/* Performance Metrics */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Efficiency %"
            value={formatPercent(detail.efficiency_percent)}
            icon="📈"
          />
          <MetricCard
            label="Return Rate %"
            value={formatPercent(detail.return_rate_percent)}
            icon="↩️"
          />
          <MetricCard
            label="Total Supply"
            value={formatNumber(detail.total_supply)}
            icon="🚚"
          />
        </div>
      </section>

      {/* Top Products */}
      {detail.top_products && detail.top_products.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-2">
            {detail.top_products.slice(0, 5).map((product, index) => (
              <PerformanceRank
                key={product.product_id}
                rank={index + 1}
                name={product.name || 'Unknown Product'}
                value={formatCurrency(product.total_revenue || 0)}
                metricLabel="Revenue"
                size="sm"
                badge={
                  <span className="text-xs text-gray-600">
                    {formatNumber(product.total_sold || 0)} sold
                  </span>
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Product Breakdown Table */}
      {detail.product_breakdown && detail.product_breakdown.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Breakdown</h2>
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Sold</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Returned</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Stock</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Efficiency %</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {detail.product_breakdown.map((product) => (
                    <tr key={product.product_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 truncate">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{product.sku}</td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatNumber(product.total_sold || 0)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600">
                        {formatNumber(product.total_returned || 0)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatNumber(product.current_stock || 0)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">
                        {formatCurrency(product.total_revenue || 0)}
                      </td>
                      <td className={clsx(
                        'px-4 py-3 text-right font-semibold',
                        (product.efficiency_percent || 0) >= 70 ? 'text-green-600' : 'text-orange-600'
                      )}>
                        {formatPercent(product.efficiency_percent || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
