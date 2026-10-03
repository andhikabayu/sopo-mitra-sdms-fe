import {
  FiActivity,
  FiArchive,
  FiBarChart2,
  FiBox,
  FiClipboard,
  FiDatabase,
  FiDollarSign,
  FiGrid,
  FiLink,
  FiMapPin,
  FiPackage,
  FiRefreshCcw,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import { RBAC } from '@/config/rbac'
import type { MasterRole } from '@/types/role'
import { hasNavRole, isSuperAdminRole } from '@/lib/auth/roles'
import { ROUTES } from '@/config/routes'

export type { RoleName } from '@/types/role'

export interface NavItem {
  title: string
  href?: string
  icon?: IconType
  roles?: readonly string[]
  items?: readonly NavItem[]
}

export const navItems: readonly NavItem[] = [
  {
    title: 'Sales Dashboard',
    href: '/dashboard-sales',
    icon: FiBarChart2,
    roles: [RBAC.SALES],
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: FiBarChart2,
    roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
  },
  {
    title: 'Master Data',
    icon: FiDatabase,
    roles: [RBAC.SALES, RBAC.MANAGER, RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN],
    items: [
      {
        title: 'Users',
        href: '/master/users',
        icon: FiUsers,
        roles: [RBAC.SUPER_ADMIN],
      },
      {
        title: 'Roles',
        href: '/master/roles',
        icon: FiShield,
        roles: [RBAC.SALES, RBAC.MANAGER, RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN],
      },
      {
        title: 'Locations',
        href: '/master/locations',
        icon: FiMapPin,
        roles: [RBAC.SUPER_ADMIN, RBAC.SALES, RBAC.MANAGER, RBAC.STORE_INSPECTOR],
      },
      {
        title: 'Coverage Areas',
        href: '/master/coverage-areas',
        icon: FiLink,
        roles: [RBAC.SUPER_ADMIN, RBAC.MANAGER],
      },
      {
        title: 'Sales Assignments',
        href: '/master/sales-assignments',
        icon: FiUserCheck,
        roles: [RBAC.SUPER_ADMIN, RBAC.MANAGER],
      },
      {
        title: 'Products',
        href: '/master/products',
        icon: FiPackage,
        roles: [RBAC.SALES, RBAC.MANAGER, RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN],
      },
    ],
  },
  {
    title: 'Operations',
    icon: FiGrid,
    roles: [RBAC.SALES, RBAC.MANAGER, RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN],
    items: [
      {
        title: 'Outlets',
        href: '/outlets',
        icon: FiShoppingBag,
        roles: [RBAC.SALES, RBAC.MANAGER, RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN],
      },
      {
        title: 'Supplies',
        href: '/supplies',
        icon: FiTruck,
        roles: [RBAC.SALES, RBAC.STORE_INSPECTOR, RBAC.MANAGER, RBAC.SUPER_ADMIN],
      },
      {
        title: 'Returns',
        href: '/returns',
        icon: FiRefreshCcw,
        roles: [RBAC.SALES, RBAC.STORE_INSPECTOR, RBAC.MANAGER, RBAC.SUPER_ADMIN],
      },
      {
        title: 'Stock Audits',
        href: '/stock-audits',
        icon: FiClipboard,
        roles: [RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN, RBAC.MANAGER],
      },
      {
        title: 'Inventory',
        href: '/inventory',
        icon: FiArchive,
        roles: [RBAC.SALES, RBAC.MANAGER, RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN],
      },
    ],
  },
  {
    title: 'Procurement',
    icon: FiBox,
    roles: [RBAC.SALES, RBAC.MANAGER, RBAC.SUPER_ADMIN],
    items: [
      {
        title: 'Purchase Orders',
        href: '/purchase-orders',
        icon: FiClipboard,
        roles: [RBAC.SALES, RBAC.MANAGER, RBAC.SUPER_ADMIN],
      },
    ],
  },
  {
    title: 'Transactions',
    href: ROUTES.transactions,
    icon: FiDollarSign,
    roles: [RBAC.SALES, RBAC.MANAGER, RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN],
  },
  // {
  //   title: 'Commissions',
  //   icon: FiDollarSign,
  //   roles: [RBAC.SALES, RBAC.MANAGER, RBAC.SUPER_ADMIN],
  //   items: [
  //     {
  //       title: 'Payout',
  //       href: '/commissions',
  //       icon: FiTrendingUp,
  //       roles: [RBAC.SALES, RBAC.MANAGER, RBAC.SUPER_ADMIN],
  //     },
  //   ],
  // },
  {
    title: 'Reports',
    icon: FiActivity,
    // Include Sales so they can access the Commission Invoices child
    roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN, RBAC.SALES],
    items: [
      {
        title: 'Transactions',
        href: '/reports/transactions',
        icon: FiDollarSign,
        roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
      },
      {
        title: 'Supplies',
        href: '/reports/supplies',
        icon: FiTruck,
        roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
      },
      {
        title: 'Returns',
        href: '/reports/returns',
        icon: FiRefreshCcw,
        roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
      },
      {
        title: 'Outlet KPI',
        href: '/reports/outlets',
        icon: FiBox,
        roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
      },
      // {
      //   title: 'Product KPI',
      //   href: '/reports/products',
      //   icon: FiPackage,
      //   roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
      // },
      {
        title: 'Commission Invoices',
        href: '/commission-invoices',
        icon: FiClipboard,
        roles: [RBAC.SUPER_ADMIN, RBAC.MANAGER, RBAC.SALES],
      },
      {
        title: 'Sales KPI',
        href: '/reports/sales',
        icon: FiUsers,
        roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
      },
      // {
      //   title: 'Area KPI',
      //   href: '/reports/areas',
      //   icon: FiMapPin,
      //   roles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
      // },
    ],
  },
]

export function canAccessNavItem(
  item: NavItem,
  role?: string,
  masterRoles?: readonly MasterRole[],
): boolean {
  return hasNavRole(item.roles, role, masterRoles)
}

export function filterNavByRole(
  items: readonly NavItem[],
  role?: string,
  masterRoles?: readonly MasterRole[],
): NavItem[] {
  if (isSuperAdminRole(role, masterRoles)) {
    return items.map((item) => ({
      ...item,
      items: item.items ? filterNavByRole(item.items, role, masterRoles) : undefined,
    }))
  }

  return items
    .filter((item) => canAccessNavItem(item, role, masterRoles))
    .map((item) => ({
      ...item,
      items: item.items ? filterNavByRole(item.items, role, masterRoles) : undefined,
    }))
    .filter((item) => item.href || (item.items && item.items.length > 0))
}

export function findNavTitleByPath(
  pathname: string,
  items: readonly NavItem[] = navItems,
): string | null {
  for (const item of items) {
    if (item.href === pathname) return item.title
    if (item.items) {
      const child = findNavTitleByPath(pathname, item.items)
      if (child) return child
    }
  }
  return null
}
