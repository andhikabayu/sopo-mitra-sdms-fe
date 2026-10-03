import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { SuppliesReportPage } from '@/features/reports/components/supplies-report-page'

function SuppliesReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function SuppliesReportRoute() {
  return (
    <Suspense fallback={<SuppliesReportSkeleton />}>
      <SuppliesReportPage />
    </Suspense>
  )
}
