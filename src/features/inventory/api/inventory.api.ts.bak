import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import { env } from '@/config/env'
import type { ApiEnvelope } from '@/types/api'
import { mockInventoryApi } from './inventory.mock'

// Estimated revenue shapes (existing)
export interface EstimatedRevenueItem {
  product_id: number
  product_name: string
  sku: string
  quantity: number
  unit_price: number
  estimated_revenue: number
}

export interface RefundBreakdownItem {
  product_id: number
  product_name: string
  quantity: number
  loss: number
}

export interface EstimatedRevenueByOutlet {
  outlet_id: number
  outlet_name: string
  total_estimated_revenue: number
  total_refund_loss: number
  net_estimated_revenue: number
  breakdown: EstimatedRevenueItem[]
  refund_breakdown: RefundBreakdownItem[]
}

// Inventory list item (from GET /inventory and GET /inventory/outlet/{id})
export interface InventoryItem {
  id: number
  outlet_id: number
  outlet_name: string
  product_id: number
  product_name: string
  sku: string
  quantity: number
  updatedAt: string
}

// Inventory totals (analytics)
export interface InventoryTotals {
  total_outlets: number
  total_products: number
  total_outlet_stock: number
}

export interface SalesOutletDetail {
  id: number
  outlet_name: string
  outlet_type?: string
  pic_name?: string
  phone_number?: string
  city?: string
  district?: string
  sub_district?: string
  sales_area?: string
  address?: string
  status?: boolean | string
}

export interface SalesTotalOutletResponse {
  total_outlets: number
  outlets: SalesOutletDetail[]
}

// Sales-held aggregation item (GET /inventory/sales)
export interface SalesInventoryAggregationItem {
  sales_id: number
  sales_name: string
  product_id: number
  product_name: string
  sku: string
  approved_qty: number
  supplied_qty: number
  held_qty: number
  in_sales_inventory: number
}

// Sales-held per-sales item (GET /inventory/sales/{sales_id})
export interface SalesInventoryItem {
  id: number
  sales_id: number
  product_id: number
  product_name: string
  sku: string
  held_qty: number
  quantity_with_sales: number
  updatedAt: string
}

// Inventory audit item
export interface InventoryAuditItem {
  id: number
  source_type: string
  source_id: number | null
  sales_id: number | null
  outlet_id: number | null
  product_id: number
  product_name: string
  delta: number
  before_qty: number
  after_qty: number
  note: string | null
  createdBy: string
  createdAt: string
}

const realApi = {
  // Existing estimated revenue endpoints (keep for compatibility)
  async getEstimatedByOutlet(outletId: number): Promise<EstimatedRevenueByOutlet> {
    const { data } = await apiClient.get<ApiEnvelope<EstimatedRevenueByOutlet>>(API_ROUTES.inventory.estimatedByOutlet(outletId))
    return data.data
  },

  async getEstimatedAll(): Promise<EstimatedRevenueByOutlet[]> {
    const { data } = await apiClient.get<ApiEnvelope<EstimatedRevenueByOutlet[]>>(API_ROUTES.inventory.estimated)
    return data.data
  },

  async getTotals(): Promise<InventoryTotals> {
    const { data } = await apiClient.get<ApiEnvelope<InventoryTotals>>(API_ROUTES.inventory.totals)
    return data.data
  },

  async getSalesTotalOutlets(): Promise<SalesTotalOutletResponse> {
    const { data } = await apiClient.get<ApiEnvelope<SalesTotalOutletResponse>>(API_ROUTES.outlets.getTotalSalesOutlet)
    return data.data
  },

  // New: list all inventory items (GET /inventory)
  async getAllInventory(params?: { limit?: number; offset?: number; name?: string }): Promise<InventoryItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<InventoryItem[]>>(API_ROUTES.inventory.list, { params })
    return data.data
  },

  // New: inventory by outlet (GET /inventory/outlet/{outlet_id})
  async getInventoryByOutlet(outletId: number): Promise<InventoryItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<InventoryItem[]>>(API_ROUTES.inventory.byOutlet(outletId))
    return data.data
  },

  // New: aggregated inventory per sales (GET /inventory/sales)
  async getSalesAggregated(params?: { sales_id?: number; product_id?: number; min_held?: number; limit?: number; offset?: number }): Promise<SalesInventoryAggregationItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<SalesInventoryAggregationItem[]>>(API_ROUTES.inventory.sales, { params })
    return data.data
  },

  // New: per-sales inventory (GET /inventory/sales/{sales_id})
  async getSalesById(salesId: number): Promise<SalesInventoryItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<SalesInventoryItem[]>>(API_ROUTES.inventory.salesById(salesId))
    return data.data
  },

  // New: inventory audit log (GET /inventory/audit)
  async getAudit(params?: { sales_id?: number; product_id?: number; source_type?: string; limit?: number; offset?: number }): Promise<InventoryAuditItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<InventoryAuditItem[]>>(API_ROUTES.inventory.audit, { params })
    return data.data
  },

  // New: summary for a product (GET /inventory/summary/product/{product_id})
  async getSummaryByProduct(productId: number): Promise<{ product_id: number; product_name: string; sku: string; total_outlet_stock: number; total_with_sales: number }> {
    const { data } = await apiClient.get<ApiEnvelope<{ product_id: number; product_name: string; sku: string; total_outlet_stock: number; total_with_sales: number }>>(API_ROUTES.inventory.summaryByProduct(productId))
    return data.data
  },
}

export const inventoryApi = env.NEXT_PUBLIC_ENABLE_MOCK_AUTH ? mockInventoryApi : realApi

// note: types exported above
