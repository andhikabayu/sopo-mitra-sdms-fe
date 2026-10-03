'use client'

import React, { useState, useMemo } from 'react'
import {
  FiActivity,
  FiBarChart2,
  FiBox,
  FiDollarSign,
  FiMapPin,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
  FiTrendingUp,
  FiTruck,
  FiUsers,
  FiX,
} from 'react-icons/fi'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { RBAC } from '@/config/rbac'
import { useAuth } from '@/features/auth'
import { usePermissions } from '@/features/roles/hooks/use-permissions'
import { formatCurrency, formatNumber, formatPercent, formatDate } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  useDashboardSummary,
  useDashboardOutlets,
  useDashboardProducts,
  useDashboardSales,
  useDashboardAreas,
  useDashboardRevenueTrend,
  useDashboardOutletDetail,
  useDashboardSalesDetail,
} from '../hooks/use-dashboard'
import { useDashboardStore, selectDateRange } from '../stores/dashboard.store'
import { DateRangeFilter } from './date-range-filter'
import { KpiStatCard } from './kpi-stat-card'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

/**
 * Power BI-like Dashboard Analytics Page
 *
 * Displays comprehensive analytics using 8 required APIs with:
 * - Summary KPIs
 * - Outlet/Sales dropdowns for detail views
 * - Revenue trend charts
 * - Performance analytics tables
 */
