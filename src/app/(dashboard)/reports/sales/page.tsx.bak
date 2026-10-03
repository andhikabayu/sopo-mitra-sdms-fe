import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { SalesKPIReportPage } from '@/features/reports/components/sales-kpi-report-page'

function SalesKPIReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function SalesKPIReportRoute() {
  return (
    <Suspense fallback={<SalesKPIReportSkeleton />}>
      <SalesKPIReportPage />
    </Suspense>
  )
}
