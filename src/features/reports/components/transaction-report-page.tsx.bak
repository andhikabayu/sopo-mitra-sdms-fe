'use client'

/* eslint-disable no-console */

import React, { useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useTransactionReport, exportTransactionReportToExcel } from '../hooks/use-reports'
import { TransactionReportTable } from './transaction-report-tables'
import { useDashboardStore, selectDateRange } from '@/features/dashboard/stores/dashboard.store'

/**
 * Transaction Report Page
 *
 * Standalone page for Transaction data with date filtering and export
 */
export function TransactionReportPage(): React.ReactElement {
  const dateRange = useDashboardStore(selectDateRange)

  // Fetch transaction data
  const { data: transactions = [], isLoading, isFetching, refetch } = useTransactionReport({
    date_from: dateRange.dateFrom,
    date_to: dateRange.dateTo,
  })

  useEffect(() => {
    console.log('[TransactionReportPage] dateRange changed:', dateRange)
    console.log('[TransactionReportPage] transactions:', transactions)
  }, [dateRange, transactions])

  const handleExport = async () => {
    try {
      await exportTransactionReportToExcel({
        date_from: dateRange.dateFrom,
        date_to: dateRange.dateTo,
      })
    } catch (error) {
      console.error('[TransactionReportPage] export error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All transaction details with filtering and export capabilities
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isLoading || transactions.length === 0}
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
            {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'} found
          </p>
        </div>
      </div>

      {/* Transaction Table */}
      <TransactionReportTable
        transactions={transactions}
        isLoading={isLoading || isFetching}
        onRefresh={() => refetch()}
      />
    </div>
  )
}
