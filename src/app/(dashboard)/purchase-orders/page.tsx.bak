'use client'

import { getModuleRegistry } from '@/config/module-registry'
import { ModulePage } from '@/features/modules/components/module-page'

export default function PurchaseOrdersPage() {
  const registry = getModuleRegistry('/purchase-orders')
  if (!registry) return <div>Purchase Orders module not available</div>
  return <ModulePage registry={registry} />
}
