import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/** Get date 90 days ago from today */
function getDateFrom90DaysAgo(): string {
  const date = new Date()
  date.setDate(date.getDate() - 90)
  return date.toISOString().split('T')[0]!
}

/** Get today's date in YYYY-MM-DD format */
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]!
}

export interface DashboardStore {
  // Date range state
  dateFrom: string
  dateTo: string
  setDateRange: (from: string, to: string) => void
  resetDateRange: () => void

  // Period/granularity state
  selectedPeriod: 'daily' | 'monthly' | 'yearly'
  setPeriod: (period: 'daily' | 'monthly' | 'yearly') => void

  // Entity selection state
  selectedOutletId?: number
  selectedSalesId?: number
  setSelectedOutlet: (id?: number) => void
  setSelectedSales: (id?: number) => void

  // Filter state
  selectedEntityType: 'outlets' | 'sales'
  setSelectedEntityType: (type: 'outlets' | 'sales') => void

  // UI state
  showDatePicker: boolean
  setShowDatePicker: (show: boolean) => void
}

/**
 * Dashboard global state store
 * - Manages date range selection
 * - Manages time period (daily/monthly/yearly)
 * - Manages entity selection (outlet/sales detail)
 * - Manages UI state (date picker visibility)
 *
 * Usage:
 * ```tsx
 * const { dateFrom, dateTo, setDateRange } = useDashboardStore()
 * ```
 */
export const useDashboardStore = create<DashboardStore>()(
  subscribeWithSelector((set) => ({
    // Date range
    dateFrom: getDateFrom90DaysAgo(),
    dateTo: getTodayDate(),
    setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),
    resetDateRange: () =>
      set({
        dateFrom: getDateFrom90DaysAgo(),
        dateTo: getTodayDate(),
      }),

    // Period
    selectedPeriod: 'daily',
    setPeriod: (period) => set({ selectedPeriod: period }),

    // Entity selection
    selectedOutletId: undefined,
    selectedSalesId: undefined,
    setSelectedOutlet: (id) => set({ selectedOutletId: id }),
    setSelectedSales: (id) => set({ selectedSalesId: id }),

    // Entity type
    selectedEntityType: 'outlets',
    setSelectedEntityType: (type) => set({ selectedEntityType: type }),

    // UI
    showDatePicker: false,
    setShowDatePicker: (show) => set({ showDatePicker: show }),
  })),
)

/**
 * Selector: Get current date range as object
 */
export const selectDateRange = (state: DashboardStore) => ({
  date_from: state.dateFrom,
  date_to: state.dateTo,
})

/**
 * Selector: Get current trend params
 */
export const selectTrendParams = (state: DashboardStore) => ({
  date_from: state.dateFrom,
  date_to: state.dateTo,
  period: state.selectedPeriod,
  entity_type: state.selectedEntityType,
})
