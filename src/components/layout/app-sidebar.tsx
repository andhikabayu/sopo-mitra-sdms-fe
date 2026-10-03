'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiChevronDown, FiX } from 'react-icons/fi'
import { env } from '@/config/env'
import type { NavItem } from '@/config/nav'
import { cn } from '@/lib/utils/cn'

interface AppSidebarProps {
  items: readonly NavItem[]
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
}

function isActive(pathname: string, href?: string): boolean {
  if (!href) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

function hasActiveChild(pathname: string, item: NavItem): boolean {
  return Boolean(item.items?.some((child) => isActive(pathname, child.href) || hasActiveChild(pathname, child)))
}

function SidebarItem({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate: () => void }) {
  const pathname = usePathname()
  const Icon = item.icon
  const active = isActive(pathname, item.href)
  const childActive = hasActiveChild(pathname, item)

  if (item.items && item.items.length > 0) {
    return (
      <details open={!collapsed && childActive} className="group">
        <summary
          className={cn(
            'flex cursor-pointer list-none items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            childActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
            collapsed && 'justify-center px-2',
          )}
          title={collapsed ? item.title : undefined}
        >
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          {!collapsed && <span className="min-w-0 flex-1 truncate">{item.title}</span>}
          {!collapsed && <FiChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />}
        </summary>
        {!collapsed && (
          <div className="mt-1 space-y-1 pl-7">
            {item.items.map((child) => (
              <SidebarItem key={`${child.title}-${child.href ?? 'group'}`} item={child} collapsed={false} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </details>
    )
  }

  if (!item.href) return null

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.title : undefined}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        active && 'bg-sidebar-accent text-sidebar-accent-foreground',
        collapsed && 'justify-center px-2',
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {!collapsed && <span className="min-w-0 truncate">{item.title}</span>}
    </Link>
  )
}

function SidebarContent({ items, collapsed, onCloseMobile }: AppSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
          S
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{env.NEXT_PUBLIC_APP_NAME}</p>
            <p className="truncate text-xs text-sidebar-foreground/55">Yogurt Distribution</p>
          </div>
        )}
        <button
          type="button"
          className="ml-auto rounded p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.length > 0 ? (
          items.map((item) => (
            <SidebarItem key={`${item.title}-${item.href ?? 'group'}`} item={item} collapsed={collapsed} onNavigate={onCloseMobile} />
          ))
        ) : (
          <p className={cn('px-3 text-sm text-sidebar-foreground/60', collapsed && 'sr-only')}>
            No menu available for this role.
          </p>
        )}
      </nav>

      {!collapsed && (
        <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/55">
          Menus follow API_DOCS.md RBAC.
        </div>
      )}
    </div>
  )
}

export function AppSidebar(props: AppSidebarProps) {
  const { collapsed, mobileOpen, onCloseMobile } = props

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border transition-[width] duration-200 lg:block',
          collapsed ? 'w-20' : 'w-72',
        )}
      >
        <SidebarContent {...props} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            onClick={onCloseMobile}
            aria-label="Close sidebar overlay"
          />
          <aside className="relative h-full w-72 border-r border-sidebar-border shadow-xl">
            <SidebarContent {...props} collapsed={false} />
          </aside>
        </div>
      )}
    </>
  )
}
