import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import type { ApiEnvelope } from '@/types/api'

export type ModuleRecord = Record<string, unknown>

export interface LocationCity {
  id: number
  name: string
}

export interface LocationDistrict {
  id: number
  name: string
  city_id: number
}

export interface LocationSubDistrict {
  id: number
  name: string
  district_id: number
}

export interface LocationSalesArea {
  id: number
  name: string
}

export interface CoverageAreaListResponse {
  sales_area_id: number
  sub_districts: Array<{
    id: number
    sub_district_id: number
    sub_district_name: string
    district_id: number
  }>
}

export interface SalesAssignmentBySalesResponse {
  sales_id: number
  sales_areas: Array<{
    id: number
    sales_area_id: number
    sales_area_name: string
  }>
}

export interface SalesAssignmentByAreaResponse {
  sales_area_id: number
  sales: Array<{
    id: number
    sales_id: number
    sales_name: string
  }>
}

export const modulesApi = {
  async list<T = ModuleRecord>(endpoint: string): Promise<T[]> {
    const { data } = await apiClient.get<ApiEnvelope<T[] | { products: T[] }>>(endpoint)
    const payload = data.data
    if (Array.isArray(payload)) return payload
    if (payload && typeof payload === 'object' && 'products' in payload) {
      return (payload as { products: T[] }).products
    }
    return []
  },

  /**
   * List with pagination metadata. Many endpoints return a `{ data: T[], metadata: {...} }`
   * shape. This helper returns both items and metadata when present.
   */
  async listWithMeta<T = ModuleRecord>(endpoint: string, params?: Record<string, unknown>): Promise<{
    items: T[]
    metadata?: { total: number; limit: number; offset: number; page?: number; total_pages?: number }
  }> {
    const { data } = await apiClient.get<any>(endpoint, { params })
    const payload = data.data
    const items: T[] = Array.isArray(payload)
      ? payload
      : payload?.items ?? payload?.data ?? payload ?? []
    const metadata = data.metadata ?? data.data?.metadata ?? undefined
    return { items, metadata }
  },
  async approveOutlet(outletId: number, approval: 'approve' | 'reject') {
    const { data } = await apiClient.get<ApiEnvelope<any>>(API_ROUTES.outlets.approval, {
      params: { outlet_id: outletId, approval },
    })
    return data.data
  },
  async updateStatus(outletId: number, dataStatus: boolean) {
    const url = `${API_ROUTES.outlets.base}/${outletId}/update-status`
    const { data } = await apiClient.post<ApiEnvelope<any>>(url, null, { params: { data_status: dataStatus } })
    return data.data
  },

  async create<T = ModuleRecord>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const { data } = await apiClient.post<ApiEnvelope<T>>(endpoint, body)
    return data.data
  },

  async update<T = ModuleRecord>(
    endpoint: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    const { data } = await apiClient.put<ApiEnvelope<T>>(endpoint, body)
    return data.data
  },

  async remove(endpoint: string): Promise<void> {
    await apiClient.delete(endpoint)
  },

  async getLocationData(): Promise<{
    cities: ModuleRecord[]
    districts: ModuleRecord[]
    sub_districts: ModuleRecord[]
    sales_areas: ModuleRecord[]
  }> {
    const { data } = await apiClient.get<
      ApiEnvelope<{
        cities: ModuleRecord[]
        districts: ModuleRecord[]
        sub_districts: ModuleRecord[]
        sales_areas: ModuleRecord[]
      }>
    >(API_ROUTES.locations.data)
    return data.data
  },

  async getLocationCities(): Promise<LocationCity[]> {
    return modulesApi.list<LocationCity>(API_ROUTES.locations.cities)
  },

  async getLocationDistricts(cityId: number): Promise<LocationDistrict[]> {
    return modulesApi.list<LocationDistrict>(API_ROUTES.locations.districts(cityId))
  },

  async getLocationSubDistricts(districtId: number): Promise<LocationSubDistrict[]> {
    return modulesApi.list<LocationSubDistrict>(API_ROUTES.locations.subDistricts(districtId))
  },

  async getLocationSalesAreas(): Promise<LocationSalesArea[]> {
    return modulesApi.list<LocationSalesArea>(API_ROUTES.locations.salesAreas)
  },

  async getById<T = ModuleRecord>(endpoint: string): Promise<T | null> {
    const { data } = await apiClient.get<ApiEnvelope<T>>(endpoint)
    return data.data ?? null
  },

  async getCoverageAreaSubDistricts(salesAreaId: number): Promise<CoverageAreaListResponse> {
    const { data } = await apiClient.get<ApiEnvelope<CoverageAreaListResponse>>(
      API_ROUTES.locations.coverageSubDistricts(salesAreaId),
    )
    return data.data
  },

  async assignCoverageAreaSubDistricts(
    salesAreaId: number,
    subDistrictIds: number[],
  ): Promise<{ sales_area_id: number; assigned: number[]; skipped_already_assigned: number[] }> {
    const { data } = await apiClient.post<
      ApiEnvelope<{ sales_area_id: number; assigned: number[]; skipped_already_assigned: number[] }>
    >(API_ROUTES.locations.coverageSubDistricts(salesAreaId), {
      sub_district_ids: subDistrictIds,
    })
    return data.data
  },

  async removeCoverageAreaSubDistrict(
    salesAreaId: number,
    subDistrictId: number,
  ): Promise<{ sales_area_id: number; sub_district_id: number }> {
    const { data } = await apiClient.delete<
      ApiEnvelope<{ sales_area_id: number; sub_district_id: number }>
    >(API_ROUTES.locations.coverageSubDistrict(salesAreaId, subDistrictId))
    return data.data
  },

  async getSalesAssignmentsBySales(salesId: number): Promise<SalesAssignmentBySalesResponse> {
    const { data } = await apiClient.get<ApiEnvelope<SalesAssignmentBySalesResponse>>(
      API_ROUTES.salesAssignments.bySales(salesId),
    )
    return data.data
  },

  async getSalesAssignmentsByArea(salesAreaId: number): Promise<SalesAssignmentByAreaResponse> {
    const { data } = await apiClient.get<ApiEnvelope<SalesAssignmentByAreaResponse>>(
      API_ROUTES.salesAssignments.byArea(salesAreaId),
    )
    return data.data
  },

  async assignSalesAreas(
    salesId: number,
    salesAreaIds: number[],
  ): Promise<{ sales_id: number; assigned: number[]; skipped_already_assigned: number[] }> {
    const { data } = await apiClient.post<
      ApiEnvelope<{ sales_id: number; assigned: number[]; skipped_already_assigned: number[] }>
    >(API_ROUTES.salesAssignments.base, {
      sales_id: salesId,
      sales_area_ids: salesAreaIds,
    })
    return data.data
  },

  async unassignSalesArea(
    salesId: number,
    salesAreaId: number,
  ): Promise<{ sales_id: number; sales_area_id: number }> {
    const { data } = await apiClient.delete<
      ApiEnvelope<{ sales_id: number; sales_area_id: number }>
    >(API_ROUTES.salesAssignments.unassign(salesId, salesAreaId))
    return data.data
  },
}
