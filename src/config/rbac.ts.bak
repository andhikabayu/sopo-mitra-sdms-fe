/**
 * RBAC permission keys from API_DOCS.md — must match `name` on GET /master/roles.
 * Used for nav visibility and CRUD guards, not as the master role catalog.
 */
export const RBAC = {
  SALES: 'Sales',
  MANAGER: 'Manager',
  STORE_INSPECTOR: 'Store Inspector',
  SUPER_ADMIN: 'Super Admin',
} as const

export type RbacRoleKey = (typeof RBAC)[keyof typeof RBAC]
