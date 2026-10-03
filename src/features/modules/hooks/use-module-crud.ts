'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RBAC } from '@/config/rbac'
import { parseApiError } from '@/lib/api/error'
import type { ModuleRegistryEntry } from '@/config/module-registry'
import { rolesApi } from '@/features/roles/api/roles.api'
import { resolveRoleName } from '@/features/roles/hooks/use-roles'
import { modulesApi } from '../api/modules.api'

export function moduleQueryKey(pathname: string) {
  return ['module', pathname] as const
}

export function useModuleList(registry: ModuleRegistryEntry, params?: Record<string, unknown>) {
  return useQuery<unknown>({
    queryKey: params ? [...moduleQueryKey(registry.module.path), params] : moduleQueryKey(registry.module.path),
    queryFn: async () => {
      if (params) {
        return modulesApi.listWithMeta(registry.api.list, params)
      }
      return modulesApi.list(registry.api.list)
    },
    meta: { parseError: parseApiError },
  })
}

export function useModuleCreate(registry: ModuleRegistryEntry) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => {
      if (!registry.api.create) throw new Error('Create not supported')
      return modulesApi.create(registry.api.create, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKey(registry.module.path) })
    },
    meta: { parseError: parseApiError },
  })
}

export function useModuleUpdate(registry: ModuleRegistryEntry) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Record<string, unknown> }) => {
      if (!registry.api.update) throw new Error('Update not supported')
      return modulesApi.update(registry.api.update(id), body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKey(registry.module.path) })
    },
    meta: { parseError: parseApiError },
  })
}

export function useModuleDelete(registry: ModuleRegistryEntry) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => {
      if (!registry.api.delete) throw new Error('Delete not supported')
      return modulesApi.remove(registry.api.delete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleQueryKey(registry.module.path) })
    },
    meta: { parseError: parseApiError },
  })
}

export function useRelationOptions() {
  return useQuery({
    queryKey: ['relation-options'],
    queryFn: async () => {
      const [users, products, outletsResp, locationData, masterRoles] = await Promise.all([
        modulesApi.list('/users'),
        modulesApi.list('/products'),
        modulesApi.listWithMeta('/outlets', { approval: 'approve' }),
        modulesApi.getLocationData(),
        rolesApi.list(),
      ])

      const salesRoleName = resolveRoleName(masterRoles, RBAC.SALES) ?? RBAC.SALES
      const storeInspectorRoleName =
        resolveRoleName(masterRoles, RBAC.STORE_INSPECTOR) ?? RBAC.STORE_INSPECTOR

      return {
        users: users.map((u) => ({
          value: Number(u.id),
          label: `${u.name}${u.role ? ` (${u.role})` : ''}`,
          role: u.role,
        })),
        sales: users
          .filter((u) => u.role === salesRoleName)
          .map((u) => ({ value: Number(u.id), label: String(u.name) })),
        store_inspectors: users
          .filter((u) => u.role === storeInspectorRoleName)
          .map((u) => ({ value: Number(u.id), label: String(u.name) })),
        products: products.map((p) => ({
          value: Number(p.id),
          label: `${p.sku} — ${p.name}`,
        })),
        outlets: (outletsResp.items ?? []).map((outlet) => ({
          value: Number((outlet as { id: number }).id),
          label: String((outlet as { outlet_name?: string; outletName?: string; name?: string }).outlet_name ?? (outlet as { outlet_name?: string; outletName?: string; name?: string }).outletName ?? (outlet as { outlet_name?: string; outletName?: string; name?: string }).name ?? ''),
        })),
        cities: locationData.cities.map((c) => ({
          value: Number(c.id),
          label: String(c.name),
        })),
        districts: locationData.districts.map((d) => ({
          value: Number(d.id),
          label: String(d.name),
          city_id: Number(d.city_id),
        })),
        sub_districts: locationData.sub_districts.map((s) => ({
          value: Number(s.id),
          label: String(s.name),
          district_id: Number(s.district_id),
        })),
        sales_areas: locationData.sales_areas.map((a) => ({
          value: Number(a.id),
          label: String(a.name),
        })),
      }
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    meta: { parseError: parseApiError },
  })
}

export function useLocationData() {
  return useQuery({
    queryKey: ['location-data'],
    queryFn: () => modulesApi.getLocationData(),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    meta: { parseError: parseApiError },
  })
}

export function useLocationCities(enabled = true) {
  return useQuery({
    queryKey: ['location-cities'],
    queryFn: () => modulesApi.getLocationCities(),
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    meta: { parseError: parseApiError },
  })
}

export function useLocationDistricts(cityId?: number, enabled = true) {
  return useQuery({
    queryKey: ['location-districts', cityId],
    queryFn: () => modulesApi.getLocationDistricts(cityId!),
    enabled: enabled && Boolean(cityId),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    meta: { parseError: parseApiError },
  })
}

export function useLocationSubDistricts(districtId?: number, enabled = true) {
  return useQuery({
    queryKey: ['location-sub-districts', districtId],
    queryFn: () => modulesApi.getLocationSubDistricts(districtId!),
    enabled: enabled && Boolean(districtId),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    meta: { parseError: parseApiError },
  })
}

export function useLocationSalesAreas(enabled = true) {
  return useQuery({
    queryKey: ['location-sales-areas'],
    queryFn: () => modulesApi.getLocationSalesAreas(),
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    meta: { parseError: parseApiError },
  })
}

export function useLocationList(endpoint: string, enabled = true) {
  return useQuery({
    queryKey: ['location-list', endpoint],
    queryFn: () => modulesApi.list(endpoint),
    enabled,
    meta: { parseError: parseApiError },
  })
}

export function useLocationCreate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ endpoint, body }: { endpoint: string; body: Record<string, unknown> }) =>
      modulesApi.create(endpoint, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-data'] })
      queryClient.invalidateQueries({ queryKey: ['location-list'] })
    },
    meta: { parseError: parseApiError },
  })
}

