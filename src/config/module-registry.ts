import { RBAC } from '@/config/rbac'
import { moduleDefinitions, type ModuleDefinition } from '@/config/modules'
import type { ColumnFormat } from '@/components/data-table/data-table'
import type { ReactNode } from 'react'

export interface TableColumnConfig {
  key: string
  label: string
  format?: ColumnFormat
  sortable?: boolean
  render?: (row: Record<string, unknown>) => ReactNode
}

export interface CrudPermissions {
  create?: readonly string[]
  update?: readonly string[]
  delete?: readonly string[]
}

export interface ModuleApiConfig {
  list: string
  create?: string
  update?: (id: string | number) => string
  delete?: (id: string | number) => string
}

export interface ModuleRegistryEntry {
  module: ModuleDefinition
  tableColumns: TableColumnConfig[]
  crud: CrudPermissions
  api: ModuleApiConfig
  updateHiddenFields?: string[]
  createOnlyFields?: string[]
}

export const moduleRegistry: Record<string, ModuleRegistryEntry> = {
  '/master/users': {
    module: moduleDefinitions.find((m) => m.path === '/master/users')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'username', label: 'Username', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true, format: 'badge' },
      { key: 'address', label: 'Address' },
      { key: 'phone_number', label: 'Phone Number', sortable: true },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status', format: 'boolean', sortable: true },
      // ...auditColumns,
    ],
    crud: { create: [RBAC.SUPER_ADMIN], update: [RBAC.SUPER_ADMIN], delete: [RBAC.SUPER_ADMIN] },
    api: {
      list: '/users',
      create: '/users',
      update: (id) => `/users/${id}`,
      delete: (id) => `/users/${id}`,
    },
    createOnlyFields: ['password'],
  },
  '/master/roles': {
    module: moduleDefinitions.find((m) => m.path === '/master/roles')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Role Name', sortable: true },
    ],
    crud: {},
    api: { list: '/master/roles' },
  },
  '/master/products': {
    module: moduleDefinitions.find((m) => m.path === '/master/products')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      { key: 'sku', label: 'SKU', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'unit', label: 'Unit', sortable: true },
      { key: 'price', label: 'Price', format: 'currency', sortable: true },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status', format: 'boolean', sortable: true },
      // ...auditColumns,
    ],
    crud: { create: [RBAC.SUPER_ADMIN], update: [RBAC.SUPER_ADMIN], delete: [RBAC.SUPER_ADMIN] },
    api: {
      list: '/products',
      create: '/products',
      update: (id) => `/products/${id}`,
      delete: (id) => `/products/${id}`,
    },
  },
  '/outlets': {
    module: moduleDefinitions.find((m) => m.path === '/outlets')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      { key: 'outlet_name', label: 'Outlet Name', sortable: true },
      { key: 'outlet_type', label: 'Outlet Type', sortable: true },
      // { key: 'email', label: 'Email', sortable: true },
      // { key: 'pic_name', label: 'PIC Name', sortable: true },
      // { key: 'phone_number', label: 'Phone Number', sortable: true },
      { key: 'city', label: 'City', sortable: true },
      { key: 'district', label: 'District', sortable: true },
      { key: 'sub_district', label: 'Sub District', sortable: true },
      { key: 'sales_area', label: 'Sales Area', sortable: true },
      // { key: 'address', label: 'Address' },
      // { key: 'gmaps_url', label: 'Google Maps URL' },
      // { key: 'latitude', label: 'Latitude', sortable: true },
      // { key: 'longitude', label: 'Longitude', sortable: true },
      { key: 'approval', label: 'Status', format: 'badge'},
      // ...auditColumns,
      // ...softDeleteColumns,
    ],
    crud: { create: [RBAC.SALES, RBAC.SUPER_ADMIN], update: [RBAC.SUPER_ADMIN], delete: [RBAC.SUPER_ADMIN] },
    api: {
      list: '/outlets',
      create: '/outlets',
      update: (id) => `/outlets/${id}`,
      delete: (id) => `/outlets/${id}`,
    },
  },
  '/supplies': {
    module: moduleDefinitions.find((m) => m.path === '/supplies')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      { key: 'supply_no', label: 'Supply No', sortable: true },
      // { key: 'outlet_id', label: 'Outlet ID', sortable: true },
      { key: 'sales_name', label: 'Sales Name', sortable: true },
      { key: 'outlet_name', label: 'Outlet', sortable: true },
      {
        key: 'items',
        label: 'Product',
        render: (row) => {
          const items = row.items as Array<{ product_name?: string }> | undefined
          return items?.map((item) => item.product_name).join(', ')
        },
      },
      // { key: 'sales_id', label: 'Sales ID', sortable: true },
      { key: 'total_qty', label: 'Total Qty', format: 'number', sortable: true },
      { key: 'total_amount', label: 'Total Amount', format: 'currency', sortable: true },
      { key: 'status', label: 'Status', format: 'boolean', sortable: true },
      // { key: 'createdBy', label: 'Created By', sortable: true },
      { key: 'createdAt', label: 'Date', format: 'date', sortable: true },
      { key: 'notes', label: 'Notes' },
      // { key: 'updatedAt', label: 'Updated At', format: 'date', sortable: true },
    ],
    crud: { create: [RBAC.SALES, RBAC.SUPER_ADMIN] },
    api: { list: '/supplies', create: '/supplies' },
  },
  '/returns': {
    module: moduleDefinitions.find((m) => m.path === '/returns')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      { key: 'return_no', label: 'Return No', sortable: true },
      // { key: 'outlet_id', label: 'Outlet ID', sortable: true },
      { key: 'sales_name', label: 'Sales Name', sortable: true },
      { key: 'outlet_name', label: 'Outlet', sortable: true },
      { key: 'total_qty', label: 'Total Qty', format: 'number', sortable: true },
      { key: 'reason', label: 'Reason', sortable: true },
      { key: 'status', label: 'Status', format: 'boolean', sortable: true },
      // { key: 'createdBy', label: 'Created By', sortable: true },
      { key: 'createdAt', label: 'Date', format: 'date', sortable: true },
      { key: 'notes', label: 'Notes' },
      // { key: 'updatedAt', label: 'Updated At', format: 'date', sortable: true },
    ],
    crud: { create: [RBAC.SALES, RBAC.SUPER_ADMIN] },
    api: { list: '/returns', create: '/returns' },
  },
  '/stock-audits': {
    module: moduleDefinitions.find((m) => m.path === '/stock-audits')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      { key: 'audit_no', label: 'Audit No', sortable: true },
      // { key: 'outlet_id', label: 'Outlet ID', sortable: true },
      { key: 'auditor_name', label: 'Auditor Name', sortable: true },
      { key: 'outlet_name', label: 'Outlet', sortable: true },
      { key: 'has_discrepancy', label: 'Discrepancy', format: 'boolean', sortable: true },
      { key: 'status', label: 'Status', format: 'boolean', sortable: true },
      // { key: 'createdBy', label: 'Created By', sortable: true },
      { key: 'createdAt', label: 'Date', format: 'date', sortable: true },
      // { key: 'updatedAt', label: 'Updated At', format: 'date', sortable: true },
      { key: 'notes', label: 'Notes' },
    ],
    crud: { create: [RBAC.STORE_INSPECTOR, RBAC.SUPER_ADMIN] },
    api: { list: '/stock-audits', create: '/stock-audits' },
  },
  '/purchase-orders': {
    module: moduleDefinitions.find((m) => m.path === '/purchase-orders')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      { key: 'id', label: 'ID', sortable: true },
      { key: 'sales_name', label: 'Sales', sortable: true },
      {
        key: 'items',
        label: 'Outlet Name',
        render: (row) => {
          const items = row.items as Array<{ outlet_name?: string }> | undefined
          return items?.map((item) => item.outlet_name).join(', ')
        },
      },
      {
        key: 'items',
        label: 'Products',
        render: (row) => {
          const items = row.items as Array<{ product_name?: string }> | undefined
          return items?.map((item) => item.product_name).join(', ')
        },
      },
      // { key: 'items_count', label: 'Items', format: 'number', sortable: true },
      { key: 'status', label: 'Status', format: 'badge', sortable: true },
      { key: 'createdAt', label: 'Date', format: 'date', sortable: true },
      { key: 'notes', label: 'Notes' },
    ],
    // delete: only allowed for the Sales (creator) in UI; approval/management handled by Manager/Super Admin
    crud: { create: [RBAC.SALES, RBAC.MANAGER, RBAC.SUPER_ADMIN], update: [RBAC.MANAGER, RBAC.SUPER_ADMIN], delete: [RBAC.SALES] },
    api: {
      list: '/purchase-orders',
      create: '/purchase-orders',
      update: (id) => `/purchase-orders/${id}`,
      delete: (id) => `/purchase-orders/${id}`,
    },
  },
  '/inventory': {
    module: moduleDefinitions.find((m) => m.path === '/inventory')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      { key: 'sales_name', label: 'Sales Name', sortable: false },
      { key: 'product_name', label: 'Product', sortable: true },
      { key: 'source_type', label: 'Source Type', sortable: true },
      { key: 'delta', label: 'Delta', format: 'number', sortable: true },
      { key: 'before_qty', label: 'Before Qty', format: 'number', sortable: true },
      { key: 'after_qty', label: 'After Qty', format: 'number', sortable: true },
      { key: 'createdBy', label: 'Created By', sortable: true },
      { key: 'createdAt', label: 'Created At', format: 'date', sortable: true },
      { key: 'note', label: 'Note' },
    ],
    crud: {},
    api: { list: '/inventory/audit' },
  },
  '/reports/outlets': {
    module: moduleDefinitions.find((m) => m.path === '/reports/outlets')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'outlet_id', label: 'Outlet ID', sortable: true },
      { key: 'outlet_name', label: 'Outlet', sortable: true },
      { key: 'sales_area', label: 'Sales Area', sortable: true },
      { key: 'supply', label: 'Supply', format: 'number', sortable: true },
      { key: 'retur', label: 'Retur', format: 'number', sortable: true },
      { key: 'actual_sales', label: 'Actual Sales', format: 'number', sortable: true },
      { key: 'revenue', label: 'Revenue', format: 'currency', sortable: true },
      { key: 'stock', label: 'Stock', format: 'number', sortable: true },
      { key: 'sell_through', label: 'Sell Through (%)', format: 'number', sortable: true },
    ],
    crud: {},
    api: { list: '/dashboard/outlets' },
  },
  '/reports/products': {
    module: moduleDefinitions.find((m) => m.path === '/reports/products')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'product_id', label: 'Product ID', sortable: true },
      { key: 'sku', label: 'SKU', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'supply', label: 'Supply', format: 'number', sortable: true },
      { key: 'retur', label: 'Retur', format: 'number', sortable: true },
      { key: 'actual_sales', label: 'Actual Sales', format: 'number', sortable: true },
      { key: 'revenue', label: 'Revenue', format: 'currency', sortable: true },
      { key: 'sell_through', label: 'Sell Through (%)', format: 'number', sortable: true },
    ],
    crud: {},
    api: { list: '/dashboard/products' },
  },
  '/reports/sales': {
    module: moduleDefinitions.find((m) => m.path === '/reports/sales')!,
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'sales_id', label: 'Sales ID', sortable: true },
      { key: 'sales_name', label: 'Sales Name', sortable: true },
      { key: 'supply', label: 'Supply', format: 'number', sortable: true },
      { key: 'retur', label: 'Retur', format: 'number', sortable: true },
      { key: 'revenue', label: 'Revenue', format: 'currency', sortable: true },
    ],
    crud: {},
    api: { list: '/dashboard/sales' },
  },
  '/reports/areas': {
    module: moduleDefinitions.find((m) => m.path === '/reports/areas')!,
    tableColumns: [
      { key: 'area', label: 'Area', sortable: true },
      { key: 'supply', label: 'Supply', format: 'number', sortable: true },
      { key: 'actual_sales', label: 'Actual Sales', format: 'number', sortable: true },
      { key: 'revenue', label: 'Revenue', format: 'currency', sortable: true },
      { key: 'sell_through', label: 'Sell Through (%)', format: 'number', sortable: true },
    ],
    crud: {},
    api: { list: '/dashboard/areas' },
  },
}

