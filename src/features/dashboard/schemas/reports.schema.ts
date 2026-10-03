import { z } from 'zod'
import { PaginationInfoSchema } from './dashboard.schema'

const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

/**
 * Reports Query Parameters
 */

export const ReportParamsSchema = z.object({
  date_from: DateSchema.optional(),
  date_to: DateSchema.optional(),
  outlet_id: z.number().optional(),
  sales_id: z.number().optional(),
  product_id: z.number().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  export: z.literal('excel').optional(),
})

/**
 * Reports Response Schemas
 */

export const TransactionReportSchema = z.object({
  transaction_id: z.number(),
  date: DateSchema,
  outlet_id: z.number(),
  outlet_name: z.string(),
  sales_id: z.number(),
  sales_name: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  transaction_type: z.enum(['SUPPLY', 'SALE', 'RETURN']),
  quantity: z.number(),
  unit_price: z.number(),
  total_value: z.number(),
})

export const SalesAggregateReportSchema = z.object({
  outlet_id: z.number(),
  outlet_name: z.string(),
  sales_id: z.number(),
  sales_name: z.string(),
  total_supply: z.number(),
  total_returned: z.number(),
  total_sold: z.number(),
  total_revenue: z.number(),
  current_stock: z.number(),
  return_rate_percent: z.number(),
  efficiency_percent: z.number(),
})

export const SupplyReportSchema = z.object({
  supply_id: z.number(),
  date: DateSchema,
  outlet_id: z.number(),
  outlet_name: z.string(),
  sales_id: z.number(),
  sales_name: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
  total_value: z.number(),
  notes: z.string().optional(),
})

export const ReturnReportSchema = z.object({
  return_id: z.number(),
  date: DateSchema,
  outlet_id: z.number(),
  outlet_name: z.string(),
  sales_id: z.number(),
  sales_name: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
  total_value: z.number(),
  reason: z.string().optional(),
})

export const PerformanceReportSchema = z.object({
  store_performance: z.array(
    z.object({
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
    }),
  ),
  sales_performance: z.array(
    z.object({
      sales_id: z.number(),
      sales_name: z.string(),
      username: z.string(),
      outlet_count: z.number(),
      total_supply: z.number(),
      total_returned: z.number(),
      total_sold: z.number(),
      total_revenue: z.number(),
      return_rate_percent: z.number(),
      efficiency_percent: z.number(),
    }),
  ),
  top_outlets_by_revenue: z.array(
    z.object({
      name: z.string(),
      total_revenue: z.number(),
      rank: z.number(),
    }),
  ),
  top_sales_by_revenue: z.array(
    z.object({
      name: z.string(),
      total_revenue: z.number(),
      rank: z.number(),
    }),
  ),
  bottom_outlets_by_efficiency: z.array(
    z.object({
      name: z.string(),
      efficiency_percent: z.number(),
      rank: z.number(),
    }),
  ),
  bottom_sales_by_efficiency: z.array(
    z.object({
      name: z.string(),
      efficiency_percent: z.number(),
      rank: z.number(),
    }),
  ),
})

export const ReportResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.number(),
    data: dataSchema,
    message: z.string().optional(),
    pagination: PaginationInfoSchema.optional(),
  })
