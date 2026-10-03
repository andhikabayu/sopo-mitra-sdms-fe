'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { FiX } from 'react-icons/fi'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: ReactNode
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ open, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        className={cn(
          'relative z-10 flex max-h-[90vh] w-full flex-col rounded-lg border bg-background shadow-lg',
          sizeClasses[size],
        )}
      >
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <FiX className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
