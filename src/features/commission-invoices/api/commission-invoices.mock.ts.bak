import type { CommissionInvoice } from './commission-invoices.api'

const sampleInvoice: CommissionInvoice = {
  id: 1,
  sales_id: 7,
  sales_name: 'John Sales',
  start_date: '2026-06-01',
  end_date: '2026-06-30',
  items: [
    { outlet_id: 1, outlet_name: 'Toko A', units: 50, revenue: 1000000 },
    { outlet_id: 2, outlet_name: 'Toko B', units: 20, revenue: 400000 },
  ],
  total_units: 70,
  total_revenue: 1400000,
  commission_rate: 0.02,
  commission_amount: 28000,
  paid: false,
  paid_at: null,
  sales_total_unpaid: 1400000,
}

export const mockCommissionInvoicesApi = {
  async generate(_body: { sales_id: number; start_date: string; end_date: string }) {
    return new Promise<CommissionInvoice>((resolve) => setTimeout(() => resolve(sampleInvoice), 200))
  },
  async list(_params?: Record<string, unknown>) {
    return new Promise<CommissionInvoice[]>((resolve) => setTimeout(() => resolve([sampleInvoice]), 200))
  },
  async getById(id: number) {
    return new Promise<CommissionInvoice>((resolve) => setTimeout(() => resolve({ ...sampleInvoice, id }), 200))
  },
  async pay(_invoiceId: number) {
    return new Promise<{ success: boolean; invoice_id: number }>((resolve) =>
      setTimeout(() => resolve({ success: true, invoice_id: sampleInvoice.id }), 200),
    )
  },
  async salesSummary(_salesId: number) {
    return new Promise<Record<string, unknown>>((resolve) =>
      setTimeout(() =>
        resolve({
          sales_id: sampleInvoice.sales_id,
          total_invoiced: sampleInvoice.total_revenue,
          total_paid: 0,
          outstanding_amount: sampleInvoice.total_revenue,
          invoice_count: 1,
          outstanding_invoice: sampleInvoice.id,
          last_payment: null,
        }),
      200),
    )
  },
}
