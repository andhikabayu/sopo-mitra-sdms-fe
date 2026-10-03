import { Suspense } from 'react'
import Link from 'next/link'
import { FiBarChart3, FiMapPin, FiTrendingUp } from 'react-icons/fi'
import { Skeleton } from '@/components/ui/skeleton'

function ReportsHubSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-96" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  )
}

const reportTypes = [
  {
    id: 'outlets',
    title: 'Outlet KPI',
    description: 'Outlet performance and sales metrics across all locations.',
    icon: FiMapPin,
    href: '/reports/outlets',
  },
  {
    id: 'sales',
    title: 'Sales KPI',
    description: 'Sales performance and metrics by sales person.',
    icon: FiTrendingUp,
    href: '/reports/sales',
  },
  {
    id: 'areas',
    title: 'Area KPI',
    description: 'Area performance and sales metrics by sales area.',
    icon: FiBarChart3,
    href: '/reports/areas',
  },
]

function ReportsHub() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          KPI reports for outlets, sales, and areas with data-driven insights.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <Link
              key={report.id}
              href={report.href}
              className="group rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  <h2 className="font-semibold group-hover:text-primary transition-colors">{report.title}</h2>
                </div>
                <p className="text-xs text-muted-foreground">{report.description}</p>
                <div className="pt-2 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View Report →
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="rounded-lg border bg-muted/30 p-6">
        <h3 className="font-semibold mb-2">About Reports</h3>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
          <li>All reports support date range filtering (default: last 90 days)</li>
          <li>Data can be exported to Excel for further analysis</li>
          <li>Reports automatically refresh every 3 minutes</li>
          <li>Performance metrics include efficiency and return rate analysis</li>
        </ul>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsHubSkeleton />}>
      <ReportsHub />
    </Suspense>
  )
}
