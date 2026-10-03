"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/form/form-input'
import { Select } from '@/components/ui/select'
import { useSalesList } from '@/features/sales-assignments/hooks/use-sales-assignments'
import { useCommissionInvoiceGenerate } from '@/features/commission-invoices'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/toast'

const Schema = z.object({
  sales_id: z.number().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
})

type FormValues = z.infer<typeof Schema>

export function GenerateInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth()

  const gen = useCommissionInvoiceGenerate()
  const qc = useQueryClient()
  const { push } = useToast()

  const { data: sales = [] } = useSalesList(100, 0)

  const { register, handleSubmit, formState, setValue } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { sales_id: user?.id ?? 0, start_date: '', end_date: '' },
  })

  // ensure form has sales_id prefilled when user is present
  useEffect(() => {
    if (user?.id) setValue('sales_id', user.id)
  }, [user?.id, setValue])

  async function onSubmit(values: FormValues) {
    try {
      await gen.mutateAsync(values)
      // invalidate list and summary
      qc.invalidateQueries({ queryKey: ['commission-invoices'] })
      qc.invalidateQueries({ queryKey: ['commission-invoices', 'summary'] })
      push({ title: 'Invoice generated', description: 'Commission invoice was generated successfully.' })
      onClose()
    } catch (e) {
      push({ title: 'Generate failed', description: 'Unable to generate invoice.' })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Generate Commission Invoice" description="Create invoice for a sales period">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Sales ID dropdown */}
        <div>
          <label className="mb-1 block text-sm font-medium">Sales</label>
          <Select
            {...register('sales_id', { valueAsNumber: true })}
            options={(sales || []).map((s: any) => ({ value: s.id, label: s.name }))}
            placeholder="Select sales"
          />
        </div>

        <FormInput label="Start Date" type="date" {...register('start_date')} />
        <FormInput label="End Date" type="date" {...register('end_date')} />

        <div className="flex justify-end">
          <Button type="button" variant="ghost" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="submit" disabled={gen.isLoading}>
            {gen.isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GenerateInvoiceModal
