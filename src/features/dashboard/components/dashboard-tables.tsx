"use client"

import { Fragment } from 'react'
import Link from 'next/link'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import type {
  DashboardAreaKpi,
  DashboardOutletKpi,
  DashboardPerformanceOutlet,
  DashboardPerformanceSales,
  DashboardProductKpi,
  DashboardSalesKpi,
} from '../types/dashboard.types'

import { DataTable } from '@/components/data-table/data-table'

interface DataTableProps {
  title: string
  description?: string
  children: React.ReactNode
}

function DataTableSection({ title, description, children }: DataTableProps) {
  return (
    <section className="rounded-lg border bg-card shadow-sm">
      <header className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </header>
      <div className="overflow-x-auto">{children}</div>
    </section>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground ${className ?? ''}`}>
      {children}
    </th>
  )
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`whitespace-nowrap px-4 py-2.5 text-sm ${className ?? ''}`}>
      {children}
    </td>
  )
}

export function OutletsDataTable({ outlets }: { outlets: DashboardOutletKpi[] }) {
  console.log('[OutletsDataTable] outlets received:', outlets)
  return (
    <DataTableSection
      title="Outlet KPI Details"
      description="Full response from GET /dashboard/outlets"
    >
      <DataTable
        columns={[
          { key: 'outlet_name', label: 'Outlet' },
          { key: 'sales_area', label: 'Sales Area' },
          { key: 'supply', label: 'Supply' },
          { key: 'returned', label: 'Returned' },
          { key: 'sold', label: 'Sold' },
          { key: 'revenue', label: 'Revenue' },
          { key: 'current_stock', label: 'Stock' },
          { key: 'efficiency_percent', label: 'Efficiency %' },
          { key: 'return_rate_percent', label: 'Return Rate %' },
        ]}
        data={outlets.map((row) => {
          console.log('[OutletsDataTable] mapping row:', row)
          return {
            ...row,
            outlet_name: row.outlet_name,
            sales_area: row.sales_area,
            supply: formatNumber(row.supply),
            returned: formatNumber(row.returned),
            sold: formatNumber(row.sold),
            revenue: formatCurrency(row.revenue),
            current_stock: formatNumber(row.current_stock),
            efficiency_percent: formatPercent(row.efficiency_percent),
            return_rate_percent: formatPercent(row.return_rate_percent),
          }
        })}
        isLoading={false}
        getRowId={(r: any) => r.outlet_id}
      />
    </DataTableSection>
  )
}

export function ProductsDataTable({ products }: { products: DashboardProductKpi[] }) {
  console.log('[ProductsDataTable] products received:', products)
  return (
    <DataTableSection
      title="Product KPI Details"
      description="products array from GET /dashboard/products"
    >
      <DataTable
        columns={[
          { key: 'sku', label: 'SKU' },
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'total_supply', label: 'Supply' },
          { key: 'total_returned', label: 'Returned' },
          { key: 'total_sold', label: 'Sold' },
          { key: 'total_revenue', label: 'Revenue' },
          { key: 'efficiency_percent', label: 'Efficiency %' },
        ]}
        data={products.map((row) => {
          console.log('[ProductsDataTable] mapping row:', row)
          return {
            ...row,
            sku: row.sku,
            name: row.name,
            category: row.category,
            supply: formatNumber(row.supply),
            returned: formatNumber(row.returned),
            sold: formatNumber(row.sold),
            revenue: formatCurrency(row.revenue),
            efficiency_percent: formatPercent(row.efficiency_percent),
          }
        })}
        isLoading={false}
        getRowId={(r: any) => r.product_id}
      />
    </DataTableSection>
  )
}

export function ProductRankingTables({
  bestSeller,
  slowMoving,
}: {
  bestSeller: DashboardProductKpi[]
  slowMoving: DashboardProductKpi[]
}) {
  console.log('[ProductRankingTables] bestSeller:', bestSeller, 'slowMoving:', slowMoving)
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DataTableSection title="Best Seller" description="best_seller from GET /dashboard/products">
        <DataTable
          columns={[{ key: 'name', label: 'Product' }, { key: 'sold', label: 'Sold' }]}
          data={bestSeller.map((row) => ({
            ...row,
            name: row.name,
            sold: formatNumber(row.sold),
          }))}
          isLoading={false}
          getRowId={(r: any) => r.product_id}
        />
      </DataTableSection>

      <DataTableSection title="Slow Moving" description="slow_moving from GET /dashboard/products">
        <DataTable
          columns={[{ key: 'name', label: 'Product' }, { key: 'sold', label: 'Sold' }]}
          data={slowMoving.map((row) => ({
            ...row,
            name: row.name,
            sold: formatNumber(row.sold),
          }))}
          isLoading={false}
          getRowId={(r: any) => r.product_id}
        />
      </DataTableSection>
    </div>
  )
}

export function SalesDataTable({ sales }: { sales: DashboardSalesKpi[] }) {
  console.log('[SalesDataTable] sales received:', sales)
  return (
    <DataTableSection title="Sales KPI Details" description="Full response from GET /dashboard/sales">
      <DataTable
        columns={[
          { key: 'sales_name', label: 'Sales' },
          { key: 'supply', label: 'Supply' },
          { key: 'returned', label: 'Returned' },
          { key: 'revenue', label: 'Revenue' },
        ]}
        data={sales.map((row) => {
          console.log('[SalesDataTable] mapping row:', row)
          return {
            ...row,
            sales_name: row.sales_name,
            supply: formatNumber(row.supply),
            returned: formatNumber(row.returned),
            revenue: formatCurrency(row.revenue),
          }
        })}
        isLoading={false}
        getRowId={(r: any) => r.sales_id}
      />
    </DataTableSection>
  )
}

export function AreasDataTable({ areas }: { areas: DashboardAreaKpi[] }) {
  console.log('[AreasDataTable] areas received:', areas)
  return (
    <DataTableSection title="Area KPI Details" description="Full response from GET /dashboard/areas">
      <DataTable
        columns={[
          { key: 'area_name', label: 'Area' },
          { key: 'supply', label: 'Supply' },
          { key: 'sold', label: 'Sold' },
          { key: 'revenue', label: 'Revenue' },
          { key: 'efficiency_percent', label: 'Efficiency %' },
          { key: 'return_rate_percent', label: 'Return Rate %' },
        ]}
        data={areas.map((row) => {
          console.log('[AreasDataTable] mapping row:', row)
          return {
            ...row,
            area_name: row.area_name,
            supply: formatNumber(row.supply),
            sold: formatNumber(row.sold),
            revenue: formatCurrency(row.revenue),
            efficiency_percent: formatPercent(row.efficiency_percent),
            return_rate_percent: formatPercent(row.return_rate_percent),
          }
        })}
        isLoading={false}
        getRowId={(r: any) => r.area_id}
      />
    </DataTableSection>
  )
}

export function PerformanceOutletsDataTable({ outlets }: { outlets: DashboardPerformanceOutlet[] }) {
  return (
    <DataTableSection
      title="Outlet Performance Details"
      description="Full response from GET /dashboard/performance/outlets"
    >
      <DataTable
        columns={[
          { key: 'outlet_name', label: 'Outlet' },
          { key: 'sales_area', label: 'Sales Area' },
          { key: 'supply', label: 'Supply' },
          { key: 'retur', label: 'Retur' },
          { key: 'sold_qty', label: 'Sold Qty' },
          { key: 'revenue', label: 'Revenue' },
          { key: 'stock', label: 'Stock' },
          { key: 'sell_through', label: 'Sell Through' },
        ]}
        data={outlets.map((row) => ({ ...row, supply: formatNumber(row.supply), retur: formatNumber(row.retur), sold_qty: formatNumber(row.sold_qty), revenue: formatCurrency(row.revenue), stock: formatNumber(row.stock), sell_through: formatPercent(row.sell_through) }))}
        isLoading={false}
        getRowId={(r: any) => r.outlet_id}
      />
    </DataTableSection>
  )
}

export function PerformanceSalesDataTable({ sales }: { sales: DashboardPerformanceSales[] }) {
  return (
    <DataTableSection
      title="Sales Performance Details"
      description="Full response from GET /dashboard/performance/sales (including nested outlets)"
    >
      {/* Flatten parent sales rows and child outlet rows for DataTable */}
      <DataTable
        columns={[
          { key: 'name', label: 'Sales' },
          { key: 'username', label: 'Username' },
          { key: 'outlet_count', label: 'Outlets' },
          { key: 'total_supply', label: 'Supply' },
          { key: 'total_retur', label: 'Retur' },
          { key: 'total_sold_qty', label: 'Sold Qty' },
          { key: 'total_revenue', label: 'Revenue' },
          { key: 'sell_through', label: 'Sell Through' },
        ]}
        data={sales.flatMap((row) => {
          const parent = {
            id: `s-${row.sales_id}`,
            name: row.sales_name,
            username: row.username,
            outlet_count: formatNumber(row.outlet_count),
            total_supply: formatNumber(row.total_supply),
            total_retur: formatNumber(row.total_retur),
            total_sold_qty: formatNumber(row.total_sold_qty),
            total_revenue: formatCurrency(row.total_revenue),
            sell_through: formatPercent(row.sell_through),
          }

          const children = row.outlets.map((outlet) => ({
            id: `o-${row.sales_id}-${outlet.outlet_id}`,
            name: `↳ ${outlet.outlet_name}`,
            username: outlet.sales_area,
            outlet_count: '—',
            total_supply: '—',
            total_retur: '—',
            total_sold_qty: formatNumber(outlet.sold_qty),
            total_revenue: formatCurrency(outlet.revenue),
            sell_through: formatPercent(outlet.sell_through),
          }))

          return [parent, ...children]
        })}
        isLoading={false}
        getRowId={(r: any) => r.id}
      />
    </DataTableSection>
  )
}
