import React from 'react'
import { Metadata } from 'next'
import { use } from 'react'
import { inventoryApi } from '@/features/inventory/api/inventory.api'
import { DataTable } from '@/components/data-table/data-table'

export const metadata: Metadata = {
  title: 'Estimated Revenue',
}

export default async function OutletEstimatedPage({ params }: { params: { outletId: string } }) {
  const outletId = Number(params.outletId)
  // server component fetch
  const data = await inventoryApi.getEstimatedByOutlet(outletId)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Estimated Revenue - {data.outlet_name}</h1>
      <div className="mt-4">
        <div>Total Estimated Revenue: {data.total_estimated_revenue.toLocaleString()}</div>
        <div>Total Refund Loss: {data.total_refund_loss.toLocaleString()}</div>
        <div className="font-bold">Net: {data.net_estimated_revenue.toLocaleString()}</div>
      </div>
      <section className="mt-6">
        <h2 className="text-lg font-medium">Breakdown</h2>
        <DataTable
          columns={[
            { key: 'product_name', label: 'Product' },
            { key: 'sku', label: 'SKU' },
            { key: 'quantity', label: 'Qty' },
            { key: 'unit_price', label: 'Unit Price' },
            { key: 'estimated_revenue', label: 'Estimated' },
          ]}
          data={data.breakdown.map((b: any) => ({
            ...b,
            unit_price: b.unit_price.toLocaleString(),
            estimated_revenue: b.estimated_revenue.toLocaleString(),
          }))}
          isLoading={false}
          getRowId={(r) => r.product_id}
        />
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-medium">Refund Breakdown</h2>
        <ul className="list-disc ml-6 mt-2">
          {data.refund_breakdown.map((r) => (
            <li key={r.product_id}>
              {r.product_name} — Qty: {r.quantity} — Loss: {r.loss.toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
