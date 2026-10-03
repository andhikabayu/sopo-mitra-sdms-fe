'use client'

import { useMemo } from 'react'
import { filterNavByRole, navItems, type NavItem } from '@/config/nav'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useRoles } from './use-roles'

export function useNavItems(): NavItem[] {
  const { user, isAuthenticated } = useAuth()
  const { data: roles } = useRoles(isAuthenticated)

  return useMemo(
    () => filterNavByRole(navItems, user?.role, roles),
    [user?.role, roles],
  )
}
