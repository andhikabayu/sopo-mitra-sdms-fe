import type { SalesPayout } from './commissions.api'

const sample: SalesPayout = {
  sales_id: 7,
  sales_name: 'Budi',
  period: 'monthly',
  start_date: '2026-06-01T00:00:00',
  end_date: '2026-06-30T00:00:00',
  total_units: 62,
  total_revenue: 1240000,
  commission_rate: 0.1,
  commission_amount: 124000,
  payout_amount: 124000,
  breakdown: [
    { outlet_id: 10, outlet_name: 'Toko A', units: 40, revenue: 800000 },
    { outlet_id: 11, outlet_name: 'Toko B', units: 22, revenue: 440000 },
  ],
}

export const mockCommissionsApi = {
  async getSalesPayout(_salesId: number) {
    return new Promise<SalesPayout>((resolve) => setTimeout(() => resolve(sample), 200))
  },
}
