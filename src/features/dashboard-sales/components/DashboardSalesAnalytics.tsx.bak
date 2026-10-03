"use client"

import { useAuth } from '@/features/auth/hooks/use-auth'
import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { FiRefreshCw } from 'react-icons/fi'
import { DashboardSalesCards } from './DashboardSalesCards'
import { useDashboardSales } from '../hooks/use-dashboard-sales'
import { formatCurrency, formatNumber } from '@/lib/utils/format'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RBAC } from '@/config/rbac'

export function DashboardSalesAnalytics() {
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardSales('monthly')

  const router = useRouter()

  useEffect(() => {
    if (user && user.role && user.role !== RBAC.SALES) {
      router.replace('/dashboard')
    }
  }, [user, router])

  if (isLoading) return <div className="flex min-h-[320px] items-center justify-center"><Spinner className="h-8 w-8 text-primary" /></div>
  if (isError || !data) {
    return (
      <section className="rounded-lg border bg-card p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold">Sales Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Failed to load your sales payout. Please try again.</p>
        <Button className="mt-4" variant="outline" onClick={() => refetch()}>
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
            <FiRefreshCw className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">Welcome{user ? `, ${user.name}` : ''}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Sales Dashboard</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Monthly payout summary</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? <Spinner className="mr-2 h-4 w-4" /> : <FiRefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </header>

      <DashboardSalesCards payout={data} />

      <section className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold">Payout breakdown by outlet</h3>
        <div className="overflow-x-auto mt-3">
          <DataTable
            columns={[
              { key: 'outlet_name', label: 'Outlet' },
              { key: 'units', label: 'Units' },
              { key: 'revenue', label: 'Revenue' },
            ]}
            data={data.breakdown.map((b) => ({
              outlet_name: b.outlet_name,
              units: formatNumber(b.units),
              revenue: formatCurrency(b.revenue),
            }))}
            getRowId={(r: any) => r.outlet_name}
            isLoading={false}
          />
        </div>
      </section>
    </div>
  )
}
