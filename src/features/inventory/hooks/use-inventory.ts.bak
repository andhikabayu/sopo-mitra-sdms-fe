import { useQuery } from '@tanstack/react-query'
import { inventoryApi, InventoryItem, SalesInventoryAggregationItem, SalesInventoryItem, InventoryAuditItem, SalesTotalOutletResponse } from '@/features/inventory/api/inventory.api'

export function useAllInventory(params?: { limit?: number; offset?: number; name?: string }) {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory', 'list', params],
    queryFn: () => inventoryApi.getAllInventory(params),
  })
}

export function useInventoryByOutlet(outletId?: number) {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory', 'byOutlet', outletId],
    queryFn: () => inventoryApi.getInventoryByOutlet(Number(outletId)),
    enabled: !!outletId,
  })
}

export function useSalesAggregated(params?: { sales_id?: number; product_id?: number; min_held?: number; limit?: number; offset?: number }) {
  return useQuery<SalesInventoryAggregationItem[]>({
    queryKey: ['inventory', 'sales', params],
    queryFn: () => inventoryApi.getSalesAggregated(params),
  })
}

export function useSalesById(salesId?: number) {
  return useQuery<SalesInventoryItem[]>({
    queryKey: ['inventory', 'sales', salesId],
    queryFn: () => inventoryApi.getSalesById(Number(salesId)),
    enabled: !!salesId,
  })
}

export function useInventoryAudit(params?: { sales_id?: number; product_id?: number; source_type?: string; limit?: number; offset?: number }) {
  return useQuery<InventoryAuditItem[]>({
    queryKey: ['inventory', 'audit', params],
    queryFn: () => inventoryApi.getAudit(params),
  })
}

export function useSummaryByProduct(productId?: number) {
  return useQuery({
    queryKey: ['inventory', 'summary', productId],
    queryFn: () => inventoryApi.getSummaryByProduct(Number(productId)),
    enabled: !!productId,
  })
}

export function useSalesTotalOutlets(enabled = true) {
  return useQuery<SalesTotalOutletResponse>({
    queryKey: ['inventory', 'sales-total-outlets'],
    queryFn: () => inventoryApi.getSalesTotalOutlets(),
    enabled,
  })
}

export default useAllInventory
