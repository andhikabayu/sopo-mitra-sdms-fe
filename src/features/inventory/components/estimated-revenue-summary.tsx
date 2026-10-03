'use client'

import React from 'react'
import { useEstimatedAll } from '@/features/inventory/hooks/use-estimated-revenue'

export function EstimatedRevenueSummary() {
  const { data, isLoading } = useEstimatedAll()

  if (isLoading) return <div>Loading estimated revenue...</div>

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Estimated Revenue by Outlet</h3>
      <div className="grid grid-cols-2 gap-4">
        {data?.map((o) => (
          <div key={o.outlet_id} className="p-3 border rounded">
            <div className="font-semibold">{o.outlet_name}</div>
            <div>Total: {o.total_estimated_revenue.toLocaleString()}</div>
            <div>Refund Loss: {o.total_refund_loss.toLocaleString()}</div>
            <div className="font-bold">Net: {o.net_estimated_revenue.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
