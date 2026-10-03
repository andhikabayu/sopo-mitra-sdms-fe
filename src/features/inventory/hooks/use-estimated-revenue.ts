import { useQuery } from '@tanstack/react-query'
import { inventoryApi, EstimatedRevenueByOutlet } from '@/features/inventory/api/inventory.api'

export function useEstimatedByOutlet(outletId?: number) {
  return useQuery<EstimatedRevenueByOutlet>({
    queryKey: ['inventory', 'estimated', outletId],
    queryFn: () => inventoryApi.getEstimatedByOutlet(Number(outletId)),
    enabled: !!outletId,
  })
}

export function useEstimatedAll() {
  return useQuery<EstimatedRevenueByOutlet[]>({
    queryKey: ['inventory', 'estimated', 'all'],
    queryFn: () => inventoryApi.getEstimatedAll(),
  })
}
