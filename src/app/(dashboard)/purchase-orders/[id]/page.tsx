'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePurchaseOrderDetail, usePurchaseOrderUpdate } from '@/features/purchase-orders'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/features/roles'
import { RBAC } from '@/config/rbac'
import { Modal } from '@/components/ui/modal'
import { FormTextarea } from '@/components/form/form-textarea'
import Swal from 'sweetalert2'

function buildPurchaseOrderApprovalItems(items: NonNullable<ReturnType<typeof usePurchaseOrderDetail>['data']>['items']) {
  return items.map((item) => ({
    product_id: item.product_id,
    outlet_id: item.outlet_id,
    approved_qty: Number(item.approved_qty ?? item.requested_qty),
  }))
}

export default function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const { data, isLoading, isError } = usePurchaseOrderDetail(Number(id))
  const { canPerform } = usePermissions()
  const update = usePurchaseOrderUpdate()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    if (isError) {
      // If not found or error, go back to list
      router.push('/purchase-orders')
    }
  }, [isError, router])

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Not found</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Order #{data.id}</h1>
          <p className="text-muted-foreground">Status: {data.status}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/purchase-orders')}>Back</Button>
          {canPerform([RBAC.MANAGER, RBAC.SUPER_ADMIN]) && (
            <>
              <Button
                variant="outline"
                onClick={async () => {
                  const confirmed = await Swal.fire({ title: 'Approve purchase order?', showCancelButton: true, icon: 'question' })
                  if (!confirmed.isConfirmed) return
                  update.mutate(
                    {
                      id: data.id,
                      body: {
                        status: 'approved',
                        items: buildPurchaseOrderApprovalItems(data.items ?? []),
                      },
                    },
                    {
                      onSuccess: async () => {
                        await Swal.fire({ title: 'Approved', icon: 'success' })
                        router.push('/purchase-orders')
                      },
                      onError: async (err: any) => {
                        await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to approve', icon: 'error' })
                      },
                    },
                  )
                }}
                disabled={update.isLoading}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => setRejectOpen(true)}
                disabled={update.isLoading}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-card p-4 rounded">
          <h3 className="font-medium">Notes</h3>
          <p className="text-sm mt-2">{data.notes ?? '-'}</p>
        </div>

        <div className="bg-card p-4 rounded">
          <h3 className="font-medium">Items</h3>
          <div className="mt-2 space-y-2">
            {data.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <div className="text-sm">Product: {it.product_name ?? it.product_id}</div>
                  <div className="text-xs text-muted-foreground">Outlet: {it.outlet_name ?? it.outlet_id}</div>
                </div>
                <div className="text-sm">Qty: {it.requested_qty ?? it.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Purchase Order"
        description="Provide admin notes (optional) before rejecting the purchase order."
        size="md"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setRejectOpen(false)} disabled={update.isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                // basic validation: if note provided, require at least 3 chars
                if (adminNotes && adminNotes.trim().length > 0 && adminNotes.trim().length < 3) {
                  await Swal.fire({ title: 'Note too short', text: 'Please provide at least 3 characters for admin notes.', icon: 'warning' })
                  return
                }
                const confirmed = await Swal.fire({ title: 'Reject purchase order?', showCancelButton: true, icon: 'warning' })
                if (!confirmed.isConfirmed) return
                update.mutate(
                  {
                    id: data.id,
                    body: {
                      status: 'rejected',
                      admin_notes: adminNotes,
                      items: buildPurchaseOrderApprovalItems(data.items ?? []),
                    },
                  },
                  {
                    onSuccess: async () => {
                      setRejectOpen(false)
                      await Swal.fire({ title: 'Rejected', icon: 'success' })
                      router.push('/purchase-orders')
                    },
                    onError: async (err: any) => {
                      await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to reject', icon: 'error' })
                    },
                  },
                )
              }}
              isLoading={update.isLoading}
            >
              Reject Purchase Order
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <FormTextarea label="Admin Notes" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}
