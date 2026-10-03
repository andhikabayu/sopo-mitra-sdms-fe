'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { FormTextarea } from '@/components/form/form-textarea'
import type { PurchaseOrder } from '../api/purchase-orders.api'
import { usePurchaseOrderUpdate, usePurchaseOrderDelete } from '@/features/purchase-orders'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/features/roles'

export interface PurchaseOrderDetailModalProps {
  open: boolean
  onClose: () => void
  data: PurchaseOrder | null
  canApprove: boolean
}

function buildPurchaseOrderApprovalItems(items: PurchaseOrder['items']) {
  return items.map((item) => ({
    product_id: item.product_id,
    outlet_id: item.outlet_id,
    approved_qty: Number(item.approved_qty ?? item.requested_qty),
  }))
}

export default function PurchaseOrderDetailModal({ open, onClose, data, canApprove }: PurchaseOrderDetailModalProps) {
  const router = useRouter()
  const update = usePurchaseOrderUpdate()
  const del = usePurchaseOrderDelete()
  const { role } = usePermissions()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  if (!open || !data) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Purchase Order #${data.id}`}
      description={`Status: ${data.status}`}
      size="lg"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={update.isLoading || del.isLoading}>Close</Button>
          {canApprove && (
            <>
              <Button
                variant="outline"
                onClick={async () => {
                  const c = await Swal.fire({ title: 'Approve purchase order?', showCancelButton: true, icon: 'question' })
                  if (!c.isConfirmed) return
                  update.mutate({
                    id: data.id,
                    body: {
                      status: 'approved',
                      items: buildPurchaseOrderApprovalItems(data.items ?? []),
                    },
                  }, {
                    onSuccess: async () => {
                      await Swal.fire({ title: 'Approved', icon: 'success' })
                      onClose()
                    },
                    onError: async (err: any) => await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed', icon: 'error' }),
                  })
                }}
                disabled={update.isLoading}
              >
                Approve
              </Button>
              <Button variant="destructive" onClick={() => setRejectOpen(true)} disabled={update.isLoading}>Reject</Button>
            </>
          )}
          {/* Super Admin can delete from detail modal */}
          {role === 'Super Admin' && (
            <Button
              variant="destructive"
              onClick={async () => {
                const c = await Swal.fire({ title: 'Delete purchase order?', text: 'This action cannot be undone.', showCancelButton: true, icon: 'warning' })
                if (!c.isConfirmed) return
                del.mutate(Number(data.id), {
                  onSuccess: async () => {
                    await Swal.fire({ title: 'Deleted', icon: 'success' })
                    onClose()
                    // navigate back to list
                    router.push('/purchase-orders')
                  },
                  onError: async (err: any) => await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to delete', icon: 'error' }),
                })
              }}
              disabled={del.isLoading}
            >
              Delete
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Notes</h4>
          <p className="text-sm mt-1">{data.notes ?? '-'}</p>
        </div>
        <div>
          <h4 className="font-medium">Items</h4>
          <div className="mt-2 space-y-2">
            {data.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <div className="text-sm">Product: {it.product_name ?? it.product_id}</div>
                  <div className="text-xs text-muted-foreground">Outlet: {it.outlet_name ?? it.outlet_id}</div>
                </div>
                <div className="text-sm">Requested: {it.requested_qty}</div>
              </div>
            ))}
          </div>
        </div>

        {rejectOpen && (
          <div className="space-y-2">
            <FormTextarea label="Admin Notes (reason for rejection)" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={update.isLoading}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (adminNotes && adminNotes.trim().length > 0 && adminNotes.trim().length < 3) {
                    await Swal.fire({ title: 'Note too short', text: 'Please provide at least 3 characters', icon: 'warning' })
                    return
                  }
                  const c = await Swal.fire({ title: 'Reject purchase order?', showCancelButton: true, icon: 'warning' })
                  if (!c.isConfirmed) return
                  update.mutate({
                    id: data.id,
                    body: {
                      status: 'rejected',
                      admin_notes: adminNotes,
                      items: buildPurchaseOrderApprovalItems(data.items ?? []),
                    },
                  }, {
                    onSuccess: async () => {
                      await Swal.fire({ title: 'Rejected', icon: 'success' })
                      setRejectOpen(false)
                      onClose()
                    },
                    onError: async (err: any) => await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed', icon: 'error' }),
                  })
                }}
                disabled={update.isLoading}
              >
                Reject Purchase Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
