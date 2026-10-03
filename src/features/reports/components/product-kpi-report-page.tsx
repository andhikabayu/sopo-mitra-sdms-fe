'use client'

/* eslint-disable no-console */

import React, { useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useProductKPIReport, exportProductKPIReportToExcel } from '../hooks/use-reports'
import { ProductKPIReportTable } from './kpi-report-tables'
import { useDashboardStore, selectDateRange } from '@/features/dashboard/stores/dashboard.store'

/**
 * Product KPI Report Page
 *
 * Standalone page for Product KPI data with date filtering and export
 */
export function ProductKPIReportPage(): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)

  // Fetch product KPI data
  const { data: products = [], isLoading, isFetching, refetch } = useProductKPIReport({
    date_from: dateRange.date_from,
    date_to: dateRange.date_to,
  })

  useEffect(() => {
    console.log('[ProductKPIReportPage] dateRange changed:', dateRange)
    console.log('[ProductKPIReportPage] products:', products)
  }, [dateRange, products])

  const handleExport = async () => {
    try {
      await exportProductKPIReportToExcel({
        date_from: dateRange.date_from,
        date_to: dateRange.date_to,
      })
    } catch (error) {
      console.error('[ProductKPIReportPage] export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product KPI</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Product performance, best seller, and slow moving reports.
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isLoading || products.length === 0}
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
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      {/* Product KPI Table */}
      <ProductKPIReportTable
        products={products}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
      />
    </div>
  )
}
