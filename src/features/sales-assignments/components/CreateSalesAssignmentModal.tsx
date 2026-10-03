'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { FormSelect } from '@/components/form/form-select'
import Swal from 'sweetalert2'
import CheckboxList from './CheckboxList'
import { useSalesList, useSalesAreasList, useSalesAssignmentAssign, useSalesAssignmentsBySales } from '../hooks/use-sales-assignments'
import { parseApiError } from '@/lib/api/error'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CreateSalesAssignmentModal({ open, onClose }: Props) {
  const { data: sales = [] } = useSalesList()
  const { data: areas = [] } = useSalesAreasList()
  const assignMutation = useSalesAssignmentAssign()

  const [salesId, setSalesId] = useState<number | ''>('')
  const [selectedAreas, setSelectedAreas] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: assignedData } = useSalesAssignmentsBySales(typeof salesId === 'number' ? salesId : undefined)

  // compute areas available for assignment (exclude areas already assigned to selected sales)
  const availableAreas = React.useMemo(() => {
    if (!areas || areas.length === 0) return []
    const assignedIds = new Set<number>((assignedData?.sales_areas ?? []).map((a) => a.sales_area_id))
    return areas.filter((a) => !assignedIds.has(a.id))
  }, [areas, assignedData])

  const filteredAvailableAreas = useMemo(() => {
    if (!searchTerm.trim()) return availableAreas
    const q = searchTerm.trim().toLowerCase()
    return availableAreas.filter((a) => String(a.name).toLowerCase().includes(q))
  }, [availableAreas, searchTerm])

  useEffect(() => {
    if (!open) {
      setSalesId('')
      setSelectedAreas([])
      setError(null)
    }
  }, [open])

  useEffect(() => {
    // reset selected areas when sales changes
    setSelectedAreas([])
  }, [salesId])

  const toggle = useCallback((id: number) => {
    setSelectedAreas((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }, [])

  const selectAll = useCallback(() => setSelectedAreas(availableAreas.map((a) => a.id)), [availableAreas])
  const unselectAll = useCallback(() => setSelectedAreas([]), [])
  const selectAllFiltered = useCallback(() => setSelectedAreas((prev) => {
    const ids = filteredAvailableAreas.map((a) => a.id)
    // merge with existing selections without duplicates
    return Array.from(new Set([...prev, ...ids]))
  }), [filteredAvailableAreas])
  const unselectAllFiltered = useCallback(() => setSelectedAreas((prev) => prev.filter((id) => !filteredAvailableAreas.some((a) => a.id === id))), [filteredAvailableAreas])

  const handleSave = async () => {
    setError(null)
    if (!salesId) {
      setError('Please select a sales user')
      return
    }

    try {
        await assignMutation.mutateAsync({ sales_id: Number(salesId), sales_area_ids: selectedAreas })
        await Swal.fire({ title: 'Created', text: 'Sales areas assigned successfully.', icon: 'success' })
        onClose()
    } catch (err) {
      setError(parseApiError(err).message)
    }
  }

  const salesOptions = sales.map((s) => ({ value: s.id, label: s.name }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Sales Assignment"
      description="Assign selected sales areas to a sales user"
      size="lg"
      footer={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose} disabled={assignMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={assignMutation.isPending}>
            {assignMutation.isPending ? <Spinner /> : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <FormSelect
            label="Sales User"
            options={salesOptions}
            value={salesId}
            onChange={(e) => setSalesId(Number(e.target.value))}
            placeholder="Select sales user"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Sales Areas</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllFiltered}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={unselectAllFiltered}>
                Unselect All
              </Button>
            </div>
          </div>
          {availableAreas.length === 0 ? (
            <div className="text-sm text-muted-foreground mt-2">No sales areas available for this user</div>
          ) : (
            <div className="mt-2">
              <div className="space-y-2">
                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search sales areas..." />
                <CheckboxList
                  items={filteredAvailableAreas.map((a) => ({ id: a.id, label: a.name }))}
                  selectedIds={selectedAreas}
                  onToggle={toggle}
                />
              </div>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}
      </div>
    </Modal>
  )
}
