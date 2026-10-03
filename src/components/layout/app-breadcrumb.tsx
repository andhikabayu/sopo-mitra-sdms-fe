'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiChevronRight } from 'react-icons/fi'
import { findNavTitleByPath } from '@/config/nav'
import { cn } from '@/lib/utils/cn'

function humanize(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function AppBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    return {
      href,
      label: findNavTitleByPath(href) ?? humanize(segment),
      active: index === segments.length - 1,
    }
  })

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
        Home
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="inline-flex items-center gap-1">
          <FiChevronRight className="h-4 w-4 text-muted-foreground/60" aria-hidden />
          {crumb.active ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-muted-foreground transition-colors hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
