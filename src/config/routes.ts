/**
 * Centralized route + API path constants.
 * Avoids hardcoded strings scattered across the codebase (DRY).
 */

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  masterUsers: '/master/users',
  masterLocations: '/master/locations',
  masterCoverageAreas: '/master/coverage-areas',
  masterSalesAssignments: '/master/sales-assignments',
  masterRoles: '/master/roles',
  masterProducts: '/master/products',
  outlets: '/outlets',
  supplies: '/supplies',
  returns: '/returns',
  stockAudits: '/stock-audits',
  inventory: '/inventory',
  purchaseOrders: '/purchase-orders',
  transactions: '/transactions',
  commissions: '/commissions',
  reports: '/reports',
} as const

export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  users: {
    base: '/users',
    allSales: '/users/get-sales',
    byId: (id: string | number) => `/users/${id}`,
  },
  roles: {
    base: '/master/roles',
    byId: (id: string | number) => `/master/roles/${id}`,
  },
  locations: {
    cities: '/master/location/city',
    cityDetail: (id: string | number) => `/master/location/city/detail/${id}`,
    districts: (cityId: string | number) => `/master/location/district/${cityId}`,
    districtDetail: (id: string | number) => `/master/location/district/detail/${id}`,
    subDistricts: (districtId: string | number) => `/master/location/sub-district/${districtId}`,
    subDistrictDetail: (id: string | number) => `/master/location/sub-district/detail/${id}`,
    salesAreas: '/master/location/sales-area',
    data: '/master/location/data',
    coverageSubDistricts: (salesAreaId: string | number) =>
      `/master/location/sales-area/${salesAreaId}/sub-districts`,
    coverageSubDistrict: (salesAreaId: string | number, subDistrictId: string | number) =>
      `/master/location/sales-area/${salesAreaId}/sub-districts/${subDistrictId}`,
  },
  salesAssignments: {
    base: '/sales-assignments',
    bySales: (salesId: string | number) => `/sales-assignments/sales/${salesId}`,
    byArea: (salesAreaId: string | number) => `/sales-assignments/area/${salesAreaId}`,
    unassign: (salesId: string | number, salesAreaId: string | number) =>
      `/sales-assignments/sales/${salesId}/area/${salesAreaId}`,
  },
  products: {
    base: '/products',
    byId: (id: string | number) => `/products/${id}`,
  },
  outlets: {
    base: '/outlets',
    byId: (id: string | number) => `/outlets/${id}`,
    approval: '/outlets/approval-outlets',
    getTotalSalesOutlet: '/outlets/get-total-sales-outlet',
  },
  supplies: {
    base: '/supplies',
    byId: (id: string | number) => `/supplies/${id}`,
  },
  returns: {
    base: '/returns',
    byId: (id: string | number) => `/returns/${id}`,
  },
  stockAudits: {
    base: '/stock-audits',
    byId: (id: string | number) => `/stock-audits/${id}`,
  },
  inventory: {
    base: '/inventory',
    list: '/inventory',
    byOutlet: (outletId: string | number) => `/inventory/outlet/${outletId}`,
    estimated: '/inventory/estimated-revenue',
    estimatedByOutlet: (outletId: string | number) => `/inventory/outlet/${outletId}/estimated-revenue`,
    totals: '/inventory/analytics/total',
    sales: '/inventory/sales',
    salesById: (salesId: string | number) => `/inventory/sales/${salesId}`,
    audit: '/inventory/audit',
    summaryByProduct: (productId: string | number) => `/inventory/summary/product/${productId}`,
    perOutlet: '/inventory/per-outlet',
  },
  dashboard: {
    // ✅ Required APIs from specification
    summary: '/dashboard/summary',
    outlets: '/dashboard/outlets',
    products: '/dashboard/products',
    sales: '/dashboard/sales',
    areas: '/dashboard/areas',
    outletDetail: (outletId: string | number) => `/dashboard/performance/outlets/${outletId}`,
    salesDetail: (salesId: string | number) => `/dashboard/performance/sales/${salesId}`,
    analyticsRevenueTrend: '/dashboard/analytics/revenue-trend',
  },
  reports: {
    // Transaction-level reports
    transactions: '/reports/transactions',
    salesAggregate: '/reports/sales',
    supplies: '/reports/supplies',
    returns: '/reports/returns',
    performance: '/reports/performance',
    // KPI reports
    kpiProducts: '/reports/products',
    kpiOutlets: '/reports/outlets',
    kpiSales: '/reports/sales',
    kpiAreas: '/reports/areas',
  },
  commissions: {
    salesPayout: (salesId: string | number) => `/commissions/sales/${salesId}/payout`,
  },
  commissionInvoices: {
    generate: '/commission-invoices/generate',
    base: '/commission-invoices',
    byId: (id: string | number) => `/commission-invoices/${id}`,
    pay: (invoiceId: string | number) => `/commission-invoices/${invoiceId}/pay`,
    salesSummary: (salesId: string | number) => `/commission-invoices/sales/${salesId}/summary`,
  },
  purchaseOrders: {
    base: '/purchase-orders',
    byId: (id: string | number) => `/purchase-orders/${id}`,
    analytics: (id: string | number) => `/purchase-orders/${id}/analytics`,
  },
  transactions: {
    base: '/transactions',
  },
} as const

/** Route prefixes that require authentication. */
export const PROTECTED_PREFIXES = [
  '/dashboard',
  '/dashboard-sales',
  '/master',
  '/outlets',
  '/supplies',
  '/returns',
  '/stock-audits',
  '/inventory',
  '/purchase-orders',
  '/transactions',
  '/commissions',
  '/reports',
  '/profile',
] as const

/** Public routes that authenticated users should be redirected away from. */
export const AUTH_ROUTES = ['/login'] as const
