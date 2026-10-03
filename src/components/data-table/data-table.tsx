'use client'

import { useMemo, useState } from 'react'
import { FiArrowDown, FiArrowUp, FiSearch } from 'react-icons/fi'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { formatBoolean, formatCurrency, formatDate, formatNumber } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export type ColumnFormat = 'text' | 'number' | 'boolean' | 'date' | 'currency' | 'badge' | 'index'

export interface DataTableColumn<T> {
  key: string
  label: string
  format?: ColumnFormat
  sortable?: boolean
  /** Custom cell renderer. Falls back to formatted value from `key`. */
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[]
  data: T[]
  isLoading?: boolean
  searchPlaceholder?: string
  searchKeys?: string[]
  emptyMessage?: string
  /** Row actions column */
  renderActions?: (row: T) => React.ReactNode
  getRowId?: (row: T) => string | number
  /**
   * Server-side pagination mode. When provided, the table will render `data` as-is
   * and delegate paging controls to the parent via callbacks.
   */
  serverSide?: {
    totalItems: number
    page: number
    perPage: number
    onPageChange: (page: number) => void
    onPerPageChange: (size: number) => void
  }
}

function getNestedValue(row: Record<string, unknown>, key: string): unknown {
  return row[key]
}

function formatCellValue(value: unknown, format: ColumnFormat = 'text'): React.ReactNode {
  switch (format) {
    case 'boolean':
      return (
        <Badge variant={value === true ? 'success' : value === false ? 'secondary' : 'default'}>
          {formatBoolean(value)}
        </Badge>
      )
    case 'date':
      return formatDate(value)
    case 'currency':
      return formatCurrency(value)
    case 'number':
      return formatNumber(value)
    case 'badge':
        if (!value && value !== 0) return '—'
        const raw = String(value).toLowerCase()
        // Map common status/approval values to badge variants
        if (raw === 'approved' || raw === 'approve') {
          return <Badge variant="success">{String(value)}</Badge>
        }
        if (raw === 'pending') {
          return <Badge variant="default">{String(value)}</Badge>
        }
        if (raw === 'rejected' || raw === 'reject') {
          return <Badge variant="destructive">{String(value)}</Badge>
        }
        // fallback: render default badge
        return <Badge>{String(value)}</Badge>
    default:
      if (value === null || value === undefined || value === '') return '—'
      return String(value)
  }
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  searchPlaceholder = 'Search...',
  searchKeys,
  emptyMessage = 'No records found.',
  renderActions,
  getRowId,
  serverSide,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const server = serverSide

  const keysToSearch = searchKeys ?? columns.map((column) => column.key)

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const query = search.toLowerCase()
    return data.filter((row) =>
      keysToSearch.some((key) => {
        const value = getNestedValue(row, key)
        return value !== null && value !== undefined && String(value).toLowerCase().includes(query)
      }),
    )
  }, [data, search, keysToSearch])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = getNestedValue(a, sortKey)
      const bVal = getNestedValue(b, sortKey)
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      const cmp = aVal < bVal ? -1 : 1
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = server ? Math.max(1, Math.ceil((server.totalItems ?? 0) / server.perPage)) : Math.ceil(sorted.length / perPage) || 1
  const currentPage = server ? server.page : Math.min(page, totalPages)
  const paginated = server ? sorted : sorted.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="overflow-hidden rounded-md border bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <FiSearch className="h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder={searchPlaceholder}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 font-medium',
                    column.sortable && 'cursor-pointer select-none hover:text-foreground',
                    column.className,
                  )}
                  onClick={() => handleSort(column.key, column.sortable)}
                >
                  <span className="inline-flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      sortDir === 'asc' ? (
                        <FiArrowUp className="h-3 w-3" />
                      ) : (
                        <FiArrowDown className="h-3 w-3" />
                      )
                    )}
                  </span>
                </th>
              ))}
              {renderActions && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-12 text-center">
                  <Spinner className="mx-auto" />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, index) => {
                const rowId = getRowId?.(row) ?? index
                const rowNumber = (currentPage - 1) * perPage + index + 1
                return (
                  <tr key={rowId} className="border-t hover:bg-muted/30">
                    {columns.map((column) => (
                      <td key={column.key} className={cn('px-4 py-3', column.className)}>
                        {column.render
                          ? column.render(row)
                          : column.format === 'index'
                          ? String(rowNumber)
                          : formatCellValue(getNestedValue(row, column.key), column.format)}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-4 py-3 text-right">{renderActions(row)}</td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={server ? server.totalItems : sorted.length}
        perPage={server ? server.perPage : perPage}
        onPageChange={server ? server.onPageChange : setPage}
        onPerPageChange={(size) => {
          if (server) return server.onPerPageChange(size)
          setPerPage(size)
          setPage(1)
        }}
      />
    </div>
  )
}
