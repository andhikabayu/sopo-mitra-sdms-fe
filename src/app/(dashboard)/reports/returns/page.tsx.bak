import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ReturnsReportPage } from '@/features/reports/components/returns-report-page'

function ReturnsReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function ReturnsReportRoute() {
  return (
    <Suspense fallback={<ReturnsReportSkeleton />}>
      <ReturnsReportPage />
    </Suspense>
  )
}
