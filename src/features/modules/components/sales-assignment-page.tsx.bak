'use client'

import { useMemo, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { moduleDefinitions } from '@/config/modules'
import {
  salesAssignmentByAreaColumns,
  salesAssignmentBySalesColumns,
} from '@/config/module-registry'
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
  useRelationOptions,
  useSalesAssignmentCreate,
  useSalesAssignmentRemove,
  useSalesAssignmentsByArea,
  useSalesAssignmentsBySales,
} from '../hooks/use-module-crud'

type ViewMode = 'sales' | 'area'

type DeleteTarget = {
  salesId: number
  salesAreaId: number
  label: string
}

export function SalesAssignmentPage() {
  const assignmentModule = moduleDefinitions.find((m) => m.path === '/master/sales-assignments')!
  const { canPerform } = usePermissions()
  const canManage = canPerform([RBAC.SUPER_ADMIN])

  const { data: relations } = useRelationOptions()
  const [viewMode, setViewMode] = useState<ViewMode>('sales')
  const [filterSalesId, setFilterSalesId] = useState<number | undefined>()
  const [filterSalesAreaId, setFilterSalesAreaId] = useState<number | undefined>()
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignSalesId, setAssignSalesId] = useState<number | undefined>()
  const [selectedSalesAreaIds, setSelectedSalesAreaIds] = useState<number[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  const { data: bySalesData, isLoading: loadingBySales } = useSalesAssignmentsBySales(filterSalesId)
  const { data: byAreaData, isLoading: loadingByArea } = useSalesAssignmentsByArea(filterSalesAreaId)
  const createMutation = useSalesAssignmentCreate()
  const removeMutation = useSalesAssignmentRemove()

  const tableData = useMemo(() => {
    if (viewMode === 'sales') return bySalesData?.sales_areas ?? []
    return byAreaData?.sales ?? []
  }, [viewMode, bySalesData, byAreaData])

  const columns =
    viewMode === 'sales' ? salesAssignmentBySalesColumns : salesAssignmentByAreaColumns

  const toggleSalesArea = (id: number) => {
    setSelectedSalesAreaIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    )
  }

  const handleAssign = async () => {
    if (!assignSalesId) {
      setFormError('Select a sales person')
      return
    }
    if (selectedSalesAreaIds.length === 0) {
      setFormError('Select at least one sales area')
      return
    }
    setFormError(null)
    try {
      await createMutation.mutateAsync({
        salesId: assignSalesId,
        salesAreaIds: selectedSalesAreaIds,
      })
      setAssignOpen(false)
      setSelectedSalesAreaIds([])
      setAssignSalesId(undefined)
    } catch (err) {
      setFormError(parseApiError(err).message)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await removeMutation.mutateAsync({
        salesId: deleteTarget.salesId,
        salesAreaId: deleteTarget.salesAreaId,
      })
      setDeleteTarget(null)
    } catch (err) {
      setFormError(parseApiError(err).message)
    }
  }

  const openDeleteFromRow = (row: Record<string, unknown>) => {
    if (viewMode === 'sales') {
      setDeleteTarget({
        salesId: filterSalesId!,
        salesAreaId: Number(row.sales_area_id),
        label: String(row.sales_area_name),
      })
      return
    }
    setDeleteTarget({
      salesId: Number(row.sales_id),
      salesAreaId: filterSalesAreaId!,
      label: String(row.sales_name),
    })
  }

  const hasFilter = viewMode === 'sales' ? Boolean(filterSalesId) : Boolean(filterSalesAreaId)

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{assignmentModule.endpoint}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{assignmentModule.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {assignmentModule.description}
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => {
              setFormError(null)
              setAssignSalesId(viewMode === 'sales' ? filterSalesId : undefined)
              setSelectedSalesAreaIds([])
              setAssignOpen(true)
            }}
          >
            <FiPlus className="h-4 w-4" />
            Assign Sales Areas
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={viewMode === 'sales' ? 'primary' : 'outline'}
          onClick={() => setViewMode('sales')}
        >
          By Sales
        </Button>
        <Button
          type="button"
          size="sm"
          variant={viewMode === 'area' ? 'primary' : 'outline'}
          onClick={() => setViewMode('area')}
        >
          By Sales Area
        </Button>
      </div>

      {viewMode === 'sales' ? (
        <FormSelect
          label="Sales Person"
          required
          options={relations?.sales.map((s) => ({ value: s.value, label: s.label })) ?? []}
          placeholder="Select sales"
          value={String(filterSalesId ?? '')}
          onChange={(event) => setFilterSalesId(Number(event.target.value) || undefined)}
          className="max-w-md"
        />
      ) : (
        <FormSelect
          label="Sales Area"
          required
          options={relations?.sales_areas.map((a) => ({ value: a.value, label: a.label })) ?? []}
          placeholder="Select sales area"
          value={String(filterSalesAreaId ?? '')}
          onChange={(event) => setFilterSalesAreaId(Number(event.target.value) || undefined)}
          className="max-w-md"
        />
      )}

      {formError && !assignOpen && !deleteTarget && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <DataTable
        columns={columns}
        data={hasFilter ? (tableData as Record<string, unknown>[]) : []}
        isLoading={viewMode === 'sales' ? loadingBySales : loadingByArea}
        searchPlaceholder="Search assignments..."
        getRowId={(row) => Number(row.id)}
        emptyMessage={
          hasFilter
            ? 'No assignments found.'
            : `Select a ${viewMode === 'sales' ? 'sales person' : 'sales area'} to view assignments.`
        }
        renderActions={
          canManage
            ? (row) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => openDeleteFromRow(row)}
                  aria-label="Remove assignment"
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
        title="Assign Sales Areas"
        description="Assign one or more sales areas to a sales person."
        size="md"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAssign} isLoading={createMutation.isPending}>
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
          <FormSelect
            label="Sales Person"
            required
            options={relations?.sales.map((s) => ({ value: s.value, label: s.label })) ?? []}
            placeholder="Select sales"
            value={String(assignSalesId ?? '')}
            onChange={(event) => setAssignSalesId(Number(event.target.value) || undefined)}
          />
          <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
            {(relations?.sales_areas ?? []).map((area) => (
              <Checkbox
                key={area.value}
                label={area.label}
                checked={selectedSalesAreaIds.includes(area.value)}
                onChange={() => toggleSalesArea(area.value)}
              />
            ))}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Sales Assignment"
        description={`Remove assignment for "${deleteTarget?.label}"?`}
        isLoading={removeMutation.isPending}
      />
    </section>
  )
}
