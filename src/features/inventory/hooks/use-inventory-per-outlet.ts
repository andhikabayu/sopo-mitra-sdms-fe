import { useQuery } from '@tanstack/react-query'
import { inventoryPerOutletApi, PerOutletResponse } from '@/features/inventory/api/inventory-per-outlet.api'

export function useInventoryPerOutlet(outletId: number) {
  return useQuery<PerOutletResponse>({
    queryKey: ['inventory', 'perOutlet', outletId],
    queryFn: () => inventoryPerOutletApi.getPerOutletData(outletId),
    enabled: !!outletId,
  })
}