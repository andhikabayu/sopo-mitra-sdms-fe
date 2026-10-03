'use client'

import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { FormSelect } from '@/components/form/form-select'
import { FormInput } from '@/components/form/form-input'
import type { SelectOption } from '@/components/ui/select'

export interface ArrayItemField {
  key: string
  label: string
  type: 'relation' | 'number'
}

export interface ModuleArrayFieldProps {
  label: string
  fields: ArrayItemField[]
  value: Record<string, unknown>[]
  onChange: (items: Record<string, unknown>[]) => void
  productOptions?: SelectOption[]
  outletOptions?: SelectOption[]
  addItemDisabled?: boolean
  outletDisabled?: boolean
  outletLoading?: boolean
  error?: string
  required?: boolean
}

export function ModuleArrayField({
  label,
  fields,
  value,
  onChange,
  productOptions = [],
  outletOptions = [],
  addItemDisabled = false,
  outletDisabled = false,
  outletLoading = false,
  error,
  required,
}: ModuleArrayFieldProps) {
  const addItem = () => {
    const empty: Record<string, unknown> = {}
    fields.forEach((field) => {
      empty[field.key] = field.type === 'number' ? '' : ''
    })
    onChange([...value, empty])
  }

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, key: string, val: unknown) => {
    const next = value.map((item, i) => (i === index ? { ...item, [key]: val } : item))
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </span>
        <Button type="button" variant="outline" size="sm" onClick={addItem} disabled={addItemDisabled}>
          <FiPlus className="h-3.5 w-3.5" />
          Add Item
        </Button>
      </div>
      {value.length === 0 ? (
        <p className="rounded-md border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
          No items added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={index} className="flex items-start gap-2 rounded-md border bg-muted/20 p-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                {fields.map((field) =>
                  field.type === 'relation' ? (
                    <FormSelect
                      key={field.key}
                      label={field.label}
                      options={field.key === 'product_id' ? productOptions : field.key === 'outlet_id' ? outletOptions ?? [] : productOptions}
                      placeholder={`Select ${field.label}`}
                      value={String(item[field.key] ?? '')}
                      onChange={(event) => updateItem(index, field.key, Number(event.target.value))}
                      disabled={field.key === 'outlet_id' ? outletDisabled : false}
                      isLoading={field.key === 'outlet_id' ? outletLoading : false}
                    />
                  ) : (
                    <FormInput
                      key={field.key}
                      label={field.label}
                      type="number"
                      min={0}
                      value={String(item[field.key] ?? '')}
                      onChange={(event) =>
                        updateItem(index, field.key, Number(event.target.value))
                      }
                    />
                  ),
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6 shrink-0 text-destructive"
                onClick={() => removeItem(index)}
                aria-label="Remove item"
              >
                <FiTrash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
