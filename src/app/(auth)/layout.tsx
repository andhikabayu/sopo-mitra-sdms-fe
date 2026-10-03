import type { ReactNode } from 'react'
import { env } from '@/config/env'

/**
 * Centered, branded shell for public auth pages (login, forgot-password…).
 * Mirrors the CoreUI auth layout UX, rebuilt in Tailwind.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / marketing panel */}
      <div className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="text-xl font-semibold tracking-tight">{env.NEXT_PUBLIC_APP_NAME}</div>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold leading-tight">
            SoPo Mitra Data Management System
          </h2>
          <p className="max-w-sm text-sidebar-foreground/70">
            Secure, role-based platform to manage partners, users, and operational data.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
