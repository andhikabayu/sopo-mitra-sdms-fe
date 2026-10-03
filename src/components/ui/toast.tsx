"use client"

import React, { createContext, useContext, useState, type ReactNode } from 'react'

type Toast = { id: number; title: string; description?: string }

const ToastContext = createContext(null as unknown as { push: (t: Omit<Toast, 'id'>) => void })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function push(t: Omit<Toast, 'id'>) {
    const id = Date.now()
    setToasts((s) => [...s, { id, ...t }])
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4000)
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-md border bg-card p-3 shadow">
            <div className="font-semibold">{t.title}</div>
            {t.description && <div className="text-sm text-muted-foreground">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider
