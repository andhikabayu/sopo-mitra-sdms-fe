import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductKPIReportPage } from '@/features/reports/components/product-kpi-report-page'

function ProductKPIReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function ProductKPIReportRoute() {
  return (
    <Suspense fallback={<ProductKPIReportSkeleton />}>
      <ProductKPIReportPage />
    </Suspense>
  )
}
