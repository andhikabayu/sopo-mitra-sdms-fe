'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import type {
  DashboardAreaKpi,
  DashboardOutletKpi,
  DashboardPerformanceOutlet,
  DashboardPerformanceSales,
  DashboardProductKpi,
  DashboardSalesKpi,
  DashboardSummary,
} from '../types/dashboard.types'

/**
 * Compute a nice Y-axis domain that ensures all bars are visible
 * even when values differ by orders of magnitude.
 * Uses log scale when the ratio between max and min values exceeds 100x.
 */
function computeNiceDomain(values: number[]): [number, number] {
  if (values.length === 0) return [0, 100]
  const max = Math.max(...values)
  const min = Math.min(...values.filter((v) => v > 0))
  if (max === 0) return [0, 100]
  // If ratio is huge, we still keep linear but ensure min bar is at least 2% of max
  return [0, max * 1.1]
}

/**
 * For charts with mixed-scale data (e.g. sold_qty ~47 vs revenue ~214000),
 * split into separate Y-axes so small values are not dwarfed.
 * This helper returns the max value for a given set of data keys.
 */
function getMaxForKeys(data: Record<string, unknown>[], keys: string[]): number {
  let max = 0
  for (const item of data) {
    for (const key of keys) {
      const val = Number(item[key] ?? 0)
      if (val > max) max = val
    }
  }
  return max
}

export const CHART_COLORS = {
  supply: 'hsl(221, 83%, 53%)',
  returned: 'hsl(0, 72%, 51%)',
  sold: 'hsl(142, 71%, 45%)',
  revenue: 'hsl(262, 83%, 58%)',
  current_stock: 'hsl(38, 92%, 50%)',
  efficiency_percent: 'hsl(199, 89%, 48%)',
  bestSeller: 'hsl(142, 71%, 45%)',
  slowMoving: 'hsl(38, 92%, 50%)',
} as const

function truncateLabel(value: string, max = 16): string {
  return value.length > max ? `${value.slice(0, max)}…` : value
}

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <section className={`rounded-lg border bg-card p-4 shadow-sm ${className ?? ''}`}>
      <header className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </header>
      {children}
    </section>
  )
}

