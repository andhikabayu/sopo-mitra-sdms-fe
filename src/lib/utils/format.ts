import { format, parseISO, isValid } from 'date-fns'

export function formatDate(value: unknown): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? parseISO(value) : value instanceof Date ? value : null
  if (!date || !isValid(date)) return String(value)
  return format(date, 'dd MMM yyyy HH:mm')
}

export function formatCurrency(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}

export function formatBoolean(value: unknown): string {
  if (value === true) return 'Active'
  if (value === false) return 'Inactive'
  return '—'
}

export function formatNumber(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return new Intl.NumberFormat('id-ID').format(num)
}

export function formatPercent(value: unknown, fractionDigits = 2): string {
  if (value === null || value === undefined || value === '') return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return `${num.toFixed(fractionDigits)}%`
}
