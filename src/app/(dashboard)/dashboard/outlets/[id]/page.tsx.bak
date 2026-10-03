'use client'

import { OutletDetail } from '@/features/dashboard/components/outlet-detail'

interface OutletDetailPageProps {
  params: {
    id: string
  }
}

export default function OutletDetailPage({ params }: OutletDetailPageProps) {
  const outletId = parseInt(params.id, 10)

  if (isNaN(outletId)) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Invalid outlet ID</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <OutletDetail outletId={outletId} />
    </div>
  )
}
