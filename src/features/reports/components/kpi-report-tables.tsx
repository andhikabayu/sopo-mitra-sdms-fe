'use client'

/* eslint-disable no-console */

import React from 'react'
import { FiDownload, FiRefreshCw } from 'react-icons/fi'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import { DataTable } from '@/components/data-table/data-table'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import type { ProductKPIReport, OutletKPIReport, SalesKPIReport, AreaKPIReport } from '../types/reports.types'

// ============================================================================
// Product KPI Report Table
// ============================================================================

export function ProductKPIReportTable({ products, isLoading, onRefresh }: {
  products: ProductKPIReport[]
  isLoading: boolean
  onRefresh?: () => void
}) {
  console.log('[ProductKPIReportTable] products received:', products)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Performance</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !Array.isArray(products) || products.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No product data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <DataTable
            columns={[
              { key: 'sku', label: 'SKU' },
              { key: 'name', label: 'Product Name' },
              { key: 'category', label: 'Category' },
              { key: 'total_supply', label: 'Supply' },
              { key: 'total_returned', label: 'Returned' },
              { key: 'total_sold', label: 'Sold' },
              { key: 'total_revenue', label: 'Revenue' },
              { key: 'efficiency_percent', label: 'Efficiency %' },
            ]}
            data={products.map((row) => {
              console.log('[ProductKPIReportTable] mapping row:', row)
              return {
                ...row,
                total_supply: formatNumber(row.total_supply || 0),
                total_returned: formatNumber(row.total_returned || 0),
                total_sold: formatNumber(row.total_sold || 0),
                total_revenue: formatCurrency(row.total_revenue || 0),
                efficiency_percent: formatPercent(row.efficiency_percent || 0),
              }
            })}
            isLoading={false}
            getRowId={(r: any) => r.product_id || r.sku}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Outlet KPI Report Table
// ============================================================================

export function OutletKPIReportTable({ outlets, isLoading, onRefresh }: {
  outlets: OutletKPIReport[]
  isLoading: boolean
  onRefresh?: () => void
}) {
  console.log('[OutletKPIReportTable] outlets received:', outlets)
  console.log('[OutletKPIReportTable] outlets type:', typeof outlets)
  console.log('[OutletKPIReportTable] outlets is array:', Array.isArray(outlets))
  console.log('[OutletKPIReportTable] outlets length:', outlets.length)
  const firstOutlet = outlets[0]
  if (firstOutlet) {
    console.log('[OutletKPIReportTable] first item keys:', Object.keys(firstOutlet))
    console.log('[OutletKPIReportTable] first item:', firstOutlet)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Outlet Performance</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !Array.isArray(outlets) || outlets.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No outlet data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <DataTable
            columns={[
              { key: 'outlet_name', label: 'Outlet' },
              { key: 'total_quantity_supplied', label: 'Supplied', format: 'number' },
              { key: 'total_quantity_returned', label: 'Returned', format: 'number' },
              { key: 'total_quantity_sold', label: 'Sold', format: 'number' },
              { key: 'total_revenue', label: 'Revenue', format: 'currency' },
              { key: 'stock_turnover_rate', label: 'Turnover %', format: 'number' },
              { key: 'retur_rate_percent', label: 'Return Rate %', format: 'number' },
              { key: 'rank_by_revenue', label: 'Revenue Rank', format: 'number' },
              { key: 'rank_by_efficiency', label: 'Efficiency Rank', format: 'number' },
            ]}
            data={outlets.map((row) => {
              console.log('[OutletKPIReportTable] mapping row:', row)
              return row
            })}
            isLoading={false}
            getRowId={(r: any) => String(r.outlet_id)}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Sales KPI Report Table
// ============================================================================

export function SalesKPIReportTable({ sales, isLoading, onRefresh }: {
  sales: SalesKPIReport[]
  isLoading: boolean
  onRefresh?: () => void
}) {
  console.log('[SalesKPIReportTable] sales received:', sales)
  console.log('[SalesKPIReportTable] sales type:', typeof sales)
  console.log('[SalesKPIReportTable] sales is array:', Array.isArray(sales))
  console.log('[SalesKPIReportTable] sales length:', sales.length)
  const firstSales = sales[0]
  if (firstSales) {
    console.log('[SalesKPIReportTable] first item keys:', Object.keys(firstSales))
    console.log('[SalesKPIReportTable] first item:', firstSales)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sales Performance</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !Array.isArray(sales) || sales.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No sales data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <DataTable
            columns={[
              { key: 'sales_name', label: 'Sales Person' },
              { key: 'total_quantity_supplied', label: 'Supplied', format: 'number' },
              { key: 'total_quantity_returned', label: 'Returned', format: 'number' },
              { key: 'total_quantity_sold', label: 'Sold', format: 'number' },
              { key: 'total_revenue', label: 'Revenue', format: 'currency' },
              { key: 'number_of_outlets_served', label: 'Outlets Served', format: 'number' },
              { key: 'average_revenue_per_outlet', label: 'Avg Revenue/Outlet', format: 'currency' },
              { key: 'stock_efficiency_percent', label: 'Efficiency %', format: 'number' },
              { key: 'retur_rate_percent', label: 'Return Rate %', format: 'number' },
              { key: 'rank_by_revenue', label: 'Revenue Rank', format: 'number' },
              { key: 'rank_by_efficiency', label: 'Efficiency Rank', format: 'number' },
            ]}
            data={sales.map((row) => {
              console.log('[SalesKPIReportTable] mapping row:', row)
              return row
            })}
            isLoading={false}
            getRowId={(r: any) => String(r.sales_id)}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Area KPI Report Table
// ============================================================================

export function AreaKPIReportTable({ areas, isLoading, onRefresh }: {
  areas: AreaKPIReport[]
  isLoading: boolean
  onRefresh?: () => void
}) {
  console.log('[AreaKPIReportTable] areas received:', areas)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Area Performance</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !Array.isArray(areas) || areas.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No area data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <DataTable
            columns={[
              { key: 'area', label: 'Area' },
              { key: 'total_supply', label: 'Supply' },
              { key: 'total_returned', label: 'Returned' },
              { key: 'total_sold', label: 'Sold' },
              { key: 'total_revenue', label: 'Revenue' },
              { key: 'efficiency_percent', label: 'Efficiency %' },
              { key: 'return_rate_percent', label: 'Return Rate %' },
            ]}
            data={areas.map((row) => {
              console.log('[AreaKPIReportTable] mapping row:', row)
              return {
                ...row,
                total_supply: formatNumber(row.total_supply || 0),
                total_returned: formatNumber(row.total_returned || 0),
                total_sold: formatNumber(row.total_sold || 0),
                total_revenue: formatCurrency(row.total_revenue || 0),
                efficiency_percent: formatPercent(row.efficiency_percent || 0),
                return_rate_percent: formatPercent(row.return_rate_percent || 0),
              }
            })}
            isLoading={false}
            getRowId={(r: any) => r.area}
          />
        </div>
      )}
    </div>
  )
}
