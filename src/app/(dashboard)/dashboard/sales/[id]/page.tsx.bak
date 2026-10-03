'use client'

import { SalesDetail } from '@/features/dashboard/components/sales-detail'

interface SalesDetailPageProps {
  params: {
    id: string
  }
}

export default function SalesDetailPage({ params }: SalesDetailPageProps) {
  const salesId = parseInt(params.id, 10)

  if (isNaN(salesId)) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Invalid sales ID</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SalesDetail salesId={salesId} />
    </div>
  )
}
