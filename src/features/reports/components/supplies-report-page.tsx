'use client'

/* eslint-disable no-console */

import React, { useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useSuppliesReport, exportSuppliesReportToExcel } from '../hooks/use-reports'
import { SuppliesReportTable } from './transaction-report-tables'
import { useDashboardStore, selectDateRange } from '@/features/dashboard/stores/dashboard.store'

/**
 * Supplies Report Page
 *
 * Standalone page for Supplies data with date filtering and export
 */
export function SuppliesReportPage(): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)

  // Fetch supplies data
  const { data: supplies = [], isLoading, isFetching, refetch } = useSuppliesReport({
    date_from: dateRange.date_from,
    date_to: dateRange.date_to,
  })

  useEffect(() => {
    console.log('[SuppliesReportPage] dateRange changed:', dateRange)
    console.log('[SuppliesReportPage] supplies:', supplies)
  }, [dateRange, supplies])

  const handleExport = async () => {
    try {
      await exportSuppliesReportToExcel({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
      })
    } catch (error) {
      console.error('[SuppliesReportPage] export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplies</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All supply documents with filtering and export capabilities
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isLoading || supplies.length === 0}
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
            {supplies.length} {supplies.length === 1 ? 'supply' : 'supplies'} found
          </p>
        </div>
      </div>

      {/* Supplies Table */}
      <SuppliesReportTable
        supplies={supplies}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
      />
    </div>
  )
}
