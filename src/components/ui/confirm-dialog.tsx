'use client'

import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  description = 'Are you sure you want to delete this record? This action cannot be undone.',
  confirmLabel = 'Delete',
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Please confirm that you want to proceed with this deletion.
      </p>
    </Modal>
  )
}
