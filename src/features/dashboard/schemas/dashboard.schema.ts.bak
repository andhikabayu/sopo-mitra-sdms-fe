import { z } from 'zod'

// Date validation schema
const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

/**
 * Dashboard Query Parameters Schemas
 */

export const DateRangeParamsSchema = z.object({
  date_from: DateSchema.optional(),
  date_to: DateSchema.optional(),
})

export const RevenueTrendParamsSchema = DateRangeParamsSchema.extend({
  period: z.enum(['daily', 'monthly', 'yearly']).optional(),
  entity_type: z.enum(['outlets', 'sales']).optional(),
})

/**
 * Dashboard Response Schemas
 */

export const DashboardSummarySchema = z.object({
  total_supply: z.number(),
  total_returned: z.number(),
  total_sold: z.number(),
  total_revenue: z.number(),
  current_stock: z.number(),
  return_rate_percent: z.number(),
  efficiency_percent: z.number(),
  total_outlets: z.number(),
  total_products: z.number(),
  total_sales_reps: z.number(),
  avg_revenue_per_outlet: z.number(),
  // Legacy fields
  total_retur: z.number().optional(),
  total_actual_sales: z.number().optional(),
  total_stock: z.number().optional(),
  sell_through: z.number().optional(),
})

export const DashboardOutletKpiSchema = z.object({
  outlet_id: z.number(),
  outlet_name: z.string(),
  sales_area: z.string(),
  total_supply: z.number(),
  total_returned: z.number(),
  total_sold: z.number(),
  total_revenue: z.number(),
  current_stock: z.number(),
  return_rate_percent: z.number(),
  efficiency_percent: z.number(),
  rank_by_revenue: z.number().optional(),
  // Legacy
  supply: z.number().optional(),
  retur: z.number().optional(),
  actual_sales: z.number().optional(),
  revenue: z.number().optional(),
  stock: z.number().optional(),
  sell_through: z.number().optional(),
})

export const PaginationInfoSchema = z.object({
  total_count: z.number(),
  current_page: z.number(),
  total_pages: z.number(),
  page_size: z.number(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.number(),
    data: dataSchema,
    message: z.string().optional(),
    pagination: PaginationInfoSchema.optional(),
  })
