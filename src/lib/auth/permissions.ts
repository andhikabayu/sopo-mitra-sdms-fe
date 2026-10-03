import type { MasterRole } from '@/types/role'
import type { ModuleDefinition } from '@/config/modules'
import { hasNavRole, isSuperAdminRole } from '@/lib/auth/roles'

export { isSuperAdminRole, isSuperAdmin } from '@/lib/auth/roles'

export function canWriteModule(
  module: ModuleDefinition,
  role?: string,
  masterRoles?: readonly MasterRole[],
): boolean {
  if (isSuperAdminRole(role, masterRoles)) return Boolean(module.writeRoles?.length)
  if (!module.writeRoles || !role) return false
  return hasNavRole(module.writeRoles, role, masterRoles)
}

export function canPerformAction(
  allowedRoles: readonly string[] | undefined,
  role?: string,
  masterRoles?: readonly MasterRole[],
): boolean {
  if (isSuperAdminRole(role, masterRoles)) return Boolean(allowedRoles?.length)
  return hasNavRole(allowedRoles, role, masterRoles)
}

export function canReadModule(
  readRoles: ModuleDefinition['readRoles'],
  role?: string,
  masterRoles?: readonly MasterRole[],
): boolean {
  if (isSuperAdminRole(role, masterRoles)) return true
  if (readRoles === 'authenticated') return Boolean(role)
  return hasNavRole(readRoles, role, masterRoles)
}
