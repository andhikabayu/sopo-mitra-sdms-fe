import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { AreaKPIReportPage } from '@/features/reports/components/area-kpi-report-page'

function AreaKPIReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function AreaKPIReportRoute() {
  return (
    <Suspense fallback={<AreaKPIReportSkeleton />}>
      <AreaKPIReportPage />
    </Suspense>
  )
}
