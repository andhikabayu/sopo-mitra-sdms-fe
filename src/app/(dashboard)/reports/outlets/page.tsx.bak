import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { OutletKPIReportPage } from '@/features/reports/components/outlet-kpi-report-page'

function OutletKPIReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function OutletKPIReportRoute() {
  return (
    <Suspense fallback={<OutletKPIReportSkeleton />}>
      <OutletKPIReportPage />
    </Suspense>
  )
}
