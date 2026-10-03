'use client'

import { useMemo, useState } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { ROUTES } from '@/config/routes'
import { useTransactionsList } from '../hooks/use-transactions'

type TransactionRow = {
  id: number
  outlet_name: string
  product_name: string
  sales_name: string
  sold_quantity: number
  revenue: number
  createdAt: string
}

export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(50)

  const queryParams = useMemo(
    () => ({
      sort: 'desc',
      limit: perPage,
      offset: (page - 1) * perPage,
    }),
    [page, perPage],
  )

  const { data, isLoading, error } = useTransactionsList(queryParams)

  const rows = useMemo<TransactionRow[]>(
    () =>
      (data?.items ?? []).map((item) => ({
        ...item,
        sales_name: item.sales?.[0]?.name ?? '—',
      })),
    [data?.items],
  )

  const totalItems = data?.metadata?.total ?? rows.length

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">{ROUTES.transactions}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Transaction history with outlet, product, sales, quantity, and revenue details.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {(error as { message?: string })?.message ?? 'Failed to load transactions.'}
        </div>
      )}

      <DataTable<TransactionRow>
        columns={[
          { key: '__index', label: 'No', format: 'index' },
          { key: 'outlet_name', label: 'Outlet Name', sortable: true },
          { key: 'product_name', label: 'Product Name', sortable: true },
          {
            key: 'sales_name',
            label: 'Sales Name',
            sortable: true,
            render: (row) => row.sales_name ?? '—',
          },
          { key: 'sold_quantity', label: 'Sold Quantity', format: 'number', sortable: true },
          { key: 'revenue', label: 'Revenue', format: 'currency', sortable: true },
          { key: 'createdAt', label: 'Created At', format: 'date', sortable: true },
        ]}
        data={rows}
        isLoading={isLoading}
        searchPlaceholder="Search transactions..."
        searchKeys={['outlet_name', 'product_name', 'sales_name', 'sold_quantity', 'revenue', 'createdAt']}
        emptyMessage="No transactions found."
        getRowId={(row) => row.id}
        serverSide={{
          totalItems,
          page,
          perPage,
          onPageChange: (nextPage) => setPage(nextPage),
          onPerPageChange: (nextPerPage) => {
            setPerPage(nextPerPage)
            setPage(1)
          },
        }}
      />
    </section>
  )
}
