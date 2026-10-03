import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import type { ApiEnvelope } from '@/types/api'

export interface CoverageSubDistrict {
  id: number
  sub_district_id: number
  sub_district_name: string
  district_id: number
}

export interface CoverageAreaResponse {
  sales_area_id: number
  sub_districts: CoverageSubDistrict[]
  meta?: {
    total: number
    page: number
    per_page: number
  }
  message?: string
}

const realApi = {
  async assign(body: { sales_area_id: number; sub_district_ids: number[] }): Promise<CoverageAreaResponse[]> {
    const { data } = await apiClient.post<ApiEnvelope<CoverageAreaResponse[]>>(
      API_ROUTES.locations.coverageSubDistricts(body.sales_area_id),
      { sub_district_ids: body.sub_district_ids }
    )
    return data.data
  },

  async list(
    salesAreaId: number,
    params?: Record<string, unknown>
  ): Promise<CoverageAreaResponse> {
    const { data } = await apiClient.get<ApiEnvelope<CoverageAreaResponse>>(
      API_ROUTES.locations.coverageSubDistricts(salesAreaId),
      { params }
    )

    return data.data
  },

  async unassign(salesAreaId: number, subDistrictId: number): Promise<{ success: boolean }> {
    const { data } = await apiClient.delete<ApiEnvelope<{ success: boolean }>>(
      API_ROUTES.locations.coverageSubDistrict(salesAreaId, subDistrictId)
    )
    return data.data
  },
}

export const coverageAreasApi = realApi