export function DashboardPowerBi() {
  const { user } = useAuth()
  const { canPerform } = usePermissions()
  const canViewDashboard = canPerform([RBAC.MANAGER, RBAC.SUPER_ADMIN])
  const dateRange = useDashboardStore(selectDateRange)

  // State for dropdown selections
  const [selectedOutletId, setSelectedOutletId] = useState<number | null>(null)
  const [selectedSalesId, setSelectedSalesId] = useState<number | null>(null)
  const [outletSearch, setOutletSearch] = useState<string>('')
  const [salesSearch, setSalesSearch] = useState<string>('')

  // Fetch all analytics data
  const summaryQ = useDashboardSummary()
  const outletsQ = useDashboardOutlets(dateRange)
  const productsQ = useDashboardProducts(dateRange)
  const salesQ = useDashboardSales(dateRange)
  const areasQ = useDashboardAreas(dateRange)
  const trendQ = useDashboardRevenueTrend({ ...dateRange })

  // Fetch detail data (only when ID is selected)
  const outletDetailQ = useDashboardOutletDetail(selectedOutletId || undefined, dateRange)
  const salesDetailQ = useDashboardSalesDetail(selectedSalesId || undefined, dateRange)

  const isLoading = [summaryQ, outletsQ, productsQ, salesQ, areasQ, trendQ].some((q) => q.isLoading)
  const isError = [summaryQ, outletsQ, productsQ, salesQ, areasQ, trendQ].some((q) => q.isError)
  const isFetching = [summaryQ, outletsQ, productsQ, salesQ, areasQ, trendQ].some((q) => q.isFetching)

  // Filter and limit outlets based on search
  const filteredOutlets = useMemo(() => {
    if (!outletsQ.data?.outlets) return []
    return outletsQ.data.outlets
      .filter((outlet) => outlet.outlet_name.toLowerCase().includes(outletSearch.toLowerCase()))
      .slice(0, 5)
  }, [outletsQ.data?.outlets, outletSearch])

  // Filter and limit sales based on search
  const filteredSales = useMemo(() => {
    if (!salesQ.data?.sales_people) return []
    return salesQ.data.sales_people
      .filter((sales) => sales.sales_name.toLowerCase().includes(salesSearch.toLowerCase()))
      .slice(0, 5)
  }, [salesQ.data?.sales_people, salesSearch])

  const handleRefresh = () => {
    summaryQ.refetch()
    outletsQ.refetch()
    productsQ.refetch()
    salesQ.refetch()
    areasQ.refetch()
    trendQ.refetch()
  }

  const handleSelectOutlet = (outletId: number | null) => {
    setSelectedOutletId(outletId)
  }

  const handleSelectSales = (salesId: number | null) => {
    setSelectedSalesId(salesId)
  }

  // Convert revenue trend data for chart
  const revenueTrendData = useMemo(() => {
    if (!trendQ.data?.data || !Array.isArray(trendQ.data.data)) return []
    return trendQ.data.data.map((item) => ({
      date: item.date,
      revenue: Object.values(item).reduce((sum, val) => {
        if (typeof val === 'number') return sum + val
        return sum
      }, 0),
    }))
  }, [trendQ.data])

  if (!canViewDashboard) {
    return (
      <section className="rounded-lg border bg-card p-8 text-center shadow-sm">
        <FiBarChart2 className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 text-lg font-semibold">Dashboard Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dashboard access is restricted to Manager and Super Admin roles.
        </p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3">
        <Spinner className="h-8 w-8 text-primary" />
        <p className="text-sm text-muted-foreground">Loading analytics dashboard…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-destructive">Failed to load dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Unable to fetch analytics data</p>
        <Button className="mt-4" variant="outline" onClick={handleRefresh}>
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
            <FiBarChart2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">
              Welcome{user ? `, ${user.name}` : ''}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time distribution KPIs and performance analytics
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <DateRangeFilter />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="w-full sm:w-auto"
          >
            {isFetching ? <Spinner className="mr-2 h-4 w-4" /> : <FiRefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </header>

      {/* Separate Filter Section - Outlets & Sales */}
      {(outletsQ.data?.outlets || salesQ.data?.sales_people) && (
        <section aria-label="Entity Filters" className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Outlets Filter */}
            {outletsQ.data?.outlets && outletsQ.data.outlets.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <FiShoppingBag className="h-4 w-4 text-primary" />
                  Select Outlet
                  {selectedOutletId && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Active</span>}
                </label>
                <div className="relative">
                  <select
                    value={selectedOutletId || ''}
                    onChange={(e) => handleSelectOutlet(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">-- Select an outlet --</option>
                    {outletsQ.data.outlets.map((outlet) => (
                      <option key={outlet.outlet_id} value={outlet.outlet_id}>
                        {outlet.outlet_name} (Rev: {formatCurrency(outlet.revenue)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Sales Filter */}
            {salesQ.data?.sales_people && salesQ.data.sales_people.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <FiUsers className="h-4 w-4 text-primary" />
                  Select Sales Person
                  {selectedSalesId && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Active</span>}
                </label>
                <div className="relative">
                  <select
                    value={selectedSalesId || ''}
                    onChange={(e) => handleSelectSales(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">-- Select a sales person --</option>
                    {salesQ.data.sales_people.map((sales) => (
                      <option key={sales.sales_id} value={sales.sales_id}>
                        {sales.sales_name} (Rev: {formatCurrency(sales.revenue)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Outlet Detail Display */}
      {selectedOutletId && outletDetailQ.data && (
        <section aria-label="Outlet Detail" className="rounded-lg border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 p-5 shadow-md space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-primary uppercase">Outlet Details</p>
              <h3 className="text-xl font-bold text-foreground mt-1">{outletDetailQ.data.outlet_name}</h3>
              {outletDetailQ.data.sales_area && <p className="text-xs text-muted-foreground">Area: {outletDetailQ.data.sales_area}</p>}
              {outletDetailQ.data.rank_by_revenue !== undefined && <p className="text-xs text-muted-foreground">Rank #{outletDetailQ.data.rank_by_revenue}</p>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOutletId(null)}
              className="text-muted-foreground"
            >
              <FiX className="h-5 w-5" />
            </Button>
          </div>

          {outletDetailQ.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <>
              {/* Main Metrics Grid */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <div className="p-4 rounded-lg bg-white border border-primary/20">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Revenue</p>
                  <p className="font-bold text-lg text-primary mt-1">{formatCurrency(outletDetailQ.data.total_revenue)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-green-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Sold</p>
                  <p className="font-bold text-lg text-green-600 mt-1">{formatNumber(outletDetailQ.data.total_sold)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-blue-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Supply</p>
                  <p className="font-bold text-lg text-blue-600 mt-1">{formatNumber(outletDetailQ.data.total_supply)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-purple-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Returned</p>
                  <p className="font-bold text-lg text-purple-600 mt-1">{formatNumber(outletDetailQ.data.total_returned)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-orange-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Efficiency %</p>
                  <p className="font-bold text-lg text-orange-600 mt-1">{formatPercent(outletDetailQ.data.efficiency_percent)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-red-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Return %</p>
                  <p className="font-bold text-lg text-red-600 mt-1">{formatPercent(outletDetailQ.data.return_rate_percent)}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 text-sm pt-3 border-t">
                <div>
                  <span className="text-muted-foreground">Current Stock:</span>
                  <p className="font-semibold">{formatNumber(outletDetailQ.data.current_stock)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date Range:</span>
                  <p className="font-semibold text-xs">{formatDate(outletDetailQ.data.date_from)} to {formatDate(outletDetailQ.data.date_to)}</p>
                </div>
              </div>

              {/* Product Breakdown Table */}
              {Array.isArray(outletDetailQ.data.product_breakdown) && outletDetailQ.data.product_breakdown.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FiPackage className="h-4 w-4" />
                    Product Breakdown ({outletDetailQ.data.product_breakdown.length} products)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">Product</th>
                          <th className="px-3 py-2 text-right font-semibold">Supply</th>
                          <th className="px-3 py-2 text-right font-semibold">Sold</th>
                          <th className="px-3 py-2 text-right font-semibold">Returned</th>
                          <th className="px-3 py-2 text-right font-semibold">Revenue</th>
                          <th className="px-3 py-2 text-right font-semibold">Efficiency</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {outletDetailQ.data.product_breakdown.map((product) => (
                          <tr key={product.product_id} className="hover:bg-muted/30">
                            <td className="px-3 py-2">
                              <div className="font-medium">{product.product_name || product.name}</div>
                              <div className="text-xs text-muted-foreground">{product.sku}</div>
                            </td>
                            <td className="px-3 py-2 text-right">{formatNumber(product.supply ?? product.total_supply)}</td>
                            <td className="px-3 py-2 text-right">{formatNumber(product.sold ?? product.total_sold)}</td>
                            <td className="px-3 py-2 text-right">{formatNumber(product.returned ?? product.total_returned)}</td>
                            <td className="px-3 py-2 text-right font-medium">{formatCurrency(product.revenue ?? product.total_revenue)}</td>
                            <td className="px-3 py-2 text-right">{formatPercent(product.efficiency_percent)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Top Products */}
              {Array.isArray(outletDetailQ.data.top_products) && outletDetailQ.data.top_products.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FiTrendingUp className="h-4 w-4 text-green-600" />
                    Top Performing Products
                  </h4>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {outletDetailQ.data.top_products.slice(0, 4).map((product) => (
                      <div key={product.product_id} className="p-3 bg-white border rounded-lg">
                        <div className="font-semibold text-sm">{product.product_name || product.name}</div>
                        <div className="text-xs text-muted-foreground mb-2">{product.sku}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Revenue:</span>
                            <p className="font-semibold text-primary">{formatCurrency(product.revenue ?? product.total_revenue)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sold:</span>
                            <p className="font-semibold text-green-600">{formatNumber(product.sold ?? product.total_sold)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Efficiency:</span>
                            <p className="font-semibold text-orange-600">{formatPercent(product.efficiency_percent)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Return:</span>
                            <p className="font-semibold text-red-600">{formatPercent(product.return_rate_percent || 0)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* Sales Detail Display */}
      {selectedSalesId && salesDetailQ.data && (
        <section aria-label="Sales Detail" className="rounded-lg border-2 border-green-600 bg-gradient-to-br from-green-50 to-green-100/50 p-5 shadow-md space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase">Sales Person Details</p>
              <h3 className="text-xl font-bold text-foreground mt-1">{salesDetailQ.data.sales_name}</h3>
              <p className="text-xs text-muted-foreground">@{salesDetailQ.data.username || 'N/A'}</p>
              {salesDetailQ.data.rank_by_revenue !== undefined && <p className="text-xs text-muted-foreground">Rank #{salesDetailQ.data.rank_by_revenue}</p>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSalesId(null)}
              className="text-muted-foreground"
            >
              <FiX className="h-5 w-5" />
            </Button>
          </div>

          {salesDetailQ.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-6 w-6 text-green-600" />
            </div>
          ) : (
            <>
              {/* Main Metrics Grid */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <div className="p-4 rounded-lg bg-white border border-green-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Revenue</p>
                  <p className="font-bold text-lg text-green-600 mt-1">{formatCurrency(salesDetailQ.data.total_revenue)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-blue-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Sold</p>
                  <p className="font-bold text-lg text-blue-600 mt-1">{formatNumber(salesDetailQ.data.total_sold)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-purple-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Supply</p>
                  <p className="font-bold text-lg text-purple-600 mt-1">{formatNumber(salesDetailQ.data.total_supply)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-amber-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Returned</p>
                  <p className="font-bold text-lg text-amber-600 mt-1">{formatNumber(salesDetailQ.data.total_returned)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-orange-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Efficiency %</p>
                  <p className="font-bold text-lg text-orange-600 mt-1">{formatPercent(salesDetailQ.data.efficiency_percent)}</p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-red-200">
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Return %</p>
                  <p className="font-bold text-lg text-red-600 mt-1">{formatPercent(salesDetailQ.data.return_rate_percent)}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 text-sm pt-3 border-t">
                <div>
                  <span className="text-muted-foreground">Outlets Served:</span>
                  <p className="font-semibold">{formatNumber(salesDetailQ.data.outlet_count)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date Range:</span>
                  <p className="font-semibold text-xs">{formatDate(salesDetailQ.data.date_from)} to {formatDate(salesDetailQ.data.date_to)}</p>
                </div>
              </div>

              {/* Outlets Breakdown Table */}
              {Array.isArray(salesDetailQ.data.outlets_breakdown) && salesDetailQ.data.outlets_breakdown.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4" />
                    Outlets Breakdown ({salesDetailQ.data.outlets_breakdown.length} outlets)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">Outlet</th>
                          <th className="px-3 py-2 text-right font-semibold">Supply</th>
                          <th className="px-3 py-2 text-right font-semibold">Sold</th>
                          <th className="px-3 py-2 text-right font-semibold">Returned</th>
                          <th className="px-3 py-2 text-right font-semibold">Revenue</th>
                          <th className="px-3 py-2 text-right font-semibold">Efficiency</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {salesDetailQ.data.outlets_breakdown.map((outlet) => (
                          <tr key={outlet.outlet_id} className="hover:bg-muted/30">
                            <td className="px-3 py-2">
                              <div className="font-medium">{outlet.outlet_name}</div>
                              {outlet.sales_area && <div className="text-xs text-muted-foreground">{outlet.sales_area}</div>}
                            </td>
                            <td className="px-3 py-2 text-right">{formatNumber(outlet.supply ?? outlet.total_supply)}</td>
                            <td className="px-3 py-2 text-right">{formatNumber(outlet.sold ?? outlet.total_sold)}</td>
                            <td className="px-3 py-2 text-right">{formatNumber(outlet.returned ?? outlet.total_returned)}</td>
                            <td className="px-3 py-2 text-right font-medium">{formatCurrency(outlet.revenue ?? outlet.total_revenue)}</td>
                            <td className="px-3 py-2 text-right">{formatPercent(outlet.efficiency_percent)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Top Outlets */}
              {Array.isArray(salesDetailQ.data.top_outlets) && salesDetailQ.data.top_outlets.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FiTrendingUp className="h-4 w-4 text-green-600" />
                    Top Performing Outlets
                  </h4>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {salesDetailQ.data.top_outlets.slice(0, 4).map((outlet) => (
                      <div key={outlet.outlet_id} className="p-3 bg-white border rounded-lg">
                        <div className="font-semibold text-sm">{outlet.outlet_name}</div>
                        {outlet.sales_area && <div className="text-xs text-muted-foreground mb-2">{outlet.sales_area}</div>}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Revenue:</span>
                            <p className="font-semibold text-green-600">{formatCurrency(outlet.revenue ?? outlet.total_revenue)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sold:</span>
                            <p className="font-semibold text-blue-600">{formatNumber(outlet.sold ?? outlet.total_sold)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Efficiency:</span>
                            <p className="font-semibold text-orange-600">{formatPercent(outlet.efficiency_percent)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Return:</span>
                            <p className="font-semibold text-red-600">{formatPercent(outlet.return_rate_percent || 0)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
      {summaryQ.data && (
        <section aria-label="Summary KPIs" className="space-y-3">
          <div className="flex items-center gap-2">
            <FiActivity className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Overall Summary KPI
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiStatCard
              label="Total Revenue"
              value={formatCurrency(summaryQ.data.total_revenue ?? 0)}
              icon={FiDollarSign}
              accent="success"
            />
            <KpiStatCard
              label="Total Sold"
              value={formatNumber(summaryQ.data.total_sold ?? 0)}
              icon={FiTrendingUp}
              accent="primary"
            />
            <KpiStatCard
              label="Efficiency"
              value={formatPercent(summaryQ.data.efficiency_percent ?? 0)}
              icon={FiBarChart2}
              accent="warning"
            />
            <KpiStatCard
              label="Current Stock"
              value={formatNumber(summaryQ.data.current_stock ?? 0)}
              icon={FiBox}
              accent="muted"
            />
            <KpiStatCard
              label="Avg Rev/Outlet"
              value={formatCurrency(summaryQ.data.avg_revenue_per_outlet ?? 0)}
              icon={FiShoppingBag}
              accent="info"
            />
          </div>
        </section>
      )}

      {/* Revenue Trend Chart */}
      {revenueTrendData.length > 0 && (
        <section aria-label="Revenue Trend" className="space-y-3">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Revenue Trend Over Time
            </h2>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" dot={false} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}



      {/* Products Analytics */}
      {productsQ.data && (
        <section aria-label="Products Analytics" className="space-y-3">
          <div className="flex items-center gap-2">
            <FiPackage className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Products Performance
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Best Sellers */}
            {Array.isArray(productsQ.data.top_sellers) && productsQ.data.top_sellers.length > 0 && (
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <h3 className="font-semibold mb-3 text-sm">🏆 Top Sellers</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productsQ.data.top_sellers.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sold" fill="#3b82f6" name="Sold" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Slow Moving */}
            {Array.isArray(productsQ.data.slow_movers) && productsQ.data.slow_movers.length > 0 && (
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <h3 className="font-semibold mb-3 text-sm">🐌 Slow Moving</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productsQ.data.slow_movers.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sold" fill="#ef4444" name="Sold" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Areas Analytics */}
      {areasQ.data?.areas && areasQ.data.areas.length > 0 && (
        <section aria-label="Areas Analytics" className="space-y-3">
          <div className="flex items-center gap-2">
            <FiMapPin className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Areas (Wilayah) Performance
            </h2>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areasQ.data.areas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area_name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Performance Summary Table */}
      {outletsQ.data?.outlets && (
        <section aria-label="Outlets Summary Table" className="space-y-3">
          <div className="flex items-center gap-2">
            <FiBarChart2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              All Outlets Summary ({outletsQ.data.total_records} outlets)
            </h2>
          </div>

          {/* Search Section */}
          <div className="flex items-center gap-2">
            <FiShoppingBag className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by outlet name..."
              value={outletSearch}
              onChange={(e) => setOutletSearch(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {outletSearch && (
              <button
                onClick={() => setOutletSearch('')}
                className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="rounded-lg border bg-card shadow-sm overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Outlet Name</th>
                  <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                  <th className="px-4 py-3 text-right font-semibold">Supply</th>
                  <th className="px-4 py-3 text-right font-semibold">Sold</th>
                  <th className="px-4 py-3 text-right font-semibold">Efficiency</th>
                  <th className="px-4 py-3 text-right font-semibold">Return %</th>
                  <th className="px-4 py-3 text-right font-semibold">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOutlets.length > 0 ? (
                  filteredOutlets.map((outlet, idx) => (
                    <tr key={outlet.outlet_id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div>{outlet.outlet_name}</div>
                        <div className="text-xs text-muted-foreground">Rank #{outlet.rank_by_revenue}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(outlet.revenue)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(outlet.supply)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(outlet.sold)}</td>
                      <td className="px-4 py-3 text-right">{formatPercent(outlet.efficiency_percent)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatPercent(outlet.return_rate_percent)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(outlet.current_stock)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No outlets found matching "{outletSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {outletsQ.data.outlets.length > 5 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing 5 of {outletSearch ? filteredOutlets.length : outletsQ.data.total_records} outlets
              {outletSearch && ` (filtered from ${outletsQ.data.total_records})`}
            </p>
          )}
        </section>
      )}

      {/* Sales Summary Table */}
      {salesQ.data?.sales_people && (
        <section aria-label="Sales Summary Table" className="space-y-3">
          <div className="flex items-center gap-2">
            <FiUsers className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              All Sales People Summary ({salesQ.data.total_records} sales)
            </h2>
          </div>

          {/* Search Section */}
          <div className="flex items-center gap-2">
            <FiUsers className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by sales name..."
              value={salesSearch}
              onChange={(e) => setSalesSearch(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {salesSearch && (
              <button
                onClick={() => setSalesSearch('')}
                className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="rounded-lg border bg-card shadow-sm overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Sales Name</th>
                  <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                  <th className="px-4 py-3 text-right font-semibold">Outlets</th>
                  <th className="px-4 py-3 text-right font-semibold">Supply</th>
                  <th className="px-4 py-3 text-right font-semibold">Sold</th>
                  <th className="px-4 py-3 text-right font-semibold">Efficiency</th>
                  <th className="px-4 py-3 text-right font-semibold">Return %</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSales.length > 0 ? (
                  filteredSales.map((sales) => (
                    <tr key={sales.sales_id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div>{sales.sales_name}</div>
                        <div className="text-xs text-muted-foreground">@{sales.username}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(sales.revenue)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(sales.outlet_count)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(sales.supply)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(sales.sold)}</td>
                      <td className="px-4 py-3 text-right">{formatPercent(sales.efficiency_percent)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatPercent(sales.return_rate_percent)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No sales people found matching "{salesSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {salesQ.data.sales_people.length > 5 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing 5 of {salesSearch ? filteredSales.length : salesQ.data.total_records} sales
              {salesSearch && ` (filtered from ${salesQ.data.total_records})`}
            </p>
          )}
        </section>
      )}
    </div>
  )
}
