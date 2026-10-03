"use client"

import React, { useState } from 'react'
import SalesTable from '@/features/sales-assignments/components/SalesTable'
import SalesAreaTable from '@/features/sales-assignments/components/SalesAreaTable'
import { FiPlus } from 'react-icons/fi'
import CreateSalesAssignmentModal from '@/features/sales-assignments/components/CreateSalesAssignmentModal'

export default function SalesAssignmentsPage() {
  const [tab, setTab] = useState<'sales' | 'areas'>('sales')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Assignments</h1>
        <p className="text-muted-foreground mt-2">Manage sales and sales area assignments</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('sales')}
          className={`rounded-md px-3 py-2 text-sm font-medium ${tab === 'sales' ? 'bg-primary text-primary-foreground' : 'border'}`}
        >
          All Sales
        </button>
        <button
          onClick={() => setTab('areas')}
          className={`rounded-md px-3 py-2 text-sm font-medium ${tab === 'areas' ? 'bg-primary text-primary-foreground' : 'border'}`}
        >
          Sales Areas
        </button>
        <div className="ml-auto">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            <FiPlus className="h-4 w-4" />
            Assign Sales
          </button>
        </div>
      </div>

      <div>
        {tab === 'sales' ? <SalesTable /> : <SalesAreaTable />}
        <CreateSalesAssignmentModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      </div>
    </div>
  )
}
