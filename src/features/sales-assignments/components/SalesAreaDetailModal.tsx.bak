'use client'

import React, { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import AssignSalesModal from './AssignSalesModal'
import { useSalesAssignmentsByArea, useSalesAreasList } from '../hooks/use-sales-assignments'

interface Props {
  open: boolean
  onClose: () => void
  salesAreaId: number
}

export default function SalesAreaDetailModal({ open, onClose, salesAreaId }: Props) {
  const { data, isLoading, refetch } = useSalesAssignmentsByArea(salesAreaId)
  const { data: areas } = useSalesAreasList()
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  const area = areas?.find((a) => a.id === salesAreaId)

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Sales Area Detail"
        description="View sales area and assigned sales"
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => setIsAssignOpen(true)}>Assign Sales</Button>
          </div>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Sales Area Name</div>
              <div className="font-medium">{area?.name ?? '—'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Assigned Sales</div>
              <div className="mt-2 space-y-2">
                {data && data.sales && data.sales.length > 0 ? (
                  data.sales.map((s) => (
                    <div key={s.sales_id} className="rounded border px-3 py-2">
                      {s.sales_name}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No assigned sales</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {isAssignOpen && (
        <AssignSalesModal
          open={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
          salesAreaId={salesAreaId}
          assignedSalesIds={data?.sales?.map((d) => d.sales_id) ?? []}
          onSaved={async () => {
            await refetch()
          }}
        />
      )}
    </>
  )
}
