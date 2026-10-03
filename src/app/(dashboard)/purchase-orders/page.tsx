'use client'

import { Suspense } from 'react'
import { getModuleRegistry } from '@/config/module-registry'
import { ModulePage } from '@/features/modules/components/module-page'

export default function PurchaseOrdersPage() {
  const registry = getModuleRegistry('/purchase-orders')
  if (!registry) return <div>Purchase Orders module not available</div>
  return (
    <Suspense fallback={<div>Loading purchase orders...</div>}>
      <ModulePage registry={registry} />
    </Suspense>
  )
}
