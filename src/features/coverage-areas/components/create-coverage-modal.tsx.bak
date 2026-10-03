'use client'

import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { useLocationData } from '@/features/modules/hooks/use-module-crud'
import { useCoverageAreaAssign } from '../hooks/use-coverage-areas'
import Swal from 'sweetalert2'

interface Props {
  open: boolean
  onClose: () => void
  salesAreaId: number
  assignedSubDistrictIds: number[]
  onAssigned?: () => void
}

export function CreateCoverageModal({
  open,
  onClose,
  salesAreaId,
  assignedSubDistrictIds,
  onAssigned,
}: Props) {
  const { data: locationData } = useLocationData()

  const assignMutation = useCoverageAreaAssign()

  const [selected, setSelected] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  /**
   * Filter subdistrict yang BELUM di-assign
   */
  const subDistricts = useMemo(() => {
    const assigned = new Set(assignedSubDistrictIds)

    return (locationData?.sub_districts ?? []).filter(
      (item: any) => !assigned.has(Number(item.id))
    )
  }, [locationData, assignedSubDistrictIds])

  /**
   * Reset ketika modal ditutup
   */
  useEffect(() => {
    if (!open) {
      setSelected([])
    }
  }, [open])

  const allIds = subDistricts.map((s: any) => Number(s.id))

  const filteredSubDistricts = useMemo(() => {
    if (!searchTerm.trim()) return subDistricts
    const q = searchTerm.trim().toLowerCase()
    return subDistricts.filter((s: any) => String(s.name).toLowerCase().includes(q))
  }, [subDistricts, searchTerm])

  const isAllSelected =
    subDistricts.length > 0 &&
    selected.length === subDistricts.length

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected([])
    } else {
      setSelected(allIds)
    }
  }

  const handleSubmit = async () => {
    if (selected.length === 0) return
    try {
      await assignMutation.mutateAsync({ sales_area_id: salesAreaId, sub_district_ids: selected })
      setSelected([])
      await onAssigned?.()
      await Swal.fire({ title: 'Assigned', text: 'Sub-districts assigned successfully.', icon: 'success' })
      onClose()
    } catch (err: any) {
      await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to assign', icon: 'error' })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Assign Sub-districts — Sales Area ${salesAreaId}`}
      description="Select sub-districts to assign to this sales area"
      size="lg"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={assignMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              assignMutation.isPending ||
              selected.length === 0
            }
          >
            {assignMutation.isPending ? (
              <Spinner />
            ) : (
              `Assign (${selected.length})`
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {subDistricts.length === 0 ? (
          <div className="rounded border py-8 text-center text-muted-foreground">
            All sub-districts have already been assigned.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sub-districts..."
              />

              <div className="flex items-center justify-between rounded-md border bg-gray-50 px-3 py-2">
                <div className="font-medium">
                  Select All ({selected.length}/{filteredSubDistricts.length})
                </div>

                <Checkbox
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </div>

              <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto">
                {filteredSubDistricts.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded border px-3 py-2"
                >
                  <div>
                    <div className="font-medium">
                      {s.name}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      District ID: {s.district_id}
                    </div>
                  </div>

                  <Checkbox
                    checked={selected.includes(Number(s.id))}
                    onChange={() => toggle(Number(s.id))}
                  />
                </div>
                ))}
            </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default CreateCoverageModal
