'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FiEye } from 'react-icons/fi'
import { Spinner } from '@/components/ui/spinner'
import { useCommissionInvoicesList } from '@/features/commission-invoices'
import CommissionInvoicesSummary from '@/features/commission-invoices/components/commission-invoices-summary'
import GenerateInvoiceModal from '@/features/commission-invoices/components/generate-invoice-modal'
import CommissionInvoiceDetailModal from '@/features/commission-invoices/components/commission-invoice-detail-modal'
import { DataTable } from '@/components/data-table/data-table'
import { usePermissions } from '@/features/roles'
import { RBAC } from '@/config/rbac'

export default function CommissionInvoicesPage() {
  const { data = [], isLoading } = useCommissionInvoicesList()
  const { canPerform } = usePermissions()
  const canGenerate = canPerform([RBAC.MANAGER, RBAC.SUPER_ADMIN])
  const [openGenerate, setOpenGenerate] = useState(false)
  const [openDetailId, setOpenDetailId] = useState<number | undefined>(undefined)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CommissionInvoicesSummary />
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Commission Invoices</h1>
            <p className="text-muted-foreground mt-2">Generate and manage commission invoices</p>
          </div>
          {/* Show Generate only to Manager and Super Admin */}
          {canGenerate && (
            <Button onClick={() => setOpenGenerate(true)}>Generate Invoice</Button>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'sales_id', label: 'Sales ID' },
                { key: 'period', label: 'Period' },
                { key: 'total_revenue', label: 'Total Revenue' },
                { key: 'total_units', label: 'Units' },
                { key: 'paid', label: 'Status' },
              ]}
              data={(data || []).map((inv: any) => ({
                ...inv,
                period: `${new Date(inv.start_date).toLocaleDateString('id-ID')} - ${new Date(inv.end_date).toLocaleDateString('id-ID')}`,
                total_revenue: `Rp ${inv.total_revenue?.toLocaleString('id-ID') || 0}`,
                paid: inv.paid ? 'Paid' : 'Unpaid',
              }))}
              isLoading={isLoading}
              renderActions={(row: any) => (
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="View invoice" onClick={() => setOpenDetailId(row.id)}>
                    <FiEye className="h-4 w-4" />
                  </Button>
              )}
              getRowId={(r) => r.id}
            />
          </div>
        </div>

        {data?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No commission invoices found</p>
            {canGenerate && (
                <Button onClick={() => setOpenGenerate(true)}>Generate First Invoice</Button>
            )}
          </div>
        )}
      <GenerateInvoiceModal open={openGenerate} onClose={() => setOpenGenerate(false)} />
      <CommissionInvoiceDetailModal open={Boolean(openDetailId)} invoiceId={openDetailId} onClose={() => setOpenDetailId(undefined)} />
    </div>
  )
}
