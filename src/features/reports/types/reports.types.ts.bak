/** Reports API Types */

export interface PaginationInfo {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

/** =========================================================================== */
/** TRANSACTION-LEVEL REPORTS */
/** =========================================================================== */

/** GET /reports/transactions */
export interface TransactionReport {
  id: number
  audit_id: number
  outlet_id: number
  outlet_name: string
  product_id: number
  product_name: string
  product_sku: string
  product_unit: string
  quantity_supplied: number
  quantity_returned: number
  quantity_sold: number
  revenue: number
  supply_date: string | null
  retur_date: string | null
  transaction_date: string
  source_document: string
}

/** GET /reports/sales — Sales aggregate report */
export interface SalesAggregateReport {
  outlet_id: number
  outlet_name: string
  sales_id: number
  sales_name: string
  total_supply: number
  total_returned: number
  total_sold: number
  total_revenue: number
  current_stock: number
  return_rate_percent: number
  efficiency_percent: number
}

/** GET /reports/supplies */
export interface SupplyReport {
  supply_no: string
  outlet_id: number
  outlet_name: string
  sales_id: number
  sales_name: string
  total_quantity: number
  total_amount: number
  items_count: number
  supply_date: string
  status: boolean
}

/** GET /reports/returns */
export interface ReturnReport {
  return_no: string
  outlet_id: number
  outlet_name: string
  product_id: number
  product_name: string
  product_sku: string
  quantity_returned: number
  return_reason: string
  return_date: string
}

/** GET /reports/performance — Comprehensive performance metrics */
export interface PerformanceReport {
  store_performance: StorePerformanceItem[]
  sales_performance: SalesPerformanceItem[]
  top_outlets_by_revenue: TopPerformer[]
  top_sales_by_revenue: TopPerformer[]
  bottom_outlets_by_efficiency: BottomPerformer[]
  bottom_sales_by_efficiency: BottomPerformer[]
}

export interface StorePerformanceItem {
  outlet_id: number
  outlet_name: string
  total_revenue: number
  total_quantity_supplied: number
  total_quantity_returned: number
  total_quantity_sold: number
  stock_turnover_rate: number
  retur_rate_percent: number
  rank_by_revenue: number
  rank_by_efficiency: number
}

export interface SalesPerformanceItem {
  sales_id: number
  sales_name: string
  total_revenue: number
  total_quantity_supplied: number
  total_quantity_returned: number
  total_quantity_sold: number
  number_of_outlets_served: number
  average_revenue_per_outlet: number
  retur_rate_percent: number
  stock_efficiency_percent: number
  rank_by_revenue: number
  rank_by_efficiency: number
}

export interface TopPerformer {
  name: string
  total_revenue: number
  rank: number
}

export interface BottomPerformer {
  name: string
  efficiency_percent: number
  rank: number
}

/** =========================================================================== */
/** KPI REPORTS (Dashboard endpoints reused for KPI pages) */
/** =========================================================================== */

/** GET /dashboard/products → Products KPI Report */
export interface ProductKPIReport {
  product_id: number
  sku: string
  name: string
  category: string
  total_supply: number
  total_returned: number
  total_sold: number
  total_revenue: number
  efficiency_percent: number
  return_rate_percent?: number
}

/** GET /reports/performance → Outlets KPI Report */
export interface OutletKPIReport {
  outlet_id: number
  outlet_name: string
  total_revenue: number
  total_quantity_supplied: number
  total_quantity_returned: number
  total_quantity_sold: number
  stock_turnover_rate: number
  retur_rate_percent: number
  rank_by_revenue: number
  rank_by_efficiency: number
}

/** GET /reports/performance → Sales KPI Report */
export interface SalesKPIReport {
  sales_id: number
  sales_name: string
  total_revenue: number
  total_quantity_supplied: number
  total_quantity_returned: number
  total_quantity_sold: number
  number_of_outlets_served: number
  average_revenue_per_outlet: number
  retur_rate_percent: number
  stock_efficiency_percent: number
  rank_by_revenue: number
  rank_by_efficiency: number
}

/** GET /dashboard/areas → Areas KPI Report */
export interface AreaKPIReport {
  area: string
  total_supply: number
  total_returned: number
  total_sold: number
  total_revenue: number
  efficiency_percent: number
  return_rate_percent: number
}

/** Report query parameters */
export interface ReportParams {
  date_from?: string // YYYY-MM-DD
  date_to?: string // YYYY-MM-DD
  outlet_id?: number
  sales_id?: number
  product_id?: number
  page?: number
  page_size?: number
  export?: 'excel'
}

/** Report API response wrapper */
export interface ReportResponse<T> {
  code: number
  data: T
  message?: string
  pagination?: PaginationInfo
}
