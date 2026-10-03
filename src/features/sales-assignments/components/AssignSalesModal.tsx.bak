'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import CheckboxList from './CheckboxList'
import SearchInput from './SearchInput'
import {
  useSalesList,
  useSalesAssignmentsByArea,
  useSalesAssignmentAssign,
  useSalesAssignmentUnassign,
} from '../hooks/use-sales-assignments'
import Swal from 'sweetalert2'

interface Props {
  open: boolean
  onClose: () => void
  salesAreaId: number
  assignedSalesIds?: number[]
  onSaved?: () => void
}

export default function AssignSalesModal({ open, onClose, salesAreaId, assignedSalesIds = [], onSaved }: Props) {
  const { data: sales = [] } = useSalesList()
  const { data: areaData } = useSalesAssignmentsByArea(salesAreaId)
  const assigned = areaData?.sales ?? []
  const assignMutation = useSalesAssignmentAssign()
  const unassignMutation = useSalesAssignmentUnassign()

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<number[]>(assignedSalesIds)

  React.useEffect(() => setSelected(assignedSalesIds ?? []), [assignedSalesIds])

  const items = useMemo(() => {
    return sales
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .map((s) => ({ id: s.id, label: s.name, meta: s.email }))
  }, [sales, query])

  const toggle = useCallback((id: number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }, [])

  const selectAll = useCallback(() => setSelected(items.map((i) => i.id)), [items])
  const unselectAll = useCallback(() => setSelected([]), [])

  const handleSave = async () => {
    // compute diffs
    const prevAssigned = assigned.map((a) => a.sales_id)
    const toAdd = selected.filter((id) => !prevAssigned.includes(id))
    const toRemove = prevAssigned.filter((id) => !selected.includes(id))
    try {
      // confirm if there are removals
      if (toRemove.length > 0) {
        const confirmed = await Swal.fire({
          title: `Remove ${toRemove.length} assignments?`,
          text: 'This will unassign selected sales from this area.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, remove',
          cancelButtonText: 'Cancel',
        })

        if (!confirmed.isConfirmed) return
      }

      // assign area to newly added sales
      for (const salesId of toAdd) {
        await assignMutation.mutateAsync({ sales_id: salesId, sales_area_ids: [salesAreaId] })
      }

      // unassign area from removed sales
      for (const salesId of toRemove) {
        await unassignMutation.mutateAsync({ salesId, areaId: salesAreaId })
      }

      onSaved?.()
      await Swal.fire({ title: 'Saved', text: 'Assignments updated successfully.', icon: 'success' })
      onClose()
    } catch (err: any) {
      await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to save assignments', icon: 'error' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign Sales"
      description="Select sales users to assign to this sales area"
      size="lg"
      footer={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose} disabled={assignMutation.isPending || unassignMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={assignMutation.isPending || unassignMutation.isPending}>
            {assignMutation.isPending || unassignMutation.isPending ? <Spinner /> : 'Save'}
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
          <div className="flex-1">
            <SearchInput value={query} onChange={setQuery} placeholder="Search sales by name" />
          </div>
        </div>

        <CheckboxList items={items} selectedIds={selected} onToggle={toggle} />
      </div>
    </Modal>
  )
}
