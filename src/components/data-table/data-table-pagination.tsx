'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

export interface DataTablePaginationProps {
  page: number
  totalPages: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
}

export function DataTablePagination({
  page,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange,
}: DataTablePaginationProps) {
  const from = totalItems === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, totalItems)

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {from}–{to} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        {onPerPageChange && (
          <select
            value={perPage}
            onChange={(event) => onPerPageChange(Number(event.target.value))}
            className="h-8 rounded-md border border-input bg-card px-2 text-sm"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-4 w-4" />
        </Button>
        <span className={cn('min-w-[4rem] text-center text-sm')}>
          {page} / {Math.max(totalPages, 1)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <FiChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