export function getModuleRegistry(pathname: string): ModuleRegistryEntry | undefined {
  return moduleRegistry[pathname]
}

export interface LocationTabConfig {
  key: 'cities' | 'districts' | 'sub_districts' | 'sales_areas'
  label: string
  tableColumns: TableColumnConfig[]
  createEndpoint: string
  listEndpoint: string | ((parentId?: number) => string)
  fields: { key: string; label: string; type: 'text' | 'relation'; required?: boolean; relationKey?: string }[]
  parentKey?: 'city_id' | 'district_id'
}

export const locationTabs: LocationTabConfig[] = [
  {
    key: 'cities',
    label: 'Cities',
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
    ],
    createEndpoint: '/master/location/city',
    listEndpoint: '/master/location/city',
    fields: [{ key: 'name', label: 'Name', type: 'text', required: true }],
  },
  {
    key: 'districts',
    label: 'Districts',
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      // { key: 'city_id', label: 'City ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
    ],
    createEndpoint: '/master/location/district',
    listEndpoint: (cityId) => `/master/location/district/${cityId ?? 0}`,
    fields: [
      { key: 'city_id', label: 'City', type: 'relation', required: true, relationKey: 'cities' },
      { key: 'name', label: 'Name', type: 'text', required: true },
    ],
    parentKey: 'city_id',
  },
  {
    key: 'sub_districts',
    label: 'Sub Districts',
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      // { key: 'district_id', label: 'District ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
    ],
    createEndpoint: '/master/location/sub-district',
    listEndpoint: (districtId) => `/master/location/sub-district/${districtId ?? 0}`,
    fields: [
      { key: 'district_id', label: 'District', type: 'relation', required: true, relationKey: 'districts' },
      { key: 'name', label: 'Name', type: 'text', required: true },
    ],
    parentKey: 'district_id',
  },
  {
    key: 'sales_areas',
    label: 'Sales Areas',
    tableColumns: [
      { key: '__index', label: 'No', format: 'index' },
      // { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
    ],
    createEndpoint: '/master/location/sales-area',
    listEndpoint: '/master/location/sales-area',
    fields: [{ key: 'name', label: 'Name', type: 'text', required: true }],
  },
]

