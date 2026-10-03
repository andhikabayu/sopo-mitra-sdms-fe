/** Reports API Types */

import type { PaginationInfo } from './dashboard.types'

/** GET /reports/transactions */
export interface TransactionReport {
  transaction_id: number
  date: string
  outlet_id: number
  outlet_name: string
  sales_id: number
  sales_name: string
  product_id: number
  product_name: string
  transaction_type: 'SUPPLY' | 'SALE' | 'RETURN'
  quantity: number
  unit_price: number
  total_value: number
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
  supply_id: number
  date: string
  outlet_id: number
  outlet_name: string
  sales_id: number
  sales_name: string
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_value: number
  notes?: string
}

/** GET /reports/returns */
export interface ReturnReport {
  return_id: number
  date: string
  outlet_id: number
  outlet_name: string
  sales_id: number
  sales_name: string
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  total_value: number
  reason?: string
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
  sales_area: string
  total_supply: number
  total_returned: number
  total_sold: number
  total_revenue: number
  current_stock: number
  return_rate_percent: number
  efficiency_percent: number
}

export interface SalesPerformanceItem {
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
