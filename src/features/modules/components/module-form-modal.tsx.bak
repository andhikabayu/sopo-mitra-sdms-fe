'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiCrosshair } from 'react-icons/fi'
import type { ModuleField } from '@/config/modules'
import { ARRAY_ITEM_FIELDS } from '@/config/module-registry'
import type { ModuleRegistryEntry } from '@/config/module-registry'
import { useRoleOptions, usePermissions } from '@/features/roles'
import { useAuth } from '@/features/auth'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/form/form-input'
import { FormSelect } from '@/components/form/form-select'
import { FormTextarea } from '@/components/form/form-textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ModuleArrayField } from './module-array-field'
import {
  useLocationCities,
  useLocationDistricts,
  useLocationSalesAreas,
  useLocationSubDistricts,
  useRelationOptions,
} from '../hooks/use-module-crud'
import { usePurchaseOrderOutletOptions } from '@/features/purchase-orders'
import type { ApiError } from '@/types/api'
import type { SelectOption } from '@/components/ui/select'

export interface ModuleFormModalProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'update'
  registry: ModuleRegistryEntry
  initialData?: Record<string, unknown>
  onSubmit: (body: Record<string, unknown>) => Promise<void>
  isLoading?: boolean
  error?: ApiError | null
}

function getDefaultValues(fields: readonly ModuleField[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  fields.forEach((field) => {
    if (field.type === 'boolean') values[field.key] = true
    else if (field.type === 'array') values[field.key] = []
    else values[field.key] = ''
  })
  return values
}

type RelationKey =
  | 'users'
  | 'sales'
  | 'products'
  | 'outlets'
  | 'cities'
  | 'districts'
  | 'sub_districts'
  | 'sales_areas'
  | 'store_inspectors'

function getRelationOptionsKey(fieldKey: string): RelationKey | null {
  const map: Record<string, RelationKey> = {
    city_id: 'cities',
    district_id: 'districts',
    sub_district_id: 'sub_districts',
    sales_area_id: 'sales_areas',
    outlet_id: 'outlets',
    sales_id: 'sales',
    auditor_id: 'store_inspectors',
    product_id: 'products',
  }
  return map[fieldKey] ?? null
}

export function ModuleFormModal({
  open,
  onClose,
  mode,
  registry,
  initialData,
  onSubmit,
  isLoading,
  error,
}: ModuleFormModalProps) {
  const { data: relations } = useRelationOptions()
  const roleOptions = useRoleOptions()
  const { user } = useAuth()
  const { role } = usePermissions()
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const isOutletModule = registry.module.path === '/outlets'
  const isPurchaseOrderModule = registry.module.path === '/purchase-orders'

  const selectedCityId = isOutletModule && formValues.city_id !== '' && formValues.city_id !== undefined && formValues.city_id !== null
    ? Number(formValues.city_id)
    : undefined
  const selectedDistrictId = isOutletModule && formValues.district_id !== '' && formValues.district_id !== undefined && formValues.district_id !== null
    ? Number(formValues.district_id)
    : undefined
  const selectedSalesId = isPurchaseOrderModule && formValues.sales_id !== '' && formValues.sales_id !== undefined && formValues.sales_id !== null
    ? Number(formValues.sales_id)
    : undefined

  const cityQuery = useLocationCities(open && isOutletModule)
  const districtQuery = useLocationDistricts(selectedCityId, open && isOutletModule)
  const subDistrictQuery = useLocationSubDistricts(selectedDistrictId, open && isOutletModule)
  const salesAreaQuery = useLocationSalesAreas(open && isOutletModule)
  const purchaseOrderOutletQuery = usePurchaseOrderOutletOptions(selectedSalesId, open && isPurchaseOrderModule)

  const cityOptions = useMemo(
    () => (cityQuery.data ?? []).map((item) => ({ value: Number(item.id), label: String(item.name) })),
    [cityQuery.data],
  )
  const districtOptions = useMemo(
    () => (districtQuery.data ?? []).map((item) => ({ value: Number(item.id), label: String(item.name) })),
    [districtQuery.data],
  )
  const subDistrictOptions = useMemo(
    () => (subDistrictQuery.data ?? []).map((item) => ({ value: Number(item.id), label: String(item.name) })),
    [subDistrictQuery.data],
  )
  const salesAreaOptions = useMemo(
    () => (salesAreaQuery.data ?? []).map((item) => ({ value: Number(item.id), label: String(item.name) })),
    [salesAreaQuery.data],
  )
  const purchaseOrderOutletOptions = useMemo(
    () =>
      ((purchaseOrderOutletQuery.data?.items ?? []) as Array<Record<string, unknown>>).map((item) => ({
        value: Number(item.id),
        label: String(item.outlet_name ?? item.outletName ?? item.name ?? ''),
      })),
    [purchaseOrderOutletQuery.data],
  )

  const visibleFields = useMemo(() => {
    return registry.module.fields.filter((field) => {
      // Hide `status` from create/update forms for purchase orders; status handled via approval workflow
      if (registry.module.path === '/purchase-orders' && field.key === 'status') return false
      if (mode === 'create' && registry.createOnlyFields?.includes(field.key)) return true
      if (mode === 'update') {
        if (registry.createOnlyFields?.includes(field.key)) return false
        if (field.key === 'password') return false
      }
      return true
    })
  }, [registry, mode])

  const setValue = useCallback((key: string, value: unknown) => {
    setFormValues((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'city_id') {
        next.district_id = ''
        next.sub_district_id = ''
      }
      if (key === 'district_id') {
        next.sub_district_id = ''
      }
      if (key === 'sales_id' && isPurchaseOrderModule) {
        next.items = Array.isArray(prev.items)
          ? prev.items.map((item) => ({
              ...(item as Record<string, unknown>),
              outlet_id: '',
            }))
          : prev.items
      }
      return next
    })
  }, [isPurchaseOrderModule])

  const detectLocation = useCallback(async () => {
    if (typeof window === 'undefined' || !('navigator' in window) || !navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser')
      return
    }

    setDetectingLocation(true)
    setGeoError(null)

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setValue('latitude', String(Number(lat.toFixed(6))))
          setValue('longitude', String(Number(lng.toFixed(6))))
          setGeoError(null)
          setDetectingLocation(false)
          resolve()
        },
        (err) => {
          if (err.code === 1) {
            setGeoError('Please enable GPS and allow location access')
          } else if (err.code === 2) {
            setGeoError('Unable to determine your location')
          } else {
            setGeoError('Failed to detect location')
          }
          setDetectingLocation(false)
          resolve()
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    })
  }, [setValue])

  useEffect(() => {
    if (!open) return

    if (mode === 'update' && initialData) {
      const values: Record<string, unknown> = {}
      registry.module.fields.forEach((field) => {
        if (field.type === 'array') {
          values[field.key] = Array.isArray(initialData.items) ? initialData.items : []
        } else {
          values[field.key] = initialData[field.key] ?? (field.type === 'boolean' ? false : '')
        }
      })
      setFormValues(values)
    } else {
      setFormValues(getDefaultValues(registry.module.fields))
    }
    // Auto-select fields based on role when creating
    if (mode === 'create' && user) {
      // Auto-select sales for Supplies, Returns, and Purchase Orders when logged in as Sales
      if (
        (registry.module.path === '/supplies' || registry.module.path === '/returns' || registry.module.path === '/purchase-orders') &&
        user.role === 'Sales'
      ) {
        setValue('sales_id', String(user.id))
      }
      // Auto-select and disable auditor for Stock Audits when logged in as Store Inspector
      if (registry.module.path === '/stock-audits' && user.role === 'Store Inspector') {
        setValue('auditor_id', String(user.id))
      }
    }
    // For outlets, try to auto-detect GPS coordinates on open when creating
    if (registry.module.path === '/outlets' && mode === 'create') {
      // attempt to detect location but don't block the modal
      detectLocation().catch(() => {})
    }
    setFieldErrors({})
  }, [open, mode, initialData, registry, user, setValue, detectLocation])

  // Ensure sales_id is autofilled for Sales role once relations load
  useEffect(() => {
    if (!open || mode !== 'create' || !user) return
    const isSalesRole = (role === 'Sales') || (String(user.role).toLowerCase() === 'sales')
    if ((registry.module.path === '/supplies' || registry.module.path === '/returns' || registry.module.path === '/purchase-orders') && isSalesRole) {
      // only set if not already set
      setFormValues((prev) => {
        if (prev.sales_id) return prev
        return { ...prev, sales_id: String(user.id) }
      })
    }
  }, [open, mode, registry.module.path, user, role, relations])

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    visibleFields.forEach((field) => {
      const value = formValues[field.key]
      if (field.required && (value === '' || value === null || value === undefined)) {
        errors[field.key] = `${field.label} is required`
      }
      if (field.type === 'array' && field.required) {
        const items = value as Record<string, unknown>[]
        if (!Array.isArray(items) || items.length === 0) {
          errors[field.key] = 'At least one item is required'
        }
        // Item-level validation for purchase orders: ensure outlet_id, product_id, requested_qty
        if (registry.module.path === '/purchase-orders' && Array.isArray(items)) {
          for (let i = 0; i < items.length; i++) {
            const it = items[i]
            if (!it) {
              errors[field.key] = `Item ${i + 1} is invalid`
              break
            }
            const outletId = it.outlet_id ?? it.outletId ?? it.outlet
            const productId = it.product_id ?? it.productId ?? it.product
            const reqQty = it.requested_qty ?? it.requestedQty ?? it.requested_qty
            if (!outletId || !productId || !reqQty || Number(reqQty) <= 0) {
              errors[field.key] = 'Each item must include Outlet, Product and Requested Qty (>0)'
              break
            }
          }
        }
      }
    })
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const buildPayload = (): Record<string, unknown> => {
    // Special-case payload shaping for Purchase Orders to strictly follow API_DOCS
    if (registry.module.path === '/purchase-orders') {
      const payload: Record<string, unknown> = {}
      // sales_id (optional for Manager/Super Admin; ignored for Sales by backend)
      if (formValues.sales_id) payload.sales_id = Number(formValues.sales_id)
      if (formValues.notes) payload.notes = String(formValues.notes)

      const itemsRaw = (formValues.items as Record<string, unknown>[]) ?? []
      const items = itemsRaw
        .map((it) => {
          const outlet_id = it?.outlet_id ?? it?.outletId ?? it?.outlet
          const product_id = it?.product_id ?? it?.productId ?? it?.product
          const requested_qty = it?.requested_qty ?? it?.requestedQty ?? it?.quantity
          const obj: Record<string, unknown> = {}
          if (outlet_id !== undefined && outlet_id !== null && outlet_id !== '') obj.outlet_id = Number(outlet_id)
          if (product_id !== undefined && product_id !== null && product_id !== '') obj.product_id = Number(product_id)
          if (requested_qty !== undefined && requested_qty !== null && requested_qty !== '') obj.requested_qty = Number(requested_qty)
          return obj
        })
        .filter((it) => Object.keys(it).length > 0)

      payload.items = items
      return payload
    }

    const payload: Record<string, unknown> = {}
    visibleFields.forEach((field) => {
      const value = formValues[field.key]
      if (field.type === 'array') {
        const items = (value as Record<string, unknown>[]).map((item) => {
          const cleaned: Record<string, unknown> = {}
          Object.entries(item).forEach(([k, v]) => {
            if (v !== '' && v !== null && v !== undefined) cleaned[k] = Number(v)
          })
          return cleaned
        })
        payload[field.key] = items
      } else if (field.type === 'boolean') {
        payload[field.key] = Boolean(value)
      } else if (field.type === 'number' || field.type === 'relation') {
        if (value !== '' && value !== null && value !== undefined) {
          payload[field.key] = Number(value)
        }
      } else if (field.type === 'password') {
        if (value) payload[field.key] = value
      } else if (value !== '' && value !== null && value !== undefined) {
        payload[field.key] = value
      }
    })
    return payload
  }

  const handleSubmit = async () => {
    if (!validate()) return
    await onSubmit(buildPayload())
  }

  const getOptionsForField = (fieldKey: string): SelectOption[] => {
    if (fieldKey === 'role') return roleOptions
    if (isOutletModule) {
      if (fieldKey === 'city_id') return cityOptions
      if (fieldKey === 'district_id') return districtOptions
      if (fieldKey === 'sub_district_id') return subDistrictOptions
      if (fieldKey === 'sales_area_id') return salesAreaOptions
    }
    const relationKey = getRelationOptionsKey(fieldKey)
    if (!relationKey || !relations) return []

    if (fieldKey === 'district_id' && formValues.city_id) {
      return relations.districts
        .filter((d) => d.city_id === Number(formValues.city_id))
        .map((o) => ({ value: o.value, label: o.label }))
    }
    if (fieldKey === 'sub_district_id' && formValues.district_id) {
      return relations.sub_districts
        .filter((s) => s.district_id === Number(formValues.district_id))
        .map((o) => ({ value: o.value, label: o.label }))
    }

    return (relations[relationKey] ?? []).map((o) => ({ value: o.value, label: o.label }))
  }

  const arrayFieldKey =
    registry.module.path === '/stock-audits'
      ? 'stock_audit_items'
      : registry.module.path === '/purchase-orders'
      ? 'purchase_order_items'
      : 'items'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? `Create ${registry.module.title}` : `Update ${registry.module.title}`}
      description={registry.module.description}
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} isLoading={isLoading}>
            {mode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error.message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {visibleFields.map((field) => {
            if (field.type === 'array') {
              return (
                <div key={field.key} className="sm:col-span-2">
                  <ModuleArrayField
                    label={field.label}
                    fields={
                      ARRAY_ITEM_FIELDS[arrayFieldKey] ?? ARRAY_ITEM_FIELDS.items ?? []
                    }
                    value={(formValues[field.key] as Record<string, unknown>[]) ?? []}
                    onChange={(items) => setValue(field.key, items)}
                    productOptions={relations?.products.map((p) => ({
                      value: p.value,
                      label: p.label,
                    }))}
                    outletOptions={isPurchaseOrderModule ? purchaseOrderOutletOptions : relations?.outlets.map((o) => ({ value: o.value, label: o.label }))}
                    addItemDisabled={isPurchaseOrderModule && !selectedSalesId}
                    outletDisabled={isPurchaseOrderModule && !selectedSalesId}
                    outletLoading={purchaseOrderOutletQuery.isFetching}
                    error={fieldErrors[field.key]}
                    required={field.required}
                  />
                </div>
              )
            }

            if (field.type === 'textarea') {
              return (
                <FormTextarea
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  value={String(formValues[field.key] ?? '')}
                  onChange={(event) => setValue(field.key, event.target.value)}
                  error={fieldErrors[field.key]}
                  className="sm:col-span-2"
                />
              )
            }

            if (field.type === 'boolean') {
              return (
                <div key={field.key} className="sm:col-span-2">
                  <Checkbox
                    label={field.label}
                    checked={Boolean(formValues[field.key])}
                    onChange={(event) => setValue(field.key, event.target.checked)}
                  />
                </div>
              )
            }

            if (field.type === 'select' || field.type === 'relation') {
              const isStoreInspector = user?.role === 'Store Inspector'
              const isSalesRole = (role === 'Sales') || (String(user?.role ?? '').toLowerCase() === 'sales')
              const outletCityLoading = field.key === 'city_id' && cityQuery.isFetching
              const outletDistrictLoading = field.key === 'district_id' && districtQuery.isFetching
              const outletSubDistrictLoading = field.key === 'sub_district_id' && subDistrictQuery.isFetching
              const outletSalesAreaLoading = field.key === 'sales_area_id' && salesAreaQuery.isFetching
              const outletCityDisabled = field.key === 'city_id' && cityQuery.isFetching
              const outletDistrictDisabled = field.key === 'district_id' && (!selectedCityId || districtQuery.isFetching)
              const outletSubDistrictDisabled = field.key === 'sub_district_id' && (!selectedDistrictId || subDistrictQuery.isFetching)
              const outletSalesAreaDisabled = field.key === 'sales_area_id' && salesAreaQuery.isFetching
              const disabled =
                (field.key === 'auditor_id' && isStoreInspector) ||
                (field.key === 'sales_id' && isSalesRole) ||
                outletCityDisabled ||
                outletDistrictDisabled ||
                outletSubDistrictDisabled ||
                outletSalesAreaDisabled
              const isLoading =
                outletCityLoading ||
                outletDistrictLoading ||
                outletSubDistrictLoading ||
                outletSalesAreaLoading
              return (
                <FormSelect
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  options={getOptionsForField(field.key)}
                  placeholder={`Select ${field.label}`}
                  value={String(formValues[field.key] ?? '')}
                  onChange={(event) => setValue(field.key, event.target.value)}
                  disabled={disabled}
                  isLoading={isLoading}
                  error={fieldErrors[field.key]}
                />
              )
            }

            // special handling for latitude/longitude: show detect button and hints
            if (field.key === 'latitude' || field.key === 'longitude') {
              const hint = geoError ? undefined : registry.module.path === '/outlets' ? 'Auto-detected from device GPS (or click detect)' : undefined
                return (
                <FormInput
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={String(formValues[field.key] ?? '')}
                  disabled={registry.module.path === '/outlets'}
                  onChange={(event) => setValue(field.key, event.target.value)}
                  error={fieldErrors[field.key] ?? (field.key === 'latitude' || field.key === 'longitude' ? geoError ?? undefined : undefined)}
                  hint={field.key === 'latitude' && geoError ? geoError : hint}
                  endAdornment={
                    field.key === 'latitude' ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => detectLocation()}
                        aria-label="Detect GPS location"
                        disabled={detectingLocation}
                      >
                        <FiCrosshair className="h-4 w-4" />
                      </Button>
                    ) : undefined
                  }
                />
              )
            }

            return (
              <FormInput
                key={field.key}
                label={field.label}
                required={field.required}
                type={
                  field.type === 'password'
                    ? 'password'
                    : field.type === 'email'
                      ? 'email'
                      : field.type === 'number'
                        ? 'number'
                        : 'text'
                }
                value={String(formValues[field.key] ?? '')}
                onChange={(event) =>
                  setValue(
                    field.key,
                    field.type === 'number' ? event.target.value : event.target.value,
                  )
                }
                error={fieldErrors[field.key]}
              />
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
