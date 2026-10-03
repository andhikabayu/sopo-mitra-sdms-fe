import type { MasterRole } from '@/types/role'
import { RBAC } from '@/config/rbac'

const LEGACY_ROLE_MAP: Record<string, string> = {
  Admin: RBAC.MANAGER,
  'Admin Lapangan': RBAC.STORE_INSPECTOR,
}

/** Normalize backend / legacy role strings. */
export function normalizeRole(role?: string | null): string | undefined {
  if (!role?.trim()) return undefined
  const trimmed = role.trim()
  if (LEGACY_ROLE_MAP[trimmed]) return LEGACY_ROLE_MAP[trimmed]
  if (trimmed.toLowerCase() === RBAC.SUPER_ADMIN.toLowerCase()) return RBAC.SUPER_ADMIN
  return trimmed
}

/** Extract role from login response, JWT claims, or user profile. */
export function extractRoleFromClaims(claims: Record<string, unknown>): string | undefined {
  const pick = (key: string): string | undefined =>
    typeof claims[key] === 'string' ? (claims[key] as string) : undefined

  return normalizeRole(
    pick('role') ?? pick('role_name') ?? pick('user_role') ?? pick('authorities'),
  )
}

export function resolveSuperAdminRoleName(
  masterRoles?: readonly MasterRole[],
): string | undefined {
  if (!masterRoles?.length) return RBAC.SUPER_ADMIN
  return (
    masterRoles.find((role) => role.name.toLowerCase() === RBAC.SUPER_ADMIN.toLowerCase())?.name ??
    RBAC.SUPER_ADMIN
  )
}

export function isSuperAdminRole(
  userRole?: string | null,
  masterRoles?: readonly MasterRole[],
): boolean {
  const normalized = normalizeRole(userRole)
  if (!normalized) return false
  const superAdminName = resolveSuperAdminRoleName(masterRoles) ?? RBAC.SUPER_ADMIN
  return normalized.toLowerCase() === superAdminName.toLowerCase()
}

/** @deprecated Use isSuperAdminRole — kept for gradual migration. */
export function isSuperAdmin(userRole?: string | null): boolean {
  return isSuperAdminRole(userRole)
}

export function hasNavRole(
  allowedRoles: readonly string[] | undefined,
  userRole?: string | null,
  masterRoles?: readonly MasterRole[],
): boolean {
  if (isSuperAdminRole(userRole, masterRoles)) return true
  const normalized = normalizeRole(userRole)
  if (!allowedRoles?.length || !normalized) return false
  return allowedRoles.includes(normalized)
}

export function roleExistsInMaster(
  roleName: string,
  masterRoles?: readonly MasterRole[],
): boolean {
  if (!masterRoles?.length) return true
  return masterRoles.some((role) => role.name === roleName)
}
