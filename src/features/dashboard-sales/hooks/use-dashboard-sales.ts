'use client'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import { dashboardSalesApi } from '../api/dashboard-sales.api'
import { format } from 'date-fns'

export function useDashboardSales(period: 'monthly' | 'weekly' = 'monthly') {
  const { user, isAuthenticated } = useAuth()
  const salesId = user?.id

  return useQuery({
    queryKey: ['dashboard-sales', salesId, period],
    queryFn: async () => {
      if (!salesId) throw new Error('Missing sales id')
      const params = { period }
      const data = await dashboardSalesApi.getMyPayout(salesId, params)
      return data
    },
    enabled: isAuthenticated && !!salesId,
    staleTime: 1000 * 60 * 5,
  })
}
