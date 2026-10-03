'use client'

import { ReportsPage } from '@/features/dashboard/components/reports-page'

export default function DashboardReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive reporting with pagination, filtering, and Excel export
        </p>
      </div>
      <ReportsPage />
    </div>
  )
}
