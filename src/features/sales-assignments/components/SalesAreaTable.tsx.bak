'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FiEye } from 'react-icons/fi'
import { Spinner } from '@/components/ui/spinner'
import { useSalesAreasList } from '../hooks/use-sales-assignments'
import SalesAreaDetailModal from './SalesAreaDetailModal'
import { DataTable } from '@/components/data-table/data-table'

export default function SalesAreaTable() {
  const { data = [], isLoading } = useSalesAreasList()
  const [detailId, setDetailId] = useState<number | null>(null)

  const columns = useMemo(() => [
    { key: '__index', label: 'No', format: 'index' as const },
    { key: 'name', label: 'Sales Area Name' },
  ], [])

  const renderActions = useCallback((row: any) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setDetailId(row.id)}
      aria-label="View detail"
    >
      <FiEye className="h-4 w-4" />
    </Button>
  ), [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <DataTable columns={columns} data={data} isLoading={isLoading} renderActions={renderActions} getRowId={(r) => r.id} />

      {detailId && (
        <SalesAreaDetailModal open={Boolean(detailId)} onClose={() => setDetailId(null)} salesAreaId={detailId} />
      )}
    </>
  )
}
