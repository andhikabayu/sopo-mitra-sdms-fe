import { useQuery } from '@tanstack/react-query'
import { inventoryApi, InventoryTotals } from '@/features/inventory/api/inventory.api'

export function useInventoryTotals() {
  return useQuery<InventoryTotals>({
    queryKey: ['inventory', 'totals'],
    queryFn: () => inventoryApi.getTotals(),
  })
}

export default useInventoryTotals