export const ARRAY_ITEM_FIELDS: Record<string, { key: string; label: string; type: 'relation' | 'number' }[]> = {
  items: [
    { key: 'product_id', label: 'Product', type: 'relation' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
  ],
  stock_audit_items: [
    { key: 'product_id', label: 'Product', type: 'relation' },
    { key: 'physical_stock', label: 'Physical Stock', type: 'number' },
  ],
  purchase_order_items: [
    { key: 'outlet_id', label: 'Outlet', type: 'relation' },
    { key: 'product_id', label: 'Product', type: 'relation' },
    { key: 'requested_qty', label: 'Requested Qty', type: 'number' },
  ],
}

export const coverageAreaColumns: TableColumnConfig[] = [
  { key: 'id', label: 'Mapping ID', sortable: true },
  { key: 'sub_district_id', label: 'Sub District ID', sortable: true },
  { key: 'sub_district_name', label: 'Sub District', sortable: true },
  { key: 'district_id', label: 'District ID', sortable: true },
]

export const salesAssignmentBySalesColumns: TableColumnConfig[] = [
  { key: 'id', label: 'Assignment ID', sortable: true },
  { key: 'sales_area_id', label: 'Sales Area ID', sortable: true },
  { key: 'sales_area_name', label: 'Sales Area', sortable: true },
]

export const salesAssignmentByAreaColumns: TableColumnConfig[] = [
  { key: 'id', label: 'Assignment ID', sortable: true },
  { key: 'sales_id', label: 'Sales ID', sortable: true },
  { key: 'sales_name', label: 'Sales Name', sortable: true },
]
