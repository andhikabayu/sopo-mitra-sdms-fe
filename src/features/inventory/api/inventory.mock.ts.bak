import type { EstimatedRevenueByOutlet, SalesTotalOutletResponse } from './inventory.api'

const sampleOutlet: EstimatedRevenueByOutlet = {
  outlet_id: 10,
  outlet_name: 'Toko A',
  total_estimated_revenue: 800000,
  total_refund_loss: 200000,
  net_estimated_revenue: 600000,
  breakdown: [
    {
      product_id: 1,
      product_name: 'Yogurt 200ml',
      sku: 'YGT-001',
      quantity: 40,
      unit_price: 20000,
      estimated_revenue: 800000,
    },
  ],
  refund_breakdown: [
    { product_id: 1, product_name: 'Yogurt 200ml', quantity: 10, loss: 200000 },
  ],
}

export const mockInventoryApi = {
  async getEstimatedByOutlet(outletId: number) {
    // return sample for any id for now
    return { ...sampleOutlet, outlet_id: Number(outletId), outlet_name: `Toko ${outletId}` }
  },

  async getEstimatedAll() {
    return [sampleOutlet, { ...sampleOutlet, outlet_id: 11, outlet_name: 'Toko B', total_estimated_revenue: 440000, net_estimated_revenue: 440000, total_refund_loss: 0 }]
  },

  async getTotals() {
    return {
      total_outlets: 2,
      total_products: 2,
      total_outlet_stock: 6,
    }
  },

  async getSalesTotalOutlets(): Promise<SalesTotalOutletResponse> {
    return {
      total_outlets: 2,
      outlets: [
        {
          id: 10,
          outlet_name: 'Toko A',
          outlet_type: 'Retail',
          pic_name: 'Andi',
          phone_number: '08123456789',
          city: 'Jakarta',
          district: 'Kebayoran',
          sub_district: 'Senayan',
          sales_area: 'Area 1',
          address: 'Jl. Contoh No. 1',
          status: true,
        },
        {
          id: 11,
          outlet_name: 'Toko B',
          outlet_type: 'Wholesale',
          pic_name: 'Budi',
          phone_number: '08129876543',
          city: 'Jakarta',
          district: 'Cilandak',
          sub_district: 'Lebak Bulus',
          sales_area: 'Area 2',
          address: 'Jl. Contoh No. 2',
          status: false,
        },
      ],
    }
  },

  // New mock endpoints
  async getAllInventory() {
    return [
      { id: 1, outlet_id: 10, outlet_name: 'Toko A', product_id: 1, product_name: 'Yogurt 200ml', sku: 'YGT-001', quantity: 40, updatedAt: new Date().toISOString() },
    ]
  },

  async getInventoryByOutlet(outletId: number) {
    return [
      { id: 1, outlet_id: Number(outletId), outlet_name: `Toko ${outletId}`, product_id: 1, product_name: 'Yogurt 200ml', sku: 'YGT-001', quantity: 40, updatedAt: new Date().toISOString() },
    ]
  },

  async getSalesAggregated() {
    return [
      { sales_id: 14, sales_name: 'Ardi Sales', product_id: 6, product_name: 'Yogurt Plain 250ml', sku: 'YGT-001', approved_qty: 20, supplied_qty: 10, held_qty: 10, in_sales_inventory: 10 },
    ]
  },

  async getSalesById(salesId: number) {
    return [
      { id: 1, sales_id: Number(salesId), product_id: 6, product_name: 'Yogurt Plain 250ml', sku: 'YGT-001', held_qty: 10, quantity_with_sales: 10, updatedAt: new Date().toISOString() },
    ]
  },

  async getAudit() {
    return [
      { id: 123, source_type: 'po_approval', source_id: 45, sales_id: 3, outlet_id: null, product_id: 10, product_name: 'Yogurt Plain 250ml', delta: 100, before_qty: 50, after_qty: 150, note: null, createdBy: 'manager1', createdAt: new Date().toISOString() },
    ]
  },

  async getSummaryByProduct(productId: number) {
    return { product_id: Number(productId), product_name: 'Yogurt Plain 250ml', sku: 'YGT-001', total_outlet_stock: 200, total_with_sales: 50 }
  },
}

export default mockInventoryApi
