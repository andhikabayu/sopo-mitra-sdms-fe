'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import CheckboxList from './CheckboxList'
import { useSalesAreasList, useSalesAssignmentAssign, useSalesAssignmentsBySales } from '../hooks/use-sales-assignments'
import Swal from 'sweetalert2'

interface Props {
  open: boolean
  onClose: () => void
  salesId: number
  assignedIds?: number[]
  onSaved?: () => void
}

export default function AssignSalesAreaModal({ open, onClose, salesId, assignedIds = [], onSaved }: Props) {
  const { data: areas = [] } = useSalesAreasList()
  const assignMutation = useSalesAssignmentAssign()
  const [selected, setSelected] = useState<number[]>(assignedIds)

  // keep selected in sync when assignedIds change
  React.useEffect(() => {
    setSelected(assignedIds ?? [])
  }, [assignedIds])

  const toggle = useCallback((id: number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }, [])

  const selectAll = useCallback(() => setSelected(areas.map((a) => a.id)), [areas])
  const unselectAll = useCallback(() => setSelected([]), [])

  const handleSave = async () => {
    if (selected.length === 0) {
      // allow clearing all: send empty array
    }
    try {
      await assignMutation.mutateAsync({ sales_id: salesId, sales_area_ids: selected })
      onSaved?.()
      await Swal.fire({ title: 'Saved', text: 'Sales areas updated successfully.', icon: 'success' })
      onClose()
    } catch (err: any) {
      await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to save', icon: 'error' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign Sales Area"
      description="Select sales areas to assign to this sales user"
      size="lg"
      footer={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose} disabled={assignMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={assignMutation.isPending}>
            {assignMutation.isPending ? <Spinner /> : 'Save'}
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button variant="outline" onClick={selectAll} size="sm">
            Select All
          </Button>
          <Button variant="outline" onClick={unselectAll} size="sm">
            Unselect All
          </Button>
        </div>

        {areas.length === 0 ? (
          <div className="text-sm text-muted-foreground">No sales areas available.</div>
        ) : (
          <CheckboxList
            items={areas.map((a) => ({ id: a.id, label: a.name }))}
            selectedIds={selected}
            onToggle={toggle}
          />
        )}
      </div>
    </Modal>
  )
}
