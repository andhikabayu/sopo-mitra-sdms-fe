'use client'

import { useState, type ReactNode } from 'react'
import { useNavItems } from '@/features/roles'
import { cn } from '@/lib/utils/cn'
import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const menuItems = useNavItems()

  return (
    <div className="min-h-screen bg-muted/30">
      <AppSidebar
        items={menuItems}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className={cn('min-h-screen transition-[padding] duration-200 lg:pl-72', sidebarCollapsed && 'lg:pl-20')}>
        <AppHeader
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
        <main className="min-h-[calc(100vh-8.5rem)] p-4 lg:p-6">{children}</main>
        <AppFooter />
      </div>
    </div>
  )
}
