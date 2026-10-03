'use client'

import React, { useEffect, useState } from 'react'
import { FiChevronDown, FiFilter, FiSearch } from 'react-icons/fi'
import { useDashboardOutlets, useDashboardSales } from '../hooks/use-dashboard'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import clsx from 'clsx'

export interface OutletSalesFilterProps {
  selectedOutletId?: number | null
  selectedSalesId?: number | null
  onOutletChange?: (outletId: number | null) => void
  onSalesChange?: (salesId: number | null) => void
  showOutlet?: boolean
  showSales?: boolean
}

export function OutletSalesFilter({
  selectedOutletId = null,
  selectedSalesId = null,
  onOutletChange,
  onSalesChange,
  showOutlet = true,
  showSales = true,
}: OutletSalesFilterProps) {
  const [outletSearch, setOutletSearch] = useState('')
  const [salesSearch, setSalesSearch] = useState('')
  const [showOutletDropdown, setShowOutletDropdown] = useState(false)
  const [showSalesDropdown, setShowSalesDropdown] = useState(false)

  const { data: outlets, isLoading: outletsLoading } = useDashboardOutlets()
  const { data: salesList, isLoading: salesLoading } = useDashboardSales()

  // Filter outlets based on search
  const filteredOutlets = outlets?.outlets
    ?.filter((outlet) =>
      `${outlet.outlet_name || ''} (${outlet.outlet_id || ''})`.toLowerCase().includes(outletSearch.toLowerCase())
    )
    .slice(0, 10)

  // Filter sales based on search
  const filteredSales = salesList?.sales_people
    ?.filter((sales) =>
      `${sales.sales_name || ''} (${sales.sales_id || ''})`.toLowerCase().includes(salesSearch.toLowerCase())
    )
    .slice(0, 10)

  const selectedOutletName = outlets?.outlets?.find((o) => o.outlet_id === selectedOutletId)?.outlet_name
  const selectedSalesName = salesList?.sales_people?.find((s) => s.sales_id === selectedSalesId)?.sales_name

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <FiFilter className="h-4 w-4" />
        Filter Data
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Outlet Dropdown */}
        {showOutlet && (
          <div className="relative">
            <label className="mb-2 block text-sm font-medium">Outlet</label>
            <button
              onClick={() => {
                setShowOutletDropdown(!showOutletDropdown)
                setShowSalesDropdown(false)
              }}
              className={clsx(
                'w-full rounded-lg border px-3 py-2 text-left text-sm flex items-center justify-between',
                'bg-background hover:bg-muted/30 transition-colors',
                showOutletDropdown ? 'border-primary ring-1 ring-primary' : 'border-input'
              )}
            >
              <span className="truncate">
                {selectedOutletName ? `${selectedOutletName}` : 'Select Outlet...'}
              </span>
              <FiChevronDown className={clsx('h-4 w-4 transition-transform', showOutletDropdown && 'rotate-180')} />
            </button>

            {showOutletDropdown && (
              <div className="absolute right-0 top-full z-50 mt-1 w-full rounded-lg border border-input bg-background shadow-lg">
                <div className="sticky top-0 bg-background p-2 border-b">
                  <div className="relative">
                    <FiSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search outlet..."
                      value={outletSearch}
                      onChange={(e) => setOutletSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-muted/20 border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  {outletsLoading ? (
                    <div className="flex justify-center py-4">
                      <Spinner className="h-4 w-4" />
                    </div>
                  ) : filteredOutlets && filteredOutlets.length > 0 ? (
                    filteredOutlets.map((outlet) => (
                      <button
                        key={outlet.outlet_id}
                        onClick={() => {
                          onOutletChange?.(outlet.outlet_id)
                          setShowOutletDropdown(false)
                          setOutletSearch('')
                        }}
                        className={clsx(
                          'w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors',
                          selectedOutletId === outlet.outlet_id && 'bg-primary/10 text-primary font-medium'
                        )}
                      >
                        <div>{outlet.outlet_name}</div>
                        <div className="text-xs text-muted-foreground">ID: {outlet.outlet_id}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">No outlets found</div>
                  )}
                </div>

                {selectedOutletId && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onOutletChange?.(null)
                        setShowOutletDropdown(false)
                        setOutletSearch('')
                      }}
                      className="w-full text-xs"
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sales Dropdown */}
        {showSales && (
          <div className="relative">
            <label className="mb-2 block text-sm font-medium">Sales Person</label>
            <button
              onClick={() => {
                setShowSalesDropdown(!showSalesDropdown)
                setShowOutletDropdown(false)
              }}
              className={clsx(
                'w-full rounded-lg border px-3 py-2 text-left text-sm flex items-center justify-between',
                'bg-background hover:bg-muted/30 transition-colors',
                showSalesDropdown ? 'border-primary ring-1 ring-primary' : 'border-input'
              )}
            >
              <span className="truncate">
                {selectedSalesName ? `${selectedSalesName}` : 'Select Sales...'}
              </span>
              <FiChevronDown className={clsx('h-4 w-4 transition-transform', showSalesDropdown && 'rotate-180')} />
            </button>

            {showSalesDropdown && (
              <div className="absolute right-0 top-full z-50 mt-1 w-full rounded-lg border border-input bg-background shadow-lg">
                <div className="sticky top-0 bg-background p-2 border-b">
                  <div className="relative">
                    <FiSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search sales person..."
                      value={salesSearch}
                      onChange={(e) => setSalesSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-muted/20 border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  {salesLoading ? (
                    <div className="flex justify-center py-4">
                      <Spinner className="h-4 w-4" />
                    </div>
                  ) : filteredSales && filteredSales.length > 0 ? (
                    filteredSales.map((sales) => (
                      <button
                        key={sales.sales_id}
                        onClick={() => {
                          onSalesChange?.(sales.sales_id)
                          setShowSalesDropdown(false)
                          setSalesSearch('')
                        }}
                        className={clsx(
                          'w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors',
                          selectedSalesId === sales.sales_id && 'bg-primary/10 text-primary font-medium'
                        )}
                      >
                        <div>{sales.sales_name}</div>
                        <div className="text-xs text-muted-foreground">ID: {sales.sales_id}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">No sales found</div>
                  )}
                </div>

                {selectedSalesId && (
                  <div className="border-t p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onSalesChange?.(null)
                        setShowSalesDropdown(false)
                        setSalesSearch('')
                      }}
                      className="w-full text-xs"
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
