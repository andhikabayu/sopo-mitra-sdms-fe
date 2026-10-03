'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'
import { useDashboardStore } from '../stores/dashboard.store'

interface DatePreset {
  label: string
  getDates: () => { from: string; to: string }
}

/**
 * DateRangeFilter Component
 *
 * Provides date range selection with presets:
 * - Last 7 days
 * - Last 30 days
 * - Last 90 days (default)
 * - Custom date range
 *
 * Connected to Zustand store for global state management
 *
 * Usage:
 * ```tsx
 * <DateRangeFilter />
 * ```
 */
export function DateRangeFilter(): React.ReactElement {
  const { dateFrom, dateTo, setDateRange, resetDateRange } = useDashboardStore()
  const [isOpen, setIsOpen] = useState(false)
  const [customFrom, setCustomFrom] = useState(dateFrom)
  const [customTo, setCustomTo] = useState(dateTo)

  const today = new Date()

  const presets: DatePreset[] = [
    {
      label: 'Last 7 days',
      getDates: () => {
        const from = new Date(today)
        from.setDate(from.getDate() - 7)
        return {
          from: from.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0],
        }
      },
    },
    {
      label: 'Last 30 days',
      getDates: () => {
        const from = new Date(today)
        from.setDate(from.getDate() - 30)
        return {
          from: from.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0],
        }
      },
    },
    {
      label: 'Last 90 days',
      getDates: () => {
        const from = new Date(today)
        from.setDate(from.getDate() - 90)
        return {
          from: from.toISOString().split('T')[0],
          to: today.toISOString().split('T')[0],
        }
      },
    },
  ]

  const handlePreset = (preset: DatePreset) => {
    const { from, to } = preset.getDates()
    setDateRange(from, to)
    setCustomFrom(from)
    setCustomTo(to)
    setIsOpen(false)
  }

  const handleCustom = () => {
    setDateRange(customFrom, customTo)
    setIsOpen(false)
  }

  const handleReset = () => {
    resetDateRange()
    setCustomFrom(dateFrom)
    setCustomTo(dateTo)
    setIsOpen(false)
  }

  // Format dates for display
  const fromDate = new Date(dateFrom)
  const toDate = new Date(dateTo)
  const displayText = `${format(fromDate, 'MMM d, yyyy')} - ${format(toDate, 'MMM d, yyyy')}`

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50',
          'flex items-center gap-2 transition-colors',
        )}
      >
        <span>📅</span>
        <span>{displayText}</span>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-300 bg-white shadow-lg z-50 p-4">
          {/* Presets */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Select</h3>
            <div className="space-y-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className={clsx(
                    'w-full px-3 py-2 text-sm text-left rounded hover:bg-blue-50',
                    'transition-colors',
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-4" />

          {/* Custom date range */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Custom Range</h3>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-600">From</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">To</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={handleCustom}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
