'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { parseApiError } from '@/lib/api/error'
import type { MasterRole } from '@/types/role'
import type { SelectOption } from '@/components/ui/select'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { rolesApi } from '../api/roles.api'

export const ROLES_QUERY_KEY = ['master-roles'] as const

export function useRoles(enabled?: boolean) {
  const { isAuthenticated } = useAuth()
  const shouldFetch = enabled ?? isAuthenticated

  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: () => rolesApi.list(),
    enabled: shouldFetch,
    staleTime: 30 * 60 * 1000,
    meta: { parseError: parseApiError },
  })
}

export function useRoleOptions(): SelectOption[] {
  const { data: roles = [] } = useRoles()
  return useMemo(
    () => roles.map((role) => ({ value: role.name, label: role.name })),
    [roles],
  )
}

export function useRoleNameByKeyword(keyword: string): string | undefined {
  const { data: roles = [] } = useRoles()
  return useMemo(() => {
    const lower = keyword.toLowerCase()
    return roles.find((role) => role.name.toLowerCase() === lower)?.name
  }, [roles, keyword])
}

export function resolveRoleName(
  roles: readonly MasterRole[] | undefined,
  keyword: string,
): string | undefined {
  if (!roles?.length) return undefined
  const lower = keyword.toLowerCase()
  return roles.find((role) => role.name.toLowerCase() === lower)?.name
}
