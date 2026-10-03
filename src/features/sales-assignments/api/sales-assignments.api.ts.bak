import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import type { ApiEnvelope } from '@/types/api'

/**
 * Assignment
 */
export interface SalesAssignment {
  id?: number
  sales_id: number
  sales_area_id: number
  sales_name?: string
  sales_area_name?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Sales User
 */
export interface SalesUser {
  id: number
  name: string
  username: string
  email: string
  role: string
  address: string
  phone_number: string
  description: string
  status: boolean
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

/**
 * Sales Area
 */
export interface SalesArea {
  id: number
  name: string
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  total: number
  limit: number
  offset: number
  page: number
  total_pages: number
}

/**
 * Generic List Response
 */
export interface ListResponse<T> {
  code: number
  data: T[]
  metadata: PaginationMeta
  message: string
}

/**
 * Response when fetching assignments by sales
 */
export interface SalesAssignmentBySalesResponse {
  sales_id: number
  sales_areas: Array<{
    id: number
    sales_area_id: number
    sales_area_name: string
  }>
}

/**
 * Response when fetching assignments by area
 */
export interface SalesAssignmentByAreaResponse {
  sales_area_id: number
  sales: Array<{
    id: number
    sales_id: number
    sales_name: string
  }>
}

const realApi = {
  /**
   * Assign Sales -> Sales Area
   */
  async assign(
    body: {
      sales_id: number
      sales_area_ids: number[]
    }
  ): Promise<SalesAssignment[]> {
    const { data } =
      await apiClient.post<ApiEnvelope<SalesAssignment[]>>(
        API_ROUTES.salesAssignments.base,
        body
      )

    return data.data
  },

  /**
   * List Assignment
   */
  async list(
    params?: Record<string, unknown>
  ): Promise<SalesAssignment[]> {
    const { data } =
      await apiClient.get<ApiEnvelope<SalesAssignment[]>>(
        API_ROUTES.salesAssignments.base,
        {
          params,
        }
      )

    return data.data
  },

  /**
   * Assignment by Sales
   */
  async listBySales(
      salesId: number,
      params?: Record<string, unknown>
    ): Promise<{ sales_id: number; sales_areas: Array<{ id: number; sales_area_id: number; sales_area_name: string }> }> {
      const { data } =
        await apiClient.get<ApiEnvelope<{ sales_id: number; sales_areas: Array<{ id: number; sales_area_id: number; sales_area_name: string }> }>>(
          API_ROUTES.salesAssignments.bySales(salesId),
          {
            params,
          }
        )

      return data.data
  },

  /**
   * Assignment by Area
   */
  async listByArea(
    salesAreaId: number,
    params?: Record<string, unknown>
  ): Promise<{ sales_area_id: number; sales: Array<{ id: number; sales_id: number; sales_name: string }> }> {
    const { data } =
      await apiClient.get<ApiEnvelope<{ sales_area_id: number; sales: Array<{ id: number; sales_id: number; sales_name: string }> }>>(
        API_ROUTES.salesAssignments.byArea(salesAreaId),
        {
          params,
        }
      )

    return data.data
  },

  /**
   * Unassign
   */
  async unassign(
    salesId: number,
    salesAreaId: number
  ): Promise<{ success: boolean }> {
    const { data } =
      await apiClient.delete<
        ApiEnvelope<{ success: boolean }>
      >(
        API_ROUTES.salesAssignments.unassign(
          salesId,
          salesAreaId
        )
      )

    return data.data
  },

  /**
   * All Sales
   */
  async getSales(
    params?: {
      limit?: number
      offset?: number
    }
  ): Promise<SalesUser[]> {
    const { data } =
      await apiClient.get<ListResponse<SalesUser>>(
        API_ROUTES.users.allSales,
        {
          params: {
            limit: params?.limit ?? 50,
            offset: params?.offset ?? 0,
          },
        }
      )

    return data.data
  },

  /**
   * All Sales Area
   */
  async getSalesAreas(
    params?: {
      limit?: number
      offset?: number
    }
  ): Promise<SalesArea[]> {
    const { data } =
      await apiClient.get<ListResponse<SalesArea>>(
        API_ROUTES.locations.salesAreas,
        {
          params: {
            limit: params?.limit ?? 50,
            offset: params?.offset ?? 0,
          },
        }
      )

    return data.data
  },
}

export const salesAssignmentsApi = realApi