interface TooltipPayloadItem {
  name?: string
  value?: number
  color?: string
  dataKey?: string
}

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  valueFormatter: (value: number, key?: string) => string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-md">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      <ul className="space-y-1">
        {payload.map((entry) => (
          <li key={entry.dataKey ?? entry.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">{valueFormatter(Number(entry.value ?? 0), entry.dataKey)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function OperationsOverviewChart({ summary }: { summary: DashboardSummary }) {
  const data = [
    {
      name: 'Overview',
      Supply: summary.total_supply,
      Retur: summary.total_returned,
      'Sold': summary.total_sold,
      Stock: summary.current_stock,
    },
  ]

  const maxVal = getMaxForKeys(data, ['Supply', 'Retur', 'Sold', 'Stock'])

  return (
    <ChartCard
      title="Operations Overview"
      description="Total supply, retur, actual sales, and remaining stock from /dashboard/summary"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxVal * 1.15]}
              allowDecimals={false}
            />
            <Tooltip
              content={
                <ChartTooltip valueFormatter={(v) => formatNumber(v)} />
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Supply" fill={CHART_COLORS.supply} radius={[4, 4, 0, 0]} />
            <Bar dataKey="returned" fill={CHART_COLORS.returned} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Sold" fill={CHART_COLORS.sold} radius={[4, 4, 0, 0]} />
            <Bar dataKey="current_stock" fill={CHART_COLORS.current_stock} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function SupplyFlowChart({ summary }: { summary: DashboardSummary }) {
  const data = [
    { stage: 'Supply', value: summary.total_supply, fill: CHART_COLORS.supply },
    { stage: 'Retur', value: summary.total_returned, fill: CHART_COLORS.returned },
    { stage: 'Sold', value: summary.total_sold, fill: CHART_COLORS.sold },
    { stage: 'Remaining Stock', value: summary.current_stock, fill: CHART_COLORS.current_stock },
  ]

  const maxVal = getMaxForKeys(data, ['value'])

  return (
    <ChartCard
      title="Supply Flow Pipeline"
      description={`Sell-through ${formatPercent(summary.efficiency_percent)} · Revenue ${formatCurrency(summary.total_revenue)}`}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} domain={[0, maxVal * 1.15]} />
            <YAxis type="category" dataKey="stage" width={110} tick={{ fontSize: 12 }} />
            <Tooltip content={<ChartTooltip valueFormatter={(v) => formatNumber(v)} />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell key={entry.stage} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function AreaPerformanceChart({ areas }: { areas: DashboardAreaKpi[] }) {
  const data = areas.map((area) => ({
    area: truncateLabel(area.area_name, 14),
    fullName: area.area_name,
    Revenue: area.revenue,
    'Sold': area.sold,
    Supply: area.supply,
    'Sell Through': area.efficiency_percent,
  }))

  // Compute separate max values for quantity metrics vs revenue
  const revenueValues = data.map(item => item.Revenue as number);
  const qtyValues = data.flatMap(item => [item['Sold'] as number, item.Supply as number]);
  const maxRevenue = Math.max(...revenueValues, 1);
  const maxQty = Math.max(...qtyValues, 1);

  return (
    <ChartCard
      title="Area Performance Ranking"
      description="Revenue and actual sales per sales area — GET /dashboard/areas"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="area" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={60} />
            {/* Left Y-axis for quantity metrics */}
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxQty * 1.15]}
            />
            {/* Right Y-axis for revenue */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxRevenue * 1.15]}
            />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(v, key) =>
                    key === 'Sell Through' ? formatPercent(v) : key === 'Revenue' ? formatCurrency(v) : formatNumber(v)
                  }
                />
              }
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string } | undefined
                return item?.fullName ?? ''
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="Sold" fill={CHART_COLORS.sold} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="Supply" fill={CHART_COLORS.supply} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="Revenue" fill={CHART_COLORS.revenue} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="efficiency_percent" fill={CHART_COLORS.efficiency_percent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function OutletPerformanceChart({ outlets }: { outlets: DashboardOutletKpi[] }) {
  const sorted = [...outlets].sort((a, b) => b.revenue - a.revenue).slice(0, 8)
  const data = sorted.map((outlet) => ({
    outlet: truncateLabel(outlet.outlet_name, 12),
    fullName: outlet.outlet_name,
    area: outlet.sales_area,
    Revenue: outlet.revenue,
    'Sold': outlet.sold,
    Supply: outlet.supply,
    Retur: outlet.returned,
  }))

  // Compute separate max values for quantity metrics vs revenue
  const revenueValues = data.map(item => item.Revenue as number);
  const qtyValues = data.flatMap(item => [
    item['Sold'] as number,
    item.Supply as number,
    item.Retur as number,
  ]);
  const maxRevenue = Math.max(...revenueValues, 1);
  const maxQty = Math.max(...qtyValues, 1);

  return (
    <ChartCard
      title="Top Outlet Performance"
      description="Top outlets by revenue — GET /dashboard/outlets"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            {/* Left X-axis for quantity metrics */}
            <XAxis
              type="number"
              xAxisId="left"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxQty * 1.15]}
            />
            {/* Right X-axis for revenue */}
            <XAxis
              type="number"
              xAxisId="right"
              orientation="top"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxRevenue * 1.15]}
            />
            <YAxis type="category" dataKey="outlet" width={88} tick={{ fontSize: 11 }} />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(v, key) => (key === 'Revenue' ? formatCurrency(v) : formatNumber(v))}
                />
              }
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string; area?: string } | undefined
                return item ? `${item.fullName} (${item.area})` : ''
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar xAxisId="left" dataKey="Sold" fill={CHART_COLORS.sold} radius={[0, 4, 4, 0]} />
            <Bar xAxisId="left" dataKey="Supply" fill={CHART_COLORS.supply} radius={[0, 4, 4, 0]} />
            <Bar xAxisId="left" dataKey="returned" fill={CHART_COLORS.returned} radius={[0, 4, 4, 0]} />
            <Bar xAxisId="right" dataKey="Revenue" fill={CHART_COLORS.revenue} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function ProductSalesChart({ products }: { products: DashboardProductKpi[] }) {
  const sorted = [...products].sort((a, b) => b.sold - a.sold)
  const data = sorted.map((product) => ({
    product: truncateLabel(product.name, 14),
    fullName: product.name,
    sku: product.sku,
    'Sold': product.sold,
    Revenue: product.revenue,
    'Sell Through': product.efficiency_percent,
  }))

  // Compute separate max values for quantity metrics vs revenue
  const revenueValues = data.map(item => item.Revenue as number);
  const qtyValues = data.map(item => item['Sold'] as number);
  const maxRevenue = Math.max(...revenueValues, 1);
  const maxQty = Math.max(...qtyValues, 1);

  return (
    <ChartCard
      title="Product Sales Performance"
      description="Actual sales and revenue per product — GET /dashboard/products"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="product" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={70} />
            {/* Left Y-axis for quantity metrics */}
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxQty * 1.15]}
            />
            {/* Right Y-axis for revenue */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxRevenue * 1.15]}
            />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(v, key) =>
                    key === 'Revenue' ? formatCurrency(v) : key === 'Sell Through' ? formatPercent(v) : formatNumber(v)
                  }
                />
              }
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string; sku?: string } | undefined
                return item ? `${item.fullName} (${item.sku})` : ''
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="Sold" fill={CHART_COLORS.sold} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="Revenue" fill={CHART_COLORS.revenue} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function BestSlowProductsChart({
  bestSeller,
  slowMoving,
}: {
  bestSeller: DashboardProductKpi[]
  slowMoving: DashboardProductKpi[]
}) {
  const bestData = bestSeller.map((item) => ({
    name: truncateLabel(item.name, 18),
    fullName: item.name,
    'Sold': item.sold,
    type: 'Best Seller',
  }))
  const slowData = slowMoving.map((item) => ({
    name: truncateLabel(item.name, 18),
    fullName: item.name,
    'Sold': item.sold,
    type: 'Slow Moving',
  }))
  const data = [...bestData, ...slowData]

  const maxVal = getMaxForKeys(data, ['Sold'])

  return (
    <ChartCard
      title="Best Seller vs Slow Moving"
      description="Product movement ranking from best_seller and slow_moving fields"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, maxVal * 1.15]} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
            <Tooltip
              content={<ChartTooltip valueFormatter={(v) => formatNumber(v)} />}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string; type?: string } | undefined
                return item ? `${item.fullName} — ${item.type}` : ''
              }}
            />
            <Bar dataKey="Sold" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell
                  key={`${entry.fullName}-${entry.type}`}
                  fill={entry.type === 'Best Seller' ? CHART_COLORS.bestSeller : CHART_COLORS.slowMoving}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function SalesTeamChart({ sales }: { sales: DashboardSalesKpi[] }) {
  const data = sales.map((item) => ({
    sales: truncateLabel(item.sales_name, 14),
    fullName: item.sales_name,
    Revenue: item.revenue,
    Supply: item.supply,
    Retur: item.returned,
  }))

  // Compute separate max values for quantity metrics vs revenue
  const revenueValues = data.map(item => item.Revenue as number);
  const qtyValues = data.flatMap(item => [item.Supply as number, item.Retur as number]);
  const maxRevenue = Math.max(...revenueValues, 1);
  const maxQty = Math.max(...qtyValues, 1);

  return (
    <ChartCard
      title="Sales Team Performance"
      description="Revenue, supply, and retur per sales — GET /dashboard/sales"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="sales" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
            {/* Left Y-axis for quantity metrics */}
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxQty * 1.15]}
            />
            {/* Right Y-axis for revenue */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[0, maxRevenue * 1.15]}
            />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(v, key) => (key === 'Revenue' ? formatCurrency(v) : formatNumber(v))}
                />
              }
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string } | undefined
                return item?.fullName ?? ''
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="Supply" fill={CHART_COLORS.supply} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="returned" fill={CHART_COLORS.returned} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="Revenue" fill={CHART_COLORS.revenue} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function SellThroughByOutletChart({ outlets }: { outlets: DashboardOutletKpi[] }) {
  const data = [...outlets]
    .sort((a, b) => b.efficiency_percent - a.efficiency_percent)
    .slice(0, 10)
    .map((outlet) => ({
      outlet: truncateLabel(outlet.outlet_name, 12),
      fullName: outlet.outlet_name,
      'Sell Through': outlet.efficiency_percent,
    }))

  // Compute max sell through value for dynamic domain
  const sellThroughValues = data.map(item => item['Sell Through'] as number);
  const maxSellThrough = Math.max(...sellThroughValues, 1);

  return (
    <ChartCard title="Sell-Through by Outlet" description="Sell-through percentage per outlet">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="outlet" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={60} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, Math.min(maxSellThrough * 1.15, 100)]}
              allowDecimals={false}
            />
            <Tooltip
              content={<ChartTooltip valueFormatter={(v) => formatPercent(v)} />}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string } | undefined
                return item?.fullName ?? ''
              }}
            />
            <Bar dataKey="efficiency_percent" fill={CHART_COLORS.efficiency_percent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function PerformanceOutletSoldChart({ outlets }: { outlets: DashboardPerformanceOutlet[] }) {
  const data = [...outlets]
    .sort((a, b) => b.sold_qty - a.sold_qty)
    .slice(0, 10)
    .map((outlet) => ({
      outlet: truncateLabel(outlet.outlet_name, 12),
      fullName: outlet.outlet_name,
      area: outlet.sales_area,
      'Sold Qty': outlet.sold_qty,
      Revenue: outlet.revenue,
    }))

  // Compute max values for each metric to set appropriate domains
  const soldValues = data.map(item => item['Sold Qty'] as number);
  const revenueValues = data.map(item => item.Revenue as number);
  const maxSold = Math.max(...soldValues, 1);
  const maxRevenue = Math.max(...revenueValues, 1);

  return (
    <ChartCard
      title="Outlet Sold Quantity"
      description="Penjualan terjual berdasarkan stock audit — GET /dashboard/performance/outlets"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              scale="log"
              domain={[1, Math.max(maxSold, maxRevenue) * 1.2]}
            />
            <YAxis
              type="category"
              dataKey="outlet"
              width={88}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(v, key) =>
                    key === 'Revenue' ? formatCurrency(v) : formatNumber(v)
                  }
                />
              }
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string; area?: string } | undefined
                return item ? `${item.fullName} (${item.area})` : ''
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="Sold Qty"
              fill={CHART_COLORS.sold}
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="Revenue"
              fill={CHART_COLORS.revenue}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function PerformanceSalesChart({ sales }: { sales: DashboardPerformanceSales[] }) {
  const data = sales.map((item) => ({
    sales: truncateLabel(item.sales_name, 14),
    fullName: item.sales_name,
    username: item.username,
    'Sold Qty': item.total_sold_qty,
    Revenue: item.total_revenue,
    Outlets: item.outlet_count,
    'Sell Through': item.sell_through,
  }))

  // Compute max values for each metric to set appropriate domains
  const soldValues = data.map(item => item['Sold Qty'] as number);
  const revenueValues = data.map(item => item.Revenue as number);
  const maxSold = Math.max(...soldValues, 1);
  const maxRevenue = Math.max(...revenueValues, 1);

  return (
    <ChartCard
      title="Sales Performance Overview"
      description="Total sold qty & revenue per sales — GET /dashboard/performance/sales"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="sales" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
              domain={[1, Math.max(maxSold, maxRevenue) * 1.2]}
              scale="log"
            />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(v, key) =>
                    key === 'Revenue' ? formatCurrency(v) : key === 'Sell Through' ? formatPercent(v) : formatNumber(v)
                  }
                />
              }
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload as { fullName?: string; username?: string } | undefined
                return item ? `${item.fullName} (@${item.username})` : ''
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="Sold Qty" fill={CHART_COLORS.sold} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="Revenue" fill={CHART_COLORS.revenue} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="Outlets" fill={CHART_COLORS.supply} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="efficiency_percent" fill={CHART_COLORS.efficiency_percent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
