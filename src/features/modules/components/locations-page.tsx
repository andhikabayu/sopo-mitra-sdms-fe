'use client'

import { useMemo, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { moduleDefinitions } from '@/config/modules'
import { locationTabs, type LocationTabConfig } from '@/config/module-registry'
import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { FormInput } from '@/components/form/form-input'
import { FormSelect } from '@/components/form/form-select'
import { RBAC } from '@/config/rbac'
import { usePermissions } from '@/features/roles'
import { parseApiError } from '@/lib/api/error'
import {
  useLocationCreate,
  useLocationData,
  useLocationList,
} from '../hooks/use-module-crud'

export function LocationsPage() {
  const locationModule = moduleDefinitions.find((m) => m.path === '/master/locations')!
  const { canPerform } = usePermissions()
  const canCreate = canPerform([RBAC.SUPER_ADMIN])

  const [activeTab, setActiveTab] = useState<LocationTabConfig>(locationTabs[0]!)
  const [parentFilter, setParentFilter] = useState<number | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const { data: locationData } = useLocationData()

  const listEndpoint = useMemo(() => {
    if (typeof activeTab.listEndpoint === 'string') return activeTab.listEndpoint
    if (activeTab.key === 'districts') {
      const cityId = parentFilter ?? Number(locationData?.cities[0]?.id ?? 0)
      return activeTab.listEndpoint(cityId)
    }
    if (activeTab.key === 'sub_districts') {
      const districtId = parentFilter ?? Number(locationData?.districts[0]?.id ?? 0)
      return activeTab.listEndpoint(districtId)
    }
    return activeTab.listEndpoint()
  }, [activeTab, parentFilter, locationData])

  const needsParent = activeTab.parentKey !== undefined
  const parentEnabled = !needsParent || parentFilter !== undefined

  const { data = [], isLoading } = useLocationList(
    listEndpoint,
    !needsParent || Boolean(parentFilter ?? locationData),
  )
  const createMutation = useLocationCreate()

  const parentOptions = useMemo(() => {
    if (!locationData) return []
    if (activeTab.key === 'districts') {
      return locationData.cities.map((c) => ({ value: Number(c.id), label: String(c.name) }))
    }
    if (activeTab.key === 'sub_districts') {
      return locationData.districts.map((d) => ({
        value: Number(d.id),
        label: String(d.name),
      }))
    }
    return []
  }, [activeTab, locationData])

  const openCreate = () => {
    const defaults: Record<string, string> = {}
    activeTab.fields.forEach((field) => {
      defaults[field.key] = field.type === 'relation' && parentFilter ? String(parentFilter) : ''
    })
    setFormValues(defaults)
    setFormError(null)
    setCreateOpen(true)
  }

  const handleCreate = async () => {
    const missing = activeTab.fields.find(
      (field) => field.required && !formValues[field.key]?.trim(),
    )
    if (missing) {
      setFormError(`${missing.label} is required`)
      return
    }

    const body: Record<string, unknown> = {}
    activeTab.fields.forEach((field) => {
      const value = formValues[field.key]
      if (field.type === 'relation') body[field.key] = Number(value)
      else body[field.key] = value
    })

    try {
      await createMutation.mutateAsync({ endpoint: activeTab.createEndpoint, body })
      setCreateOpen(false)
    } catch (err) {
      setFormError(parseApiError(err).message)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{locationModule.endpoint}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{locationModule.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{locationModule.description}</p>
        </div>
        {canCreate && (
          <Button onClick={openCreate}>
            <FiPlus className="h-4 w-4" />
            Add {activeTab.label}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {locationTabs.map((tab) => (
          <Button
            key={tab.key}
            type="button"
            variant={activeTab.key === tab.key ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveTab(tab)
              setParentFilter(undefined)
            }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {needsParent && (
        <FormSelect
          label={activeTab.key === 'districts' ? 'Filter by City' : 'Filter by District'}
          options={parentOptions.map((o) => ({ value: o.value, label: o.label }))}
          placeholder="Select parent"
          value={String(parentFilter ?? '')}
          onChange={(event) => setParentFilter(Number(event.target.value))}
          className="max-w-xs"
        />
      )}

      <DataTable
        columns={activeTab.tableColumns}
        data={parentEnabled ? (data as Record<string, unknown>[]) : []}
        isLoading={isLoading}
        searchPlaceholder={`Search ${activeTab.label.toLowerCase()}...`}
        getRowId={(row) => Number(row.id)}
        emptyMessage={
          needsParent && !parentFilter
            ? 'Select a parent filter to view records.'
            : 'No records found.'
        }
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={`Create ${activeTab.label}`}
        size="md"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreate} isLoading={createMutation.isPending}>
              Create
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
          {activeTab.fields.map((field) =>
            field.type === 'relation' ? (
              <FormSelect
                key={field.key}
                label={field.label}
                required={field.required}
                options={
                  field.relationKey === 'cities'
                    ? (locationData?.cities.map((c) => ({
                        value: Number(c.id),
                        label: String(c.name),
                      })) ?? [])
                    : (locationData?.districts.map((d) => ({
                        value: Number(d.id),
                        label: String(d.name),
                      })) ?? [])
                }
                value={formValues[field.key] ?? ''}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
              />
            ) : (
              <FormInput
                key={field.key}
                label={field.label}
                required={field.required}
                value={formValues[field.key] ?? ''}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
              />
            ),
          )}
        </div>
      </Modal>
    </section>
  )
}
