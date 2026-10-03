'use client'

import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  canPerformAction,
  canReadModule,
  canWriteModule,
} from '@/lib/auth/permissions'
import type { ModuleDefinition } from '@/config/modules'
import { useRoles } from './use-roles'

export function usePermissions() {
  const { user, isAuthenticated } = useAuth()
  const { data: masterRoles } = useRoles(isAuthenticated)
  const role = user?.role

  return {
    role,
    masterRoles,
    canPerform: (allowedRoles?: readonly string[]) =>
      canPerformAction(allowedRoles, role, masterRoles),
    canWriteModule: (module: ModuleDefinition) =>
      canWriteModule(module, role, masterRoles),
    canReadModule: (readRoles: ModuleDefinition['readRoles']) =>
      canReadModule(readRoles, role, masterRoles),
  }
}
