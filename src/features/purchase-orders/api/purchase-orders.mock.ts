import type { PurchaseOrder, PurchaseOrderApprovalPayload, PurchaseOrderItem } from './purchase-orders.api'

const samplePO: PurchaseOrder = {
  id: 1,
  sales_id: 2,
  status: 'pending',
  notes: 'Permintaan beli untuk didistribusikan ke outlet',
  admin_notes: null as any,
  items: [
    { product_id: 10, outlet_id: 1, requested_qty: 100, approved_qty: 80 },
    { product_id: 11, outlet_id: 2, requested_qty: 50, approved_qty: 50 },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockPurchaseOrdersApi = {
  async create(body: { notes: string; items: PurchaseOrderItem[] }) {
    return {
      ...samplePO,
      id: Math.random(),
      notes: body.notes,
      items: body.items,
    }
  },

  async list(params?: Record<string, unknown>) {
    return [samplePO]
  },

  async getById(id: number) {
    return { ...samplePO, id }
  },

  async update(id: number, body: PurchaseOrderApprovalPayload) {
    return { ...samplePO, ...body, id }
  },

  async delete(id: number) {
    return { id }
  },

  async getAnalytics(id: number, params?: Record<string, unknown>) {
    return {
      outlet_summaries: [
        { outlet_id: 1, outlet_name: 'Toko A', actual_sales: 50, revenue: 500000 },
      ],
    }
  },
}

export default mockPurchaseOrdersApi
