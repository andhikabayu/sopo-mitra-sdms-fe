'use client'

/* eslint-disable no-console */

import React from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { DataTable } from '@/components/data-table/data-table'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import type { TransactionReport, SupplyReport, ReturnReport } from '../types/reports.types'

// ============================================================================
// Transaction Report Table
// ============================================================================

export function TransactionReportTable({ transactions, isLoading, onRefresh }: {
  transactions: TransactionReport[]
  isLoading: boolean
  onRefresh?: () => void
}) {
  console.log('[TransactionReportTable] transactions received:', transactions)
  console.log('[TransactionReportTable] transactions type:', typeof transactions)
  console.log('[TransactionReportTable] transactions is array:', Array.isArray(transactions))
  console.log('[TransactionReportTable] transactions length:', transactions.length)
  const firstTransaction = transactions[0]
  if (firstTransaction) {
    console.log('[TransactionReportTable] first item keys:', Object.keys(firstTransaction))
    console.log('[TransactionReportTable] first item:', firstTransaction)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaction Details</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !Array.isArray(transactions) || transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No transaction data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <DataTable
            columns={[
              { key: 'id', label: 'ID', format: 'number' },
              { key: 'transaction_date', label: 'Transaction Date', format: 'date' },
              { key: 'outlet_name', label: 'Outlet' },
              { key: 'product_name', label: 'Product' },
              { key: 'product_sku', label: 'SKU' },
              { key: 'product_unit', label: 'Unit' },
              { key: 'quantity_supplied', label: 'Supplied', format: 'number' },
              { key: 'quantity_returned', label: 'Returned', format: 'number' },
              { key: 'quantity_sold', label: 'Sold', format: 'number' },
              { key: 'revenue', label: 'Revenue', format: 'currency' },
              { key: 'source_document', label: 'Source Doc' },
            ]}
            data={transactions.map((row) => {
              console.log('[TransactionReportTable] mapping row:', row)
              return row
            })}
            isLoading={false}
            getRowId={(r: any) => String(r.id || Math.random())}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Supplies Report Table
// ============================================================================

export function SuppliesReportTable({ supplies, isLoading, onRefresh }: {
  supplies: SupplyReport[]
  isLoading: boolean
  onRefresh?: () => void
}) {
  console.log('[SuppliesReportTable] supplies received:', supplies)
  console.log('[SuppliesReportTable] supplies type:', typeof supplies)
  console.log('[SuppliesReportTable] supplies is array:', Array.isArray(supplies))
  console.log('[SuppliesReportTable] supplies length:', supplies.length)
  const firstSupply = supplies[0]
  if (firstSupply) {
    console.log('[SuppliesReportTable] first item keys:', Object.keys(firstSupply))
    console.log('[SuppliesReportTable] first item:', firstSupply)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Supply Details</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !Array.isArray(supplies) || supplies.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No supply data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <DataTable
            columns={[
              { key: 'supply_no', label: 'Supply No' },
              { key: 'supply_date', label: 'Supply Date', format: 'date' },
              { key: 'outlet_name', label: 'Outlet' },
              { key: 'sales_name', label: 'Sales Person' },
              { key: 'total_quantity', label: 'Total Qty', format: 'number' },
              { key: 'total_amount', label: 'Total Amount', format: 'currency' },
              { key: 'items_count', label: 'Items Count', format: 'number' },
              { key: 'status', label: 'Status', format: 'badge' },
            ]}
            data={supplies.map((row) => {
              console.log('[SuppliesReportTable] mapping row:', row)
              return row
            })}
            isLoading={false}
            getRowId={(r: any) => String(r.supply_no || r.id || Math.random())}
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Returns Report Table
// ============================================================================

export function ReturnsReportTable({ returns, isLoading, onRefresh }: {
  returns: ReturnReport[]
  isLoading: boolean
  onRefresh?: () => void
}) {
  console.log('[ReturnsReportTable] returns received:', returns)
  console.log('[ReturnsReportTable] returns type:', typeof returns)
  console.log('[ReturnsReportTable] returns is array:', Array.isArray(returns))
  console.log('[ReturnsReportTable] returns length:', returns.length)
  const firstReturn = returns[0]
  if (firstReturn) {
    console.log('[ReturnsReportTable] first item keys:', Object.keys(firstReturn))
    console.log('[ReturnsReportTable] first item:', firstReturn)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Return Details</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : !Array.isArray(returns) || returns.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">No return data available</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <DataTable
            columns={[
              { key: 'return_no', label: 'Return No' },
              { key: 'return_date', label: 'Return Date', format: 'date' },
              { key: 'outlet_name', label: 'Outlet' },
              { key: 'product_name', label: 'Product' },
              { key: 'product_sku', label: 'SKU' },
              { key: 'quantity_returned', label: 'Qty Returned', format: 'number' },
              { key: 'return_reason', label: 'Return Reason' },
            ]}
            data={returns.map((row) => {
              console.log('[ReturnsReportTable] mapping row:', row)
              return row
            })}
            isLoading={false}
            getRowId={(r: any) => String(r.return_no || r.id || Math.random())}
          />
        </div>
      )}
    </div>
  )
}
