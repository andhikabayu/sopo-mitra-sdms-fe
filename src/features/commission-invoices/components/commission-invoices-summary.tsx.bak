"use client"

import { KpiStatCard } from '@/features/dashboard/components/kpi-stat-card'
import { useSalesSummary } from '@/features/commission-invoices'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { formatCurrency } from '@/lib/utils/format'

export function CommissionInvoicesSummary() {
  const { user } = useAuth()
  const salesId = user?.id
  const { data, isLoading } = useSalesSummary(salesId, Boolean(salesId))

  const totalInvoiced = Number((data && (data as any).total_invoiced) ?? 0)
  const totalPaid = Number((data && (data as any).total_paid) ?? 0)
  const outstandingAmount = Number((data && (data as any).outstanding_amount) ?? 0)
  const invoiceCount = Number((data && (data as any).invoice_count) ?? 0)
  const outstandingInvoice = (data && (data as any).outstanding_invoice) ?? null
  const lastPayment = (data && (data as any).last_payment) ?? null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiStatCard label="Total Invoiced" value={formatCurrency(totalInvoiced)} hint="Sum of all invoices" icon={() => null as any} accent="primary" />
      <KpiStatCard label="Total Paid" value={formatCurrency(totalPaid)} hint="Sum of paid invoices" icon={() => null as any} accent="success" />
      <KpiStatCard label="Outstanding" value={formatCurrency(outstandingAmount)} hint="Unpaid amount" icon={() => null as any} accent="destructive" />

      <KpiStatCard label="Invoice Count" value={String(invoiceCount)} hint="Total invoices" icon={() => null as any} accent="muted" />
      <KpiStatCard label="Outstanding Invoice" value={String(outstandingInvoice ?? '-')} hint="Oldest unpaid invoice" icon={() => null as any} accent="warning" />
      <KpiStatCard label="Last Payment" value={lastPayment ? String(lastPayment) : '-'} hint="Most recent payment date" icon={() => null as any} accent="muted" />
    </div>
  )
}

export default CommissionInvoicesSummary
