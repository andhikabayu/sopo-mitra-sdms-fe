/** GET /dashboard/summary */
export interface DashboardSummary {
  total_supply: number
  total_returned: number
  total_sold: number
  total_revenue: number
  current_stock: number
  return_rate_percent: number
  efficiency_percent: number
  total_outlets: number
  total_products: number
  total_sales_reps: number
  avg_revenue_per_outlet: number
}

/** GET /dashboard/outlets - single outlet */
export interface DashboardOutlet {
  outlet_id: number
  outlet_name: string
  sales_area: string | null
  sales_area_id: number
  supply: number
  returned: number
  sold: number
  revenue: number
  current_stock: number
  return_rate_percent: number
  efficiency_percent: number
  rank_by_revenue: number
}

/** GET /dashboard/outlets - full response */
export interface DashboardOutletKpi extends DashboardOutlet {}

export interface DashboardOutletsResponse {
  outlets: DashboardOutlet[]
  date_from: string
  date_to: string
  total_records: number
  top_by_revenue: DashboardOutlet[]
  bottom_by_efficiency: DashboardOutlet[]
}

/** GET /dashboard/products - single product */
export interface DashboardProduct {
  product_id: number
  sku: string
  name: string
  category: string
  supply: number
  returned: number
  sold: number
  revenue: number
  efficiency_percent: number
  rank_by_sold: number
}

/** GET /dashboard/products - full response */
export interface DashboardProductsResponse {
  all_products: DashboardProduct[]
  date_from: string
  date_to: string
  total_records: number
  top_sellers: DashboardProduct[]
  slow_movers: DashboardProduct[]
}

export interface DashboardProductKpi extends DashboardProduct {}

/** GET /dashboard/sales - single sales person */
export interface DashboardSalesPerson {
  sales_id: number
  sales_name: string
  username: string
  outlet_count: number
  supply: number
  returned: number
  sold: number
  revenue: number
  return_rate_percent: number
  efficiency_percent: number
  rank_by_revenue: number
}

/** GET /dashboard/sales - full response */
export interface DashboardSalesResponse {
  sales_people: DashboardSalesPerson[]
  date_from: string
  date_to: string
  total_records: number
  top_performers: DashboardSalesPerson[]
}

export interface DashboardSalesKpi extends DashboardSalesPerson {}

/** GET /dashboard/areas - single area */
export interface DashboardArea {
  area_id: number
  area_name: string
  outlet_count: number
  supply: number
  returned: number
  sold: number
  revenue: number
  return_rate_percent: number
  efficiency_percent: number
  rank_by_revenue: number
}

/** GET /dashboard/areas - full response */
export interface DashboardAreasResponse {
  areas: DashboardArea[]
  date_from: string
  date_to: string
  total_records: number
  top_by_revenue: DashboardArea[]
}

export interface DashboardAreaKpi extends DashboardArea {}

/** GET /dashboard/analytics/revenue-trend */
export interface RevenueTrendDataPoint {
  date: string
  [key: string]: string | number // outlet names or sales names as keys
}

export interface RevenueTrendResponse {
  period: 'daily' | 'monthly' | 'yearly'
  date_from: string
  date_to: string
  entity_type: 'outlets' | 'sales'
  data: RevenueTrendDataPoint[]
  summary: Record<string, number>
}

/** GET /dashboard/performance/outlets/{outlet_id} */
export interface DashboardPerformanceOutlet {
  outlet_id: number
  outlet_name: string
  sales_area: string
  sales_area_id: number
  supply: number
  retur: number
  sold_qty: number
  revenue: number
  stock: number
  sell_through: number
}

/** Nested outlet in performance/sales */
export interface DashboardPerformanceSalesOutlet {
  outlet_id: number
  outlet_name: string
  sales_area: string
  sold_qty: number
  revenue: number
  sell_through: number
}

/** GET /dashboard/performance/sales/{sales_id} */
export interface DashboardPerformanceSales {
  sales_id: number
  sales_name: string
  username: string
  outlet_count: number
  total_supply: number
  total_retur: number
  total_sold_qty: number
  total_revenue: number
  sell_through: number
  outlets: DashboardPerformanceSalesOutlet[]
}

/** GET /outlets — for map markers */
export interface MasterOutlet {
  id: number
  outlet_name: string
  outlet_type?: string
  sales_area?: string
  address?: string
  latitude?: string | number | null
  longitude?: string | number | null
  gmaps_url?: string | null
  status?: boolean
}

// ============================================================================
// NEW TYPES FOR NEW API ENDPOINTS
// ============================================================================

/** Query parameters for date range filtering */
export interface DateRangeParams {
  date_from?: string // YYYY-MM-DD
  date_to?: string // YYYY-MM-DD
}

/** Pagination info in responses */
export interface PaginationInfo {
  total_count: number
  current_page: number
  total_pages: number
  page_size: number
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  code: number
  data: T
  message?: string
  pagination?: PaginationInfo
}

/** GET /dashboard/performance/outlets/{outlet_id} — Outlet detail with product breakdown */
export interface OutletDetailResponse {
  outlet_id: number
  outlet_name: string
  sales_area: string | null
  total_supply: number
  total_returned: number
  total_sold: number
  total_revenue: number
  current_stock: number
  return_rate_percent: number
  efficiency_percent: number
  rank_by_revenue?: number
  date_from: string
  date_to: string
  product_breakdown: ProductDetail[]
  top_products: ProductDetail[]
}

export interface ProductDetail {
  product_id: number
  product_name?: string
  name?: string
  sku: string
  category?: string
  supply?: number
  total_supply?: number
  returned?: number
  total_returned?: number
  sold?: number
  total_sold?: number
  revenue?: number
  total_revenue?: number
  efficiency_percent: number
  return_rate_percent?: number
  current_stock?: number
}

/** GET /dashboard/performance/sales/{sales_id} — Sales detail with outlets breakdown */
export interface SalesDetailResponse {
  sales_id: number
  sales_name: string
  username: string
  outlet_count: number
  total_supply: number
  total_returned: number
  total_sold: number
  total_revenue: number
  return_rate_percent: number
  efficiency_percent: number
  rank_by_revenue?: number
  date_from: string
  date_to: string
  outlets_breakdown: OutletBreakdown[]
  top_outlets: OutletBreakdown[]
}

export interface OutletBreakdown {
  outlet_id: number
  outlet_name: string
  sales_area: string | null
  supply?: number
  total_supply?: number
  returned?: number
  total_returned?: number
  sold?: number
  total_sold?: number
  revenue?: number
  total_revenue?: number
  efficiency_percent: number
  return_rate_percent?: number
}

/** GET /dashboard/analytics/revenue-trend */
export interface RevenueTrendResponse {
  period: 'daily' | 'monthly' | 'yearly'
  entity_type: 'outlets' | 'sales'
  date_from: string
  date_to: string
  data: TrendPoint[]
  summary: Record<string, number>
}

export interface TrendPoint {
  date: string
  [key: string]: string | number // entity names as keys with revenue values
}
