'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface Item {
  id: number
  label: string
  meta?: string
}

interface Props {
  items: Item[]
  selectedIds: number[]
  onToggle: (id: number) => void
}

export function CheckboxList({ items, selectedIds, onToggle }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto">
      {items.map((it) => (
        <div key={it.id} className="flex items-center justify-between rounded border px-3 py-2">
          <div>
            <div className="font-medium">{it.label}</div>
            {it.meta && <div className="text-xs text-muted-foreground">{it.meta}</div>}
          </div>
          <Checkbox checked={selectedIds.includes(it.id)} onChange={() => onToggle(it.id)} />
        </div>
      ))}
    </div>
  )
}

export default CheckboxList
