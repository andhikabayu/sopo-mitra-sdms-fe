'use client'

import React from 'react'
import { Input } from '@/components/ui/input'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: Props) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  )
}

export default SearchInput
