'use client'

/* eslint-disable no-console */

import React, { useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useSalesKPIReport, exportSalesKPIReportToExcel } from '../hooks/use-reports'
import { SalesKPIReportTable } from './kpi-report-tables'
import { useDashboardStore, selectDateRange } from '@/features/dashboard/stores/dashboard.store'

/**
 * Sales KPI Report Page
 *
 * Standalone page for Sales KPI data with date filtering and export
 */
export function SalesKPIReportPage(): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)

  // Fetch sales KPI data
  const { data: sales = [], isLoading, isFetching, refetch } = useSalesKPIReport({
    date_from: dateRange.date_from,
    date_to: dateRange.date_to,
  })

  useEffect(() => {
    console.log('[SalesKPIReportPage] dateRange changed:', dateRange)
    console.log('[SalesKPIReportPage] sales:', sales)
  }, [dateRange, sales])

  const handleExport = async () => {
    try {
      await exportSalesKPIReportToExcel({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
      })
    } catch (error) {
      console.error('[SalesKPIReportPage] export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales KPI</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sales performance and metrics by sales person.
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isLoading || sales.length === 0}
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
            {sales.length} {sales.length === 1 ? 'sales person' : 'sales people'} found
          </p>
        </div>
      </div>

      {/* Sales KPI Table */}
      <SalesKPIReportTable
        sales={sales}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
      />
    </div>
  )
}
