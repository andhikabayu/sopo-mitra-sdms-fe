'use client'

import React, { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useSalesAssignmentsBySales, useSalesList, useSalesAssignmentUnassign } from '../hooks/use-sales-assignments'
import Swal from 'sweetalert2'
import AssignSalesAreaModal from './AssignSalesAreaModal'

interface Props {
  open: boolean
  onClose: () => void
  salesId: number
}

export default function SalesDetailModal({ open, onClose, salesId }: Props) {
  const { data, isLoading, refetch } = useSalesAssignmentsBySales(salesId)
  const { data: salesMaster } = useSalesList()
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  const salesUser = useMemo(() => salesMaster?.find((s) => s.id === salesId), [salesMaster, salesId])

  const assignedAreas = data?.sales_areas ?? []
  const unassignMutation = useSalesAssignmentUnassign()

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Sales Detail"
        description="View sales information and assigned sales areas"
        size="lg"
        // footer={
        //   <div className="flex gap-2">
        //     <Button variant="outline" onClick={onClose}>
        //       Close
        //     </Button>
        //     <Button onClick={() => setIsAssignOpen(true)}>Assign Sales Area</Button>
        //   </div>
        // }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{salesUser?.name ?? '—'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{salesUser?.email ?? '—'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Role</div>
              <div className="font-medium">{salesUser?.role ?? 'Sales'}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Assigned Sales Areas</div>
              <div className="mt-2 space-y-2">
                {assignedAreas.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No assigned sales areas</div>
                ) : (
                  assignedAreas.map((a) => (
                    <div key={a.sales_area_id} className="rounded border px-3 py-2 flex items-center justify-between">
                      <div>{a.sales_area_name}</div>
                      <div>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={unassignMutation.isPending}
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: `Unassign ${a.sales_area_name}?`,
                              text: 'This will remove the sales user from the selected sales area.',
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonText: 'Yes, unassign',
                              cancelButtonText: 'Cancel',
                            })

                            if (!result.isConfirmed) return

                            try {
                              await unassignMutation.mutateAsync({ salesId: salesId, areaId: a.sales_area_id })
                              await refetch()
                              await Swal.fire({ title: 'Unassigned', text: `${a.sales_area_name} has been unassigned.`, icon: 'success' })
                            } catch (err: any) {
                              const msg = err?.message ?? 'Failed to unassign area'
                              await Swal.fire({ title: 'Error', text: msg, icon: 'error' })
                            }
                          }}
                        >
                          Unassign
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        <br />
      </Modal>

      {isAssignOpen && (
        <AssignSalesAreaModal
          open={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
          salesId={salesId}
          assignedIds={assignedAreas.map((a) => a.sales_area_id)}
          onSaved={async () => {
            await refetch()
          }}
        />
      )}
    </>
  )
}
