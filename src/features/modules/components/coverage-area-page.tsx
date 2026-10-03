'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { moduleDefinitions } from '@/config/modules'
import { coverageAreaColumns } from '@/config/module-registry'
import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { FormSelect } from '@/components/form/form-select'
import { Checkbox } from '@/components/ui/checkbox'
import { RBAC } from '@/config/rbac'
import { usePermissions } from '@/features/roles'
import { parseApiError } from '@/lib/api/error'
import {
  useCoverageAreaAssign,
  useCoverageAreaList,
  useCoverageAreaRemove,
  useRelationOptions,
} from '../hooks/use-module-crud'

type DeleteTarget = {
  subDistrictId: number
  subDistrictName: string
}

export function CoverageAreaPage() {
  const coverageModule = moduleDefinitions.find((m) => m.path === '/master/coverage-areas')!
  const { canPerform } = usePermissions()
  const canManage = canPerform([RBAC.SUPER_ADMIN])

  const { data: relations } = useRelationOptions()
  const [salesAreaId, setSalesAreaId] = useState<number | undefined>()
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedSubDistrictIds, setSelectedSubDistrictIds] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  const { data, isLoading } = useCoverageAreaList(salesAreaId)
  const assignMutation = useCoverageAreaAssign()
  const removeMutation = useCoverageAreaRemove()

  const tableData = useMemo(() => data?.sub_districts ?? [], [data])

  const toggleSubDistrict = (id: number) => {
    setSelectedSubDistrictIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    )
  }

  const handleAssign = async () => {
    if (!salesAreaId) {
      setFormError('Select a sales area first')
      return
    }
    if (selectedSubDistrictIds.length === 0) {
      setFormError('Select at least one sub-district')
      return
    }
    setFormError(null)
    try {
      await assignMutation.mutateAsync({
        salesAreaId,
        subDistrictIds: selectedSubDistrictIds,
      })
      setAssignOpen(false)
      setSelectedSubDistrictIds([])
    } catch (err) {
      setFormError(parseApiError(err).message)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !salesAreaId) return
    try {
      await removeMutation.mutateAsync({
        salesAreaId,
        subDistrictId: deleteTarget.subDistrictId,
      })
      setDeleteTarget(null)
    } catch (err) {
      setFormError(parseApiError(err).message)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{coverageModule.endpoint}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{coverageModule.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {coverageModule.description}
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => {
              setFormError(null)
              setSelectedSubDistrictIds([])
              setAssignOpen(true)
            }}
            disabled={!salesAreaId}
          >
            <FiPlus className="h-4 w-4" />
            Assign Sub Districts
          </Button>
        )}
      </div>

      <FormSelect
        label="Sales Area"
        required
        options={relations?.sales_areas.map((area) => ({ value: area.value, label: area.label })) ?? []}
        placeholder="Select sales area"
        value={String(salesAreaId ?? '')}
        onChange={(event) => setSalesAreaId(Number(event.target.value) || undefined)}
        className="max-w-md"
      />

      {formError && !assignOpen && !deleteTarget && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <DataTable
        columns={coverageAreaColumns}
        data={salesAreaId ? (tableData as Record<string, unknown>[]) : []}
        isLoading={isLoading}
        searchPlaceholder="Search sub-districts..."
        getRowId={(row) => Number(row.id)}
        emptyMessage={salesAreaId ? 'No sub-districts assigned yet.' : 'Select a sales area to view coverage.'}
        renderActions={
          canManage
            ? (row) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() =>
                    setDeleteTarget({
                      subDistrictId: Number(row.sub_district_id),
                      subDistrictName: String(row.sub_district_name),
                    })
                  }
                  aria-label="Remove mapping"
                >
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              )
            : undefined
        }
      />

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign Sub Districts"
        description="Select sub-districts to map to the chosen sales area."
        size="md"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAssign} isLoading={assignMutation.isPending}>
              Assign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          )}
          <div className="space-y-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sub-districts..."
              className="mb-2"
            />
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
              {(
                (relations?.sub_districts ?? []).filter((s) =>
                  s.label.toLowerCase().includes(searchTerm.trim().toLowerCase()),
                )
              ).map((subDistrict) => (
                <Checkbox
                  key={subDistrict.value}
                  label={subDistrict.label}
                  checked={selectedSubDistrictIds.includes(subDistrict.value)}
                  onChange={() => toggleSubDistrict(subDistrict.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Coverage Mapping"
        description={`Remove "${deleteTarget?.subDistrictName}" from this sales area?`}
        isLoading={removeMutation.isPending}
      />
    </section>
  )
}
