// Dashboard Page Components
export { DashboardPowerBi } from './components/dashboard-powerbi'

// Detail Components
export { UpdatedDashboardSummary } from './components/updated-dashboard-summary'
export { UpdatedOutletsList } from './components/updated-outlets-list'
export { UpdatedSalesList } from './components/updated-sales-list'
export { OutletDetail } from './components/outlet-detail'
export { SalesDetail } from './components/sales-detail'
export { ReportsPage } from './components/reports-page'
export { DateRangeFilter } from './components/date-range-filter'
export { MetricCard } from './components/metric-card'
export { PerformanceRank } from './components/performance-rank'
export { OutletSalesFilter } from './components/outlet-sales-filter'

// API
export { dashboardApi } from './api/dashboard.api'
export { reportsApi } from './api/reports.api'

// Hooks
export {
  useDashboardSummary,
  useDashboardOutlets,
  useDashboardProducts,
  useDashboardSales,
  useDashboardAreas,
  useDashboardOutletDetail,
  useDashboardSalesDetail,
  useDashboardRevenueTrend,
} from './hooks/use-dashboard'
export {
  useTransactionReport,
  useSalesAggregateReport,
  useSuppliesReport,
  useReturnsReport,
  usePerformanceReport,
  exportTransactionReportToExcel,
  exportSalesAggregateReportToExcel,
  exportSuppliesReportToExcel,
  exportReturnsReportToExcel,
  exportPerformanceReportToExcel,
} from './hooks/use-reports'

// New exports - Store
export {
  useDashboardStore,
  selectDateRange,
  selectTrendParams,
} from './stores/dashboard.store'

// Existing types
export type {
  DashboardSummary,
  DashboardOutletKpi,
  DashboardProductKpi,
  DashboardProductsResponse,
  DashboardSalesKpi,
  DashboardAreaKpi,
  DashboardPerformanceOutlet,
  DashboardPerformanceSales,
  DashboardPerformanceSalesOutlet,
  MasterOutlet,
} from './types/dashboard.types'

// New types
export type {
  DateRangeParams,
  PaginationInfo,
  ApiResponse,
  OutletDetailResponse,
  ProductDetail,
  SalesDetailResponse,
  OutletBreakdown,
  RevenueTrendResponse,
  TrendPoint,
} from './types/dashboard.types'

export type {
  TransactionReport,
  SalesAggregateReport,
  SupplyReport,
  ReturnReport,
  PerformanceReport,
  ReportParams,
  ReportResponse,
  StorePerformanceItem,
  SalesPerformanceItem,
  TopPerformer,
  BottomPerformer,
} from './types/reports.types'
