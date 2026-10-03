'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { parseApiError } from '@/lib/api/error'
import {
  coverageAreasApi,
  type CoverageAreaResponse,
} from '../api/coverage-areas.api'

export function useCoverageAreasList(
  salesAreaId?: number,
  params?: Record<string, unknown>
) {
  return useQuery<CoverageAreaResponse>({
    queryKey: ['coverage-areas', salesAreaId, params],
    queryFn: () => coverageAreasApi.list(salesAreaId!, params),
    enabled: salesAreaId !== undefined && salesAreaId !== null,
    meta: {
      parseError: parseApiError,
    },
  })
}

export function useCoverageAreaAssign() {
  const queryClient = useQueryClient()

  return useMutation<
    CoverageAreaResponse[],
    Error,
    {
      sales_area_id: number
      sub_district_ids: number[]
    }
  >({
    mutationFn: (body) => coverageAreasApi.assign(body),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['coverage-areas', variables.sales_area_id],
      })
    },

    meta: {
      parseError: parseApiError,
    },
  })
}

export function useCoverageAreaUnassign() {
  const queryClient = useQueryClient()

  return useMutation<
    { success: boolean },
    Error,
    {
      salesAreaId: number
      subDistrictId: number
    }
  >({
    mutationFn: ({ salesAreaId, subDistrictId }) =>
      coverageAreasApi.unassign(salesAreaId, subDistrictId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['coverage-areas', variables.salesAreaId],
      })
    },

    meta: {
      parseError: parseApiError,
    },
  })
}
