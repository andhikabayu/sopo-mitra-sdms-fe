'use client'

import { useState } from 'react'
import { UpdatedOutletsList } from '@/features/dashboard/components/updated-outlets-list'
import { OutletDetail } from '@/features/dashboard/components/outlet-detail'

export default function OutletsPage() {
  const [selectedOutletId, setSelectedOutletId] = useState<number | null>(null)

  if (selectedOutletId) {
    return (
      <div className="space-y-4">
        <OutletDetail
          outletId={selectedOutletId}
          onBack={() => setSelectedOutletId(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Outlets Analytics (Updated)</h1>
        <p className="text-muted-foreground mt-2">
          Outlet performance with new field names and date filtering
        </p>
      </div>
      <UpdatedOutletsList />
    </div>
  )
}
