'use client'

import { UpdatedDashboardSummary } from '@/features/dashboard/components/updated-dashboard-summary'

export default function DashboardSummaryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard Summary (Updated)</h1>
      <p className="text-muted-foreground">
        New field names and metrics with date range filtering support
      </p>
      <UpdatedDashboardSummary />
    </div>
  )
}
