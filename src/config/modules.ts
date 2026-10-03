import { RBAC } from '@/config/rbac'

export type ModuleFieldType =
  | 'array'
  | 'boolean'
  | 'email'
  | 'number'
  | 'password'
  | 'relation'
  | 'select'
  | 'text'
  | 'textarea'
  | 'multiselect'

export interface ModuleField {
  key: string
  label: string
  type: ModuleFieldType
  required?: boolean
}

export interface ModuleDefinition {
  path: string
  title: string
  description: string
  endpoint: string
  readRoles: 'authenticated' | readonly string[]
  writeRoles?: readonly string[]
  fields: readonly ModuleField[]
}

export const moduleDefinitions = [
  {
    path: '/master/users',
    title: 'Users',
    description: 'Manage system users and role assignment.',
    endpoint: '/users and /auth/signup',
    readRoles: 'authenticated',
    writeRoles: [RBAC.SUPER_ADMIN],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'username', label: 'Username', type: 'text', required: true },
      { key: 'password', label: 'Password', type: 'password', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'role', label: 'Role', type: 'select' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'phone_number', label: 'Phone Number', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'boolean' },
    ],
  },
  {
    path: '/master/locations',
    title: 'Locations',
    description: 'City, district, sub-district, and sales area master data.',
    endpoint: '/master/location/*',
    readRoles: 'authenticated',
    writeRoles: [RBAC.SUPER_ADMIN],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'city_id', label: 'City', type: 'relation' },
      { key: 'district_id', label: 'District', type: 'relation' },
    ],
  },
  {
    path: '/master/coverage-areas',
    title: 'Coverage Areas',
    description: 'Assign sub-districts to sales areas (many-to-many mapping).',
    endpoint: '/master/location/sales-area/{id}/sub-districts',
    readRoles: 'authenticated',
    writeRoles: [RBAC.SUPER_ADMIN],
    fields: [
      { key: 'sales_area_id', label: 'Sales Area', type: 'relation', required: true },
      { key: 'sub_district_ids', label: 'Sub Districts', type: 'multiselect', required: true },
    ],
  },
  {
    path: '/master/sales-assignments',
    title: 'Sales Assignments',
    description: 'Assign sales areas to sales personnel.',
    endpoint: '/sales-assignments',
    readRoles: 'authenticated',
    writeRoles: [RBAC.SUPER_ADMIN],
    fields: [
      { key: 'sales_id', label: 'Sales', type: 'relation', required: true },
      { key: 'sales_area_ids', label: 'Sales Areas', type: 'multiselect', required: true },
    ],
  },
  {
    path: '/master/roles',
    title: 'Roles',
    description: 'Master role catalog from GET /master/roles.',
    endpoint: '/master/roles',
    readRoles: 'authenticated',
    fields: [],
  },
  {
    path: '/master/products',
    title: 'Products',
    description: 'Product catalog used by supplies, returns, inventory, and dashboard KPIs.',
    endpoint: '/products',
    readRoles: 'authenticated',
    writeRoles: [RBAC.SUPER_ADMIN],
    fields: [
      { key: 'sku', label: 'SKU', type: 'text', required: true },
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'unit', label: 'Unit', type: 'text' },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'boolean' },
    ],
  },
  {
    path: '/outlets',
    title: 'Outlets',
    description: 'Outlet registration and approval workflow.',
    endpoint: '/outlets',
    readRoles: 'authenticated',
    writeRoles: [RBAC.SALES, RBAC.SUPER_ADMIN],
    fields: [
      { key: 'outlet_name', label: 'Outlet Name', type: 'text', required: true },
      { key: 'outlet_type', label: 'Outlet Type', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'pic_name', label: 'PIC Name', type: 'text' },
      { key: 'phone_number', label: 'Phone Number', type: 'text' },
      { key: 'city_id', label: 'City', type: 'relation' },
      { key: 'district_id', label: 'District', type: 'relation' },
      { key: 'sub_district_id', label: 'Sub District', type: 'relation' },
      { key: 'sales_area_id', label: 'Sales Area', type: 'relation' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'latitude', label: 'Latitude', type: 'text', required: true},
      { key: 'longitude', label: 'Longitude', type: 'text', required: true},
      { key: 'gmaps_url', label: 'Google Maps URL', type: 'text' },
      // { key: 'status', label: 'Status', type: 'boolean' },
    ],
  },
  {
    path: '/supplies',
    title: 'Supplies',
    description: 'Multi-product stock supply from sales to outlets.',
    endpoint: '/supplies',
    readRoles: 'authenticated',
    writeRoles: [RBAC.SALES, RBAC.SUPER_ADMIN],
    fields: [
      { key: 'outlet_id', label: 'Outlet', type: 'relation', required: true },
      { key: 'sales_id', label: 'Sales', type: 'relation' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'items', label: 'Items', type: 'array', required: true },
    ],
  },
  {
    path: '/returns',
    title: 'Returns',
    description: 'Multi-product returns from outlets with stock validation.',
    endpoint: '/returns',
    readRoles: 'authenticated',
    writeRoles: [RBAC.SALES, RBAC.SUPER_ADMIN],
    fields: [
      { key: 'outlet_id', label: 'Outlet', type: 'relation', required: true },
      { key: 'sales_id', label: 'Sales', type: 'relation' },
      { key: 'reason', label: 'Reason', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'items', label: 'Items', type: 'array', required: true },
    ],
  },
  {
    path: '/stock-audits',
    title: 'Stock Audits',
    description: 'Physical stock audit and actual sales reconciliation.',
    endpoint: '/stock-audits',
    readRoles: 'authenticated',
    writeRoles: [RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN],
    fields: [
      { key: 'outlet_id', label: 'Outlet', type: 'relation', required: true },
      { key: 'auditor_id', label: 'Auditor', type: 'relation' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'items', label: 'Items', type: 'array', required: true },
    ],
  },
  {
    path: '/inventory',
    title: 'Inventory',
    description: 'Current stock quantity per outlet and product.',
    endpoint: '/inventory',
    readRoles: [RBAC.SUPER_ADMIN, RBAC.MANAGER, RBAC.SALES, RBAC.STORE_INSPECTOR],
    writeRoles: [RBAC.SUPER_ADMIN, RBAC.SALES],
    fields: [],
  },
  {
    path: '/purchase-orders',
    title: 'Purchase Orders',
    description: 'Multi-product purchase order requests and approvals.',
    endpoint: '/purchase-orders',
    readRoles: [RBAC.SUPER_ADMIN, RBAC.MANAGER, RBAC.SALES],
    writeRoles: [RBAC.SUPER_ADMIN, RBAC.MANAGER, RBAC.SALES],
    fields: [
      { key: 'sales_id', label: 'Sales', type: 'relation', required: true },
      { key: 'status', label: 'Status', type: 'select' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'items', label: 'Items', type: 'array', required: true },
    ],
  },
  {
    path: '/commissions',
    title: 'Commissions',
    description: 'Sales commission payouts and calculations.',
    endpoint: '/commissions/sales/{sales_id}/payout',
    readRoles: [RBAC.SUPER_ADMIN, RBAC.MANAGER, RBAC.SALES],
    fields: [],
  },
  {
    path: '/commission-invoices',
    title: 'Commission Invoices',
    description: 'Generate, manage, and pay commission invoices.',
    endpoint: '/commission-invoices',
    readRoles: [RBAC.SUPER_ADMIN, RBAC.MANAGER],
    writeRoles: [RBAC.SUPER_ADMIN, RBAC.MANAGER],
    fields: [
      { key: 'sales_id', label: 'Sales', type: 'relation' },
      { key: 'start_date', label: 'Start Date', type: 'text' },
      { key: 'end_date', label: 'End Date', type: 'text' },
    ],
  },
  {
    path: '/reports/outlets',
    title: 'Outlet KPI',
    description: 'Supply, return, actual sales, revenue, stock, and sell-through per outlet.',
    endpoint: '/dashboard/outlets',
    readRoles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
    fields: [],
  },
  {
    path: '/reports/products',
    title: 'Product KPI',
    description: 'Product performance, best seller, and slow moving reports.',
    endpoint: '/dashboard/products',
    readRoles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
    fields: [],
  },
  {
    path: '/reports/sales',
    title: 'Sales KPI',
    description: 'Supply, returns, and revenue per sales person.',
    endpoint: '/dashboard/sales',
    readRoles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
    fields: [],
  },
  {
    path: '/reports/areas',
    title: 'Area KPI',
    description: 'Ranking area based on supply, actual sales, revenue, and sell-through.',
    endpoint: '/dashboard/areas',
    readRoles: [RBAC.MANAGER, RBAC.SUPER_ADMIN],
    fields: [],
  },
] as const satisfies readonly ModuleDefinition[]

export function findModuleByPath(pathname: string): ModuleDefinition | undefined {
  return moduleDefinitions.find((moduleDefinition) => moduleDefinition.path === pathname)
}
