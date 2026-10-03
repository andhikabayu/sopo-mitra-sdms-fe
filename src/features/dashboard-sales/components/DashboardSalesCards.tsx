'use client'

import { FiDollarSign, FiUsers } from 'react-icons/fi'
import { KpiStatCard } from '@/features/dashboard/components/kpi-stat-card'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import type { SalesPayout } from '@/features/commissions/api/commissions.api'

export function DashboardSalesCards({ payout }: { payout: SalesPayout }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard label="Payout" value={formatCurrency(payout.payout_amount ?? 0)} hint="Net payout (monthly)" icon={FiDollarSign} accent="primary" />
      <KpiStatCard label="Commission" value={formatCurrency(payout.commission_amount ?? 0)} hint="Total commission" icon={FiDollarSign} accent="success" />
      <KpiStatCard label="Units" value={formatNumber(payout.total_units)} hint="Units sold" icon={FiUsers} accent="muted" />
      <KpiStatCard label="Revenue" value={formatCurrency(payout.total_revenue)} hint="Total revenue" icon={FiDollarSign} accent="muted" />
    </div>
  )
}
