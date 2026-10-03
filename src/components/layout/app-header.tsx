'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiLogOut, FiMenu, FiUser } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useAuth, useLogout } from '@/features/auth'
import { AppBreadcrumb } from './app-breadcrumb'

interface AppHeaderProps {
  onOpenSidebar: () => void
  onToggleCollapse: () => void
}

export function AppHeader({ onOpenSidebar, onToggleCollapse }: AppHeaderProps) {
  const { user } = useAuth()
  const logout = useLogout()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<{ top: number; right: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setMenuStyle({ top: rect.bottom + 8, right: Math.max(16, window.innerWidth - rect.right) })
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    updatePosition()
    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('resize', updatePosition)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('resize', updatePosition)
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <AppBreadcrumb className="hidden sm:flex" />
        </div>

        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiUser className="h-4 w-4" />
            </span>
            <span className="hidden min-w-0 md:block">
              <span className="block truncate text-sm font-medium">{user?.name ?? 'User'}</span>
              <span className="block truncate text-xs text-muted-foreground">{user?.role ?? 'Authenticated'}</span>
            </span>
          </button>

          {menuOpen && menuStyle && typeof document !== 'undefined'
            ? createPortal(
                <div
                    ref={menuRef}
                  role="menu"
                  className="fixed z-40 w-56 rounded-md border bg-background p-1 text-popover-foreground shadow-lg"
                  style={{ top: menuStyle.top, right: menuStyle.right }}
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium">{user?.name ?? 'User'}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email ?? user?.username ?? user?.role}</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => logout.mutate()}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>,
                document.body,
              )
            : null}
        </div>
      </div>
    </header>
  )
}
