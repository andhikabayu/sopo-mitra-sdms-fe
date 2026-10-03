'use client'

import { useState } from 'react'
import { UpdatedSalesList } from '@/features/dashboard/components/updated-sales-list'
import { SalesDetail } from '@/features/dashboard/components/sales-detail'

export default function SalesPage() {
  const [selectedSalesId, setSelectedSalesId] = useState<number | null>(null)

  if (selectedSalesId) {
    return (
      <div className="space-y-4">
        <SalesDetail
          salesId={selectedSalesId}
          onBack={() => setSelectedSalesId(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Sales Analytics (Updated)</h1>
        <p className="text-muted-foreground mt-2">
          Sales person performance with new field names and date filtering
        </p>
      </div>
      <UpdatedSalesList onSelectSales={setSelectedSalesId} />
    </div>
  )
}
