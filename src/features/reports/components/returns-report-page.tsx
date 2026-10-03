'use client'

/* eslint-disable no-console */

import React, { useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useReturnsReport, exportReturnsReportToExcel } from '../hooks/use-reports'
import { ReturnsReportTable } from './transaction-report-tables'
import { useDashboardStore, selectDateRange } from '@/features/dashboard/stores/dashboard.store'

/**
 * Returns Report Page
 *
 * Standalone page for Returns data with date filtering and export
 */
export function ReturnsReportPage(): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)

  // Fetch returns data
  const { data: returns = [], isLoading, isFetching, refetch } = useReturnsReport({
    date_from: dateRange.date_from,
    date_to: dateRange.date_to,
  })

  useEffect(() => {
    console.log('[ReturnsReportPage] dateRange changed:', dateRange)
    console.log('[ReturnsReportPage] returns:', returns)
  }, [dateRange, returns])

  const handleExport = async () => {
    try {
      await exportReturnsReportToExcel({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
      })
    } catch (error) {
      console.error('[ReturnsReportPage] export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Returns</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All return documents with filtering and export capabilities
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isLoading || returns.length === 0}
          className="gap-2"
        >
          <FiDownload className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Showing data from <span className="font-semibold text-foreground">{dateRange.date_from}</span> to{' '}
            <span className="font-semibold text-foreground">{dateRange.date_to}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {returns.length} {returns.length === 1 ? 'return' : 'returns'} found
          </p>
        </div>
      </div>

      {/* Returns Table */}
      <ReturnsReportTable
        returns={returns}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
      />
    </div>
  )
}
