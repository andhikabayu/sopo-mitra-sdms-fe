"use client"

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FiX } from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Modal } from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast'
import { useCommissionInvoiceById, useCommissionInvoicePay } from '@/features/commission-invoices'
import { usePermissions } from '@/features/roles'
import { RBAC } from '@/config/rbac'
import { parseApiError } from '@/lib/api/error'
import { formatCurrency, formatDate, formatNumber, formatPercent } from '@/lib/utils/format'
import type { CommissionInvoiceDetail } from '@/features/commission-invoices/api/commission-invoices.api'

export function CommissionInvoiceDetailModal({ open, onClose, invoiceId }: { open: boolean; onClose: () => void; invoiceId?: number }) {
  const { data, isLoading, isError, error } = useCommissionInvoiceById(invoiceId, Boolean(invoiceId) && open)
  const payMut = useCommissionInvoicePay()
  const { canPerform } = usePermissions()
  const canPay = canPerform([RBAC.MANAGER, RBAC.SUPER_ADMIN])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const qc = useQueryClient()
  const { push } = useToast()

  const invoice: CommissionInvoiceDetail | undefined = data
  const apiError = isError && error ? parseApiError(error) : null

  async function handlePay() {
    if (!invoiceId) return
    try {
      await payMut.mutateAsync(invoiceId)
      // invalidate relevant queries

      qc.invalidateQueries({ queryKey: ['commission-invoices'] })
      qc.invalidateQueries({ queryKey: ['commission-invoices', 'summary'] })
      qc.invalidateQueries({ queryKey: ['receivables'] })

      push({ title: 'Invoice marked as paid', description: `Invoice #${invoiceId} has been paid.` })

      setConfirmOpen(false)
      onClose()
    } catch (e) {
      push({ title: 'Payment failed', description: 'Unable to mark invoice as paid.' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Invoice #${invoice?.id ?? ''}`}
      description={invoice ? `${formatDate(invoice.start_date)} - ${formatDate(invoice.end_date)}` : undefined}
      size="lg"
    >
      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      ) : apiError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {apiError.message}
        </div>
      ) : !invoice ? (
        <p className="text-center text-muted-foreground">Invoice not found.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">General Information</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* <div>
                <p className="text-xs text-muted-foreground">Invoice ID</p>
                <p className="font-medium">{formatNumber(invoice.id)}</p>
              </div> */}
              {/* <div>
                <p className="text-xs text-muted-foreground">Sales ID</p>
                <p className="font-medium">{formatNumber(invoice.sales_id)}</p>
              </div> */}
              <div>
                <p className="text-xs text-muted-foreground">Sales Name</p>
                <p className="font-medium">{invoice.sales_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(invoice.start_date)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(invoice.end_date)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Commission Rate</p>
                <p className="font-medium">{formatPercent(invoice.commission_rate * 100, 0)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Units</p>
                <p className="font-medium">{formatNumber(invoice.total_units)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="font-medium">{formatCurrency(invoice.total_revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Commission Amount</p>
                <p className="font-medium">{formatCurrency(invoice.commission_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sales Total Unpaid</p>
                <p className="font-medium">{formatCurrency(invoice.sales_total_unpaid)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Status</p>
                <div className="mt-1">
                  {invoice.paid ? <Badge variant="success">Paid</Badge> : <Badge variant="warning">Unpaid</Badge>}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paid At</p>
                <p className="font-medium">{invoice.paid_at ? formatDate(invoice.paid_at) : '-'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Items</h3>
            <div className="mt-3">
              {(invoice.items ?? []).length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No data</div>
              ) : (
                <div className="overflow-x-auto rounded-md border bg-background shadow-sm">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-muted/60 text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Outlet</th>
                        <th className="px-4 py-3 font-medium">Units</th>
                        <th className="px-4 py-3 font-medium">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((it) => (
                        <tr key={it.outlet_id} className="border-t hover:bg-muted/30">
                          <td className="px-4 py-3">{it.outlet_name}</td>
                          <td className="px-4 py-3">{formatNumber(it.units)}</td>
                          <td className="px-4 py-3">{formatCurrency(it.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Units</p>
              <p className="text-lg font-semibold">{formatNumber(invoice.total_units)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-semibold">{formatCurrency(invoice.total_revenue)}</p>
            </div>
            {!invoice.paid && canPay && (
              <Button onClick={() => setConfirmOpen(true)}>Pay</Button>
            )}
          </div>

          <ConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handlePay}
            title="Mark invoice as paid"
            description="Are you sure you want to mark this invoice as paid?"
            confirmLabel="Pay"
            isLoading={payMut.isLoading}
          />
        </div>
      )}
    </Modal>
  )
}

export default CommissionInvoiceDetailModal
