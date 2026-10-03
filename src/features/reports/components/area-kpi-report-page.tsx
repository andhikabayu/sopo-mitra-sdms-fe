'use client'

/* eslint-disable no-console */

import React, { useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useAreaKPIReport, exportAreaKPIReportToExcel } from '../hooks/use-reports'
import { AreaKPIReportTable } from './kpi-report-tables'
import { useDashboardStore, selectDateRange } from '@/features/dashboard/stores/dashboard.store'

/**
 * Area KPI Report Page
 *
 * Standalone page for Area KPI data with date filtering and export
 */
export function AreaKPIReportPage(): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)

  // Fetch area KPI data
  const { data: areas = [], isLoading, isFetching, refetch } = useAreaKPIReport({
    date_from: dateRange.date_from,
    date_to: dateRange.date_to,
  })

  useEffect(() => {
    console.log('[AreaKPIReportPage] dateRange changed:', dateRange)
    console.log('[AreaKPIReportPage] areas:', areas)
  }, [dateRange, areas])

  const handleExport = async () => {
    try {
      await exportAreaKPIReportToExcel({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
      })
    } catch (error) {
      console.error('[AreaKPIReportPage] export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Area KPI</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Area performance and sales metrics by sales area.
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isLoading || areas.length === 0}
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
            {areas.length} {areas.length === 1 ? 'area' : 'areas'} found
          </p>
        </div>
      </div>

      {/* Area KPI Table */}
      <AreaKPIReportTable
        areas={areas}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
      />
    </div>
  )
}
