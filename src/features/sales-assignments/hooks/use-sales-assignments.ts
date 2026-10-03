'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { parseApiError } from '@/lib/api/error'
import {
  salesAssignmentsApi,
  type SalesAssignment,
  type SalesArea,
  type SalesUser,
  type SalesAssignmentBySalesResponse,
  type SalesAssignmentByAreaResponse,
} from '../api/sales-assignments.api'

/**
 * ============================================================================
 * Assignment List
 * ============================================================================
 */

export function useSalesAssignmentsList(
  params?: Record<string, unknown>,
  enabled = true
) {
  return useQuery<SalesAssignment[]>({
    queryKey: ['sales-assignments', 'list', params],
    queryFn: () => salesAssignmentsApi.list(params),
    enabled,
    meta: {
      parseError: parseApiError,
    },
  })
}

/**
 * ============================================================================
 * Assignment By Sales
 * ============================================================================
 */

export function useSalesAssignmentsBySales(
  salesId?: number,
  params?: Record<string, unknown>
) {
  return useQuery<SalesAssignmentBySalesResponse>({
    queryKey: [
      'sales-assignments',
      'sales',
      salesId,
      params,
    ],
    queryFn: () =>
      salesAssignmentsApi.listBySales(
        salesId!,
        params
      ),
    enabled: salesId !== undefined && salesId !== null,
    meta: {
      parseError: parseApiError,
    },
  })
}

/**
 * ============================================================================
 * Assignment By Sales Area
 * ============================================================================
 */

export function useSalesAssignmentsByArea(
  salesAreaId?: number,
  params?: Record<string, unknown>
) {
  return useQuery<SalesAssignmentByAreaResponse>({
    queryKey: [
      'sales-assignments',
      'area',
      salesAreaId,
      params,
    ],
    queryFn: () =>
      salesAssignmentsApi.listByArea(
        salesAreaId!,
        params
      ),
    enabled:
      salesAreaId !== undefined &&
      salesAreaId !== null,
    meta: {
      parseError: parseApiError,
    },
  })
}

/**
 * ============================================================================
 * Master Sales
 * ============================================================================
 */

export function useSalesList(
  limit = 50,
  offset = 0
) {
  return useQuery<SalesUser[]>({
    queryKey: [
      'sales-master',
      limit,
      offset,
    ],
    queryFn: () =>
      salesAssignmentsApi.getSales({
        limit,
        offset,
      }),
    // Always refetch when the component mounts or window regains focus
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    meta: {
      parseError: parseApiError,
    },
  })
}

/**
 * ============================================================================
 * Master Sales Area
 * ============================================================================
 */

export function useSalesAreasList(
  limit = 50,
  offset = 0
) {
  return useQuery<SalesArea[]>({
    queryKey: [
      'sales-area-master',
      limit,
      offset,
    ],
    queryFn: () =>
      salesAssignmentsApi.getSalesAreas({
        limit,
        offset,
      }),
    // Always refetch when the component mounts or window regains focus
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    meta: {
      parseError: parseApiError,
    },
  })
}

/**
 * ============================================================================
 * Assign
 * ============================================================================
 */

export function useSalesAssignmentAssign() {
  const queryClient = useQueryClient()

  return useMutation<
    SalesAssignment[],
    Error,
    {
      sales_id: number
      sales_area_ids: number[]
    }
  >({
    mutationFn: (body) =>
      salesAssignmentsApi.assign(body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sales-assignments'],
      })

      queryClient.invalidateQueries({
        queryKey: ['sales-master'],
      })

      queryClient.invalidateQueries({
        queryKey: ['sales-area-master'],
      })
    },

    meta: {
      parseError: parseApiError,
    },
  })
}

/**
 * ============================================================================
 * Unassign
 * ============================================================================
 */

export function useSalesAssignmentUnassign() {
  const queryClient = useQueryClient()

  return useMutation<
    { success: boolean },
    Error,
    {
      salesId: number
      areaId: number
    }
  >({
    mutationFn: ({
      salesId,
      areaId,
    }) =>
      salesAssignmentsApi.unassign(
        salesId,
        areaId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['sales-assignments'],
      })

      queryClient.invalidateQueries({
        queryKey: ['sales-master'],
      })

      queryClient.invalidateQueries({
        queryKey: ['sales-area-master'],
      })
    },

    meta: {
      parseError: parseApiError,
    },
  })
}
