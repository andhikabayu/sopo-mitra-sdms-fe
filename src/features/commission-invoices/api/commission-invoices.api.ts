import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import { env } from '@/config/env'
import type { ApiEnvelope } from '@/types/api'
import { mockCommissionInvoicesApi } from './commission-invoices.mock'

export interface CommissionInvoiceItem {
  outlet_id: number
  outlet_name: string
  units: number
  revenue: number
}

export interface CommissionInvoice {
  id: number
  sales_id: number
  sales_name: string
  start_date: string
  end_date: string
  items: CommissionInvoiceItem[]
  total_units: number
  total_revenue: number
  commission_rate: number
  commission_amount: number
  paid: boolean
  paid_at: string | null
  sales_total_unpaid: number
}

export type CommissionInvoiceDetail = CommissionInvoice

const realApi = {
  async generate(body: { sales_id: number; start_date: string; end_date: string }): Promise<CommissionInvoice> {
    const { data } = await apiClient.post<ApiEnvelope<CommissionInvoice>>(API_ROUTES.commissionInvoices.generate, body)
    return data.data
  },

  async list(params?: Record<string, unknown>): Promise<CommissionInvoice[]> {
    const { data } = await apiClient.get<ApiEnvelope<CommissionInvoice[]>>(API_ROUTES.commissionInvoices.base, { params })
    return data.data
  },

  async getById(id: number): Promise<CommissionInvoice> {
    const { data } = await apiClient.get<ApiEnvelope<CommissionInvoice>>(API_ROUTES.commissionInvoices.byId(id))
    return data.data
  },

  async pay(invoiceId: number): Promise<{ success: boolean; invoice_id: number }> {
    const { data } = await apiClient.post<ApiEnvelope<{ success: boolean; invoice_id: number }>>(API_ROUTES.commissionInvoices.pay(invoiceId))
    return data.data
  },

  async salesSummary(salesId: number): Promise<Record<string, unknown>> {
    const { data } = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(API_ROUTES.commissionInvoices.salesSummary(salesId))
    return data.data
  },
}

export const commissionInvoicesApi = env.NEXT_PUBLIC_ENABLE_MOCK_AUTH ? mockCommissionInvoicesApi : realApi

// types already exported via `export interface ...` above