export function useCoverageAreaList(salesAreaId?: number) {
  return useQuery({
    queryKey: ['coverage-area', salesAreaId],
    queryFn: () => modulesApi.getCoverageAreaSubDistricts(salesAreaId!),
    enabled: Boolean(salesAreaId),
    meta: { parseError: parseApiError },
  })
}

export function useCoverageAreaAssign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      salesAreaId,
      subDistrictIds,
    }: {
      salesAreaId: number
      subDistrictIds: number[]
    }) => modulesApi.assignCoverageAreaSubDistricts(salesAreaId, subDistrictIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coverage-area', variables.salesAreaId] })
    },
    meta: { parseError: parseApiError },
  })
}

export function useCoverageAreaRemove() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      salesAreaId,
      subDistrictId,
    }: {
      salesAreaId: number
      subDistrictId: number
    }) => modulesApi.removeCoverageAreaSubDistrict(salesAreaId, subDistrictId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coverage-area', variables.salesAreaId] })
    },
    meta: { parseError: parseApiError },
  })
}

export function useSalesAssignmentsBySales(salesId?: number) {
  return useQuery({
    queryKey: ['sales-assignments', 'sales', salesId],
    queryFn: () => modulesApi.getSalesAssignmentsBySales(salesId!),
    enabled: Boolean(salesId),
    meta: { parseError: parseApiError },
  })
}

export function useSalesAssignmentsByArea(salesAreaId?: number) {
  return useQuery({
    queryKey: ['sales-assignments', 'area', salesAreaId],
    queryFn: () => modulesApi.getSalesAssignmentsByArea(salesAreaId!),
    enabled: Boolean(salesAreaId),
    meta: { parseError: parseApiError },
  })
}

export function useSalesAssignmentCreate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ salesId, salesAreaIds }: { salesId: number; salesAreaIds: number[] }) =>
      modulesApi.assignSalesAreas(salesId, salesAreaIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-assignments'] })
    },
    meta: { parseError: parseApiError },
  })
}

export function useSalesAssignmentRemove() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ salesId, salesAreaId }: { salesId: number; salesAreaId: number }) =>
      modulesApi.unassignSalesArea(salesId, salesAreaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-assignments'] })
    },
    meta: { parseError: parseApiError },
  })
}
