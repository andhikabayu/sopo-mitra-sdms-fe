'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  useCoverageAreasList,
  useCoverageAreaUnassign,
} from '@/features/coverage-areas'
import { useLocationData } from '@/features/modules/hooks/use-module-crud'
import CreateCoverageModal from '@/features/coverage-areas/components/create-coverage-modal'
import { DataTable } from '@/components/data-table/data-table'
import Swal from 'sweetalert2'

export default function CoverageAreasPage() {
  const [selectedAreaId, setSelectedAreaId] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const {
    data,
    isLoading,
    refetch,
  } = useCoverageAreasList(selectedAreaId)

  const unassignMutation = useCoverageAreaUnassign()

  const { data: locationData } = useLocationData()

  const salesAreas = locationData?.sales_areas ?? []

  const coverageList = data?.sub_districts ?? []

  const handleUnassign = async (subDistrictId: number) => {
    const result = await Swal.fire({
      title: 'Unassign sub-district?',
      text: 'This will remove the sub-district from the sales area.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unassign',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await unassignMutation.mutateAsync({ salesAreaId: selectedAreaId, subDistrictId })
      await refetch()
      await Swal.fire({ title: 'Unassigned', text: 'Sub-district has been unassigned.', icon: 'success' })
    } catch (err: any) {
      await Swal.fire({ title: 'Error', text: err?.message ?? 'Failed to unassign', icon: 'error' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Coverage Areas
        </h1>

        <p className="mt-2 text-muted-foreground">
          Assign sub-districts to sales areas
        </p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-xs">
            <label className="text-sm font-medium">
              Select Sales Area
            </label>

            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(Number(e.target.value))}
              className="mt-2 w-full rounded-md border px-3 py-2"
            >
               <option
                  key=""
                  value=""
                >
                  Select sales area
                </option>
              {salesAreas.map((area: any) => (
                <option
                  key={area.id}
                  value={area.id}
                >
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="w-full md:w-auto"
          >
            Assign Sub-districts
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <DataTable
            columns={[
              { key: 'sales_area_id', label: 'Sales Area ID' },
              { key: 'sub_district_id', label: 'Sub District ID' },
              { key: 'sub_district_name', label: 'Sub District Name' },
              { key: 'district_id', label: 'District ID' },
            ]}
            data={coverageList.map((c: any) => ({ ...c, sales_area_id: data?.sales_area_id }))}
            isLoading={isLoading}
            renderActions={(row: any) => (
              <Button variant="destructive" size="sm" disabled={unassignMutation.isPending} onClick={() => handleUnassign(row.sub_district_id)}>
                Unassign
              </Button>
            )}
            getRowId={(r) => r.sub_district_id}
            emptyMessage="No sub-districts assigned to this sales area"
          />
        </div>
      </div>

      <CreateCoverageModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        salesAreaId={selectedAreaId}
        assignedSubDistrictIds={coverageList.map(
          (item) => item.sub_district_id
        )}
        onAssigned={refetch}
      />
    </div>
  )
}
