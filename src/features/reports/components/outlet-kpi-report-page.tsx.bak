'use client'

/* eslint-disable no-console */

import React, { useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useOutletKPIReport, exportOutletKPIReportToExcel } from '../hooks/use-reports'
import { OutletKPIReportTable } from './kpi-report-tables'
import { useDashboardStore, selectDateRange } from '@/features/dashboard/stores/dashboard.store'

/**
 * Outlet KPI Report Page
 *
 * Standalone page for Outlet KPI data with date filtering and export
 */
export function OutletKPIReportPage(): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)

  // Fetch outlet KPI data
  const { data: outlets = [], isLoading, isFetching, refetch } = useOutletKPIReport({
    date_from: dateRange.dateFrom,
    date_to: dateRange.dateTo,
  })

  useEffect(() => {
    console.log('[OutletKPIReportPage] dateRange changed:', dateRange)
    console.log('[OutletKPIReportPage] outlets:', outlets)
  }, [dateRange, outlets])

  const handleExport = async () => {
    try {
      await exportOutletKPIReportToExcel({
        date_from: dateRange.dateFrom,
        date_to: dateRange.dateTo,
      })
    } catch (error) {
      console.error('[OutletKPIReportPage] export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outlet KPI</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Outlet performance and sales metrics across all locations.
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isLoading || outlets.length === 0}
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
            Showing data from <span className="font-semibold text-foreground">{dateRange.dateFrom}</span> to{' '}
            <span className="font-semibold text-foreground">{dateRange.dateTo}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {outlets.length} {outlets.length === 1 ? 'outlet' : 'outlets'} found
          </p>
        </div>
      </div>

      {/* Outlet KPI Table */}
      <OutletKPIReportTable
        outlets={outlets}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
      />
    </div>
  )
}
