'use client'

import React from 'react'
import {
  FiActivity,
  FiBarChart2,
  FiBox,
  FiDollarSign,
  FiRefreshCw,
  FiShoppingBag,
  FiTrendingUp,
  FiTruck,
  FiUsers,
} from 'react-icons/fi'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import { useDashboardSummary } from '../hooks/use-dashboard'
import { KpiStatCard } from './kpi-stat-card'
import { MetricCard } from './metric-card'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { parseApiError } from '@/lib/api/error'

/**
 * Updated DashboardSummary Component
 *
 * Displays dashboard summary with NEW field names:
 * - total_returned (was total_retur)
 * - total_sold (was total_actual_sales)
 * - current_stock (was total_stock)
 * - efficiency_percent (was sell_through)
 * - NEW: return_rate_percent
 * - NEW: total_sales_reps
 * - NEW: avg_revenue_per_outlet
 *
 * Usage:
 * ```tsx
 * <UpdatedDashboardSummary />
 * ```
 */
export function UpdatedDashboardSummary(): React.ReactElement {
  const { data: summary, isLoading, isError, error, refetch, isFetching } = useDashboardSummary()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading summary…</p>
      </div>
    )
  }

  if (isError || !summary) {
    const apiError = error ? parseApiError(error) : null
    return (
      <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
        <h3 className="font-semibold text-destructive">Failed to load summary</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {apiError?.message ?? 'Unable to fetch dashboard summary'}
        </p>
        <Button className="mt-4" variant="outline" size="sm" onClick={() => refetch()}>
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </section>
    )
  }

  return (
    <section aria-label="Summary KPIs">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiActivity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Summary (Updated Fields)
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Core Metrics */}
      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={formatCurrency(summary.total_revenue)}
          icon="💰"
          className="lg:col-span-1"
        />
        <MetricCard
          label="Total Sold"
          value={formatNumber(summary.total_sold)}
          icon="📦"
          className="lg:col-span-1"
        />
        <MetricCard
          label="Current Stock"
          value={formatNumber(summary.current_stock)}
          icon="🏪"
          className="lg:col-span-1"
        />
        <MetricCard
          label="Total Supply"
          value={formatNumber(summary.total_supply)}
          icon="🚚"
          className="lg:col-span-1"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 mb-6 sm:grid-cols-3">
        <MetricCard
          label="Efficiency %"
          value={formatPercent(summary.efficiency_percent)}
          icon="📈"
          className="sm:col-span-1"
        />
        <MetricCard
          label="Return Rate %"
          value={formatPercent(summary.return_rate_percent)}
          icon="↩️"
          className="sm:col-span-1"
        />
        <MetricCard
          label="Total Returned"
          value={formatNumber(summary.total_returned)}
          icon="🔄"
          className="sm:col-span-1"
        />
      </div>

      {/* Aggregated Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total Outlets"
          value={formatNumber(summary.total_outlets)}
          icon="🏬"
          className="sm:col-span-1"
        />
        <MetricCard
          label="Total Sales Reps"
          value={formatNumber(summary.total_sales_reps)}
          icon="👥"
          className="sm:col-span-1"
        />
        <MetricCard
          label="Avg Revenue/Outlet"
          value={formatCurrency(summary.avg_revenue_per_outlet)}
          icon="💹"
          className="sm:col-span-1"
        />
      </div>
    </section>
  )
}
