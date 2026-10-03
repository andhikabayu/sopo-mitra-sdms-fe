import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionReportPage } from '@/features/reports/components/transaction-report-page'

function TransactionReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function TransactionReportRoute() {
  return (
    <Suspense fallback={<TransactionReportSkeleton />}>
      <TransactionReportPage />
    </Suspense>
  )
}
