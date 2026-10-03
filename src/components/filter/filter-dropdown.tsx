"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormTextarea } from '@/components/form/form-textarea'
import { useRelationOptions } from '@/features/modules/hooks/use-module-crud'
import { FiFilter, FiX } from 'react-icons/fi'

interface FilterField {
  key: string
  label: string
  type: 'text' | 'select' | 'textarea' | 'boolean'
  options?: Array<{ value: any; label: string }>
}

interface FilterDropdownProps {
  fields: FilterField[]
  onApply?: (params: Record<string, any>) => void
  triggerLabel?: string
}

export function FilterDropdown({ fields, onApply, triggerLabel = 'Filter' }: FilterDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initial = useMemo(() => {
    const obj: Record<string, any> = {}
    for (const key of Array.from(searchParams.keys())) {
      obj[key] = searchParams.get(key)
    }
    return obj
  }, [searchParams])

  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Record<string, any>>(initial)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setValues(initial)
  }, [initial])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const relationOptions = useRelationOptions()

  const getOptions = (field: FilterField) => {
    if (field.options) return field.options
    if (field.key === 'city_id') return relationOptions.data?.cities?.map((c: any) => ({ value: c.value, label: c.label })) ?? []
    if (field.key === 'district_id') return relationOptions.data?.districts?.map((d: any) => ({ value: d.value, label: d.label })) ?? []
    if (field.key === 'sub_district_id') return relationOptions.data?.sub_districts?.map((s: any) => ({ value: s.value, label: s.label })) ?? []
    if (field.key === 'approval')
      return [
        { value: 'Pending', label: 'Pending' },
        { value: 'Approve', label: 'Approve' },
        { value: 'Reject', label: 'Reject' },
      ]
    return []
  }

  const apply = () => {
    const params: Record<string, any> = {}
    for (const f of fields) {
      const v = values[f.key]
      if (v !== undefined && v !== null && String(v) !== '') params[f.key] = v
    }
    // reset to first page when applying filters
    params.offset = 0
    if (onApply) onApply(params)
    // update URL
    const url = new URL(window.location.href)
    // remove existing keys for the fields
    for (const f of fields) url.searchParams.delete(f.key)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    router.replace(url.pathname + url.search)
    setOpen(false)
  }

  const reset = () => {
    setValues({})
    if (onApply) onApply({ offset: 0 })
    const url = new URL(window.location.href)
    for (const f of fields) url.searchParams.delete(f.key)
    router.replace(url.pathname + url.search)
    setOpen(false)
  }

  const activeCount = Object.entries(values).filter(([k, v]) => v !== undefined && v !== null && String(v) !== '').length

  return (
    <div className="relative inline-block" ref={ref}>
      <Button variant="ghost" onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-2">
        <FiFilter />
        <span className="text-sm">{triggerLabel}</span>
        {activeCount > 0 && <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-2 text-xs text-primary">{activeCount}</span>}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80">
          <div className="relative">
            <div className="absolute -top-2 right-6 h-3 w-3 rotate-45 bg-background border-l border-t border-border" />
            <div className="rounded-md border bg-background p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filters</h3>
                <button onClick={() => setOpen(false)} className="-mr-2 inline-flex h-7 w-7 items-center justify-center rounded hover:bg-muted/30">
                  <FiX className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="mt-3 grid gap-3">
                {fields.filter((f) => f.key !== 'approval').map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs text-muted-foreground">{f.label}</label>
                    {f.type === 'text' && (
                      <Input value={values[f.key] ?? ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                    )}
                    {f.type === 'textarea' && (
                      <FormTextarea value={values[f.key] ?? ''} onChange={(e: any) => setValues({ ...values, [f.key]: e.target.value })} />
                    )}
                    {f.type === 'select' && (
                      <Select
                        options={[{ value: '', label: '--' }, ...getOptions(f)]}
                        value={values[f.key] ?? ''}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      />
                    )}
                    {f.type === 'boolean' && (
                      <Select
                        options={[{ value: '', label: '--' }, { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]}
                        value={values[f.key] ?? ''}
                        onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={reset}>Reset</Button>
                <Button onClick={apply}>Apply</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
