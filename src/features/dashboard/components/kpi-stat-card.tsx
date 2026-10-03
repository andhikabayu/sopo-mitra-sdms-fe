import type { IconType } from 'react-icons'
import { cn } from '@/lib/utils/cn'

interface KpiStatCardProps {
  label: string
  value: string
  hint?: string
  icon: IconType
  accent?: 'primary' | 'success' | 'warning' | 'destructive' | 'muted'
}

const accentStyles = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-600',
  warning: 'bg-amber-500/10 text-amber-600',
  destructive: 'bg-destructive/10 text-destructive',
  muted: 'bg-muted text-muted-foreground',
}

export function KpiStatCard({ label, value, hint, icon: Icon, accent = 'primary' }: KpiStatCardProps) {
  return (
    <article className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-md', accentStyles[accent])}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </article>
  )
}
