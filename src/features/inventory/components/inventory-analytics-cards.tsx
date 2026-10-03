"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiShoppingBag, FiPackage, FiBox } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'
import { DataTable } from '@/components/data-table/data-table'
import { KpiStatCard } from '@/features/dashboard/components/kpi-stat-card'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { RBAC } from '@/config/rbac'
import { useSalesById, useSalesTotalOutlets } from '../hooks/use-inventory'
import { useInventoryTotals } from '../hooks/use-inventory-totals'
import { formatNumber } from '@/lib/utils/format'

export function InventoryAnalyticsCards() {
  const router = useRouter()
  const { user } = useAuth()
  const isSalesRole = user?.role === RBAC.SALES || String(user?.role).toLowerCase() === 'sales'
  const { data, isLoading, isError } = useInventoryTotals()
  const { data: salesTotalOutlets, isLoading: isSalesOutletLoading, isError: isSalesOutletError } = useSalesTotalOutlets(isSalesRole)
  const { data: salesInventory, isLoading: isSalesInventoryLoading, isError: isSalesInventoryError } = useSalesById(isSalesRole ? user?.id : undefined)
  const [isHeldInventoryOpen, setIsHeldInventoryOpen] = useState(false)
  const [isTotalOutletsOpen, setIsTotalOutletsOpen] = useState(false)

  const outletColumns = useMemo(() => [
    { key: 'outlet_name', label: 'Outlet Name', sortable: true },
    { key: 'outlet_type', label: 'Outlet Type', sortable: true },
    { key: 'pic_name', label: 'PIC', sortable: true },
    { key: 'phone_number', label: 'Phone Number', sortable: true },
    { key: 'city', label: 'City', sortable: true },
    { key: 'district', label: 'District', sortable: true },
    { key: 'sub_district', label: 'Sub District', sortable: true },
    { key: 'sales_area', label: 'Sales Area', sortable: true },
    { key: 'address', label: 'Address' },
    { key: 'status', label: 'Status', format: 'boolean', sortable: true },
  ], [])

  const totalHeldQty = useMemo(
    () => (salesInventory ?? []).reduce((total, item) => total + (item.held_qty ?? 0), 0),
    [salesInventory],
  )

  const heldInventoryRows = useMemo(
    () => (salesInventory ?? []).filter((item) => item.held_qty > 0),
    [salesInventory],
  )

  if (isLoading || (isSalesRole && (isSalesOutletLoading || isSalesInventoryLoading))) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )
  }

  if (isError || (isSalesRole && (isSalesOutletError || isSalesInventoryError)) || !data) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to load inventory summary.
      </div>
    )
  }

  const totals = data as { total_outlets: number; total_products: number; total_outlet_stock: number; total_held_by_sales: number }
  const salesOutletRows = salesTotalOutlets?.outlets ?? []
  const totalOutletsValue = isSalesRole ? Number(salesTotalOutlets?.total_outlets ?? totals.total_outlets) : totals.total_outlets

  return (
    <section aria-label="Inventory Summary">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Inventory Summary</h2>
      </div>
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
        {isSalesRole ? (
          <button type="button" className="w-full text-left" onClick={() => setIsTotalOutletsOpen(true)}>
            <KpiStatCard label="Total Outlets" value={formatNumber(totalOutletsValue)} hint="Approved outlets" icon={FiShoppingBag} accent="muted" />
          </button>
        ) : (
          <button type="button" className="w-full text-left" onClick={() => router.push('/outlets')}>
            <KpiStatCard label="Total Outlets" value={formatNumber(totals.total_outlets)} hint="Approved outlets" icon={FiShoppingBag} accent="muted" />
          </button>
        )}
        <KpiStatCard label="Total Products" value={formatNumber(totals.total_products)} hint="Products in catalog" icon={FiPackage} accent="primary" />
        <KpiStatCard label="Total Stock" value={formatNumber(totals.total_outlet_stock)} hint="Sum of stock across outlets" icon={FiBox} accent="success" />
        {!isSalesRole && (
          <KpiStatCard label="Total Held by Sales" value={formatNumber(totals.total_held_by_sales)} hint="Products held in sales inventory" icon={FiPackage} accent="warning" />
        )
        }
        {isSalesRole ? (
          <button type="button" className="w-full text-left" onClick={() => setIsHeldInventoryOpen(true)}>
            <KpiStatCard label="Held Inventory" value={formatNumber(totalHeldQty)} hint="Products held in sales inventory" icon={FiPackage} accent="warning" />
          </button>
        ) : null}
      </div>

      {isSalesRole ? (
        <Modal
          open={isHeldInventoryOpen}
          onClose={() => setIsHeldInventoryOpen(false)}
          title="Held Inventory"
          size="lg"
          footer={
            <Button type="button" variant="outline" onClick={() => setIsHeldInventoryOpen(false)}>
              Close
            </Button>
          }
        >
          {heldInventoryRows.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No held inventory found.</div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product Name</th>
                    <th className="px-4 py-3 font-medium">Held Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {heldInventoryRows.map((item) => (
                    <tr key={`${item.product_id}-${item.sku}`} className="border-t">
                      <td className="px-4 py-3">{item.product_name}</td>
                      <td className="px-4 py-3">{formatNumber(item.held_qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      ) : null}

      {isSalesRole ? (
        <Modal
          open={isTotalOutletsOpen}
          onClose={() => setIsTotalOutletsOpen(false)}
          title="Total Outlets"
          size="xl"
          footer={
            <Button type="button" variant="outline" onClick={() => setIsTotalOutletsOpen(false)}>
              Close
            </Button>
          }
        >
          {salesOutletRows.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No outlets found.</div>
          ) : (
            <DataTable
              columns={outletColumns as never}
              data={salesOutletRows as never}
              searchPlaceholder="Search outlets..."
              getRowId={(row) => Number(row.id)}
            />
          )}
        </Modal>
      ) : null}
    </section>
  )
}

export default InventoryAnalyticsCards
