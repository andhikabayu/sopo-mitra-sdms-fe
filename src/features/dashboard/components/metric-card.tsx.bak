'use client'

import React from 'react'
import clsx from 'clsx'

interface MetricCardProps {
  /** Card title/label */
  label: string
  /** Card value (displayed prominently) */
  value: string | number
  /** Unit suffix (e.g., "%", "K", "Pcs") */
  unit?: string
  /** Icon or emoji */
  icon?: React.ReactNode
  /** Background color class */
  className?: string
  /** Optional change/comparison value (e.g., "+5%" or "↑ 3%") */
  change?: { value: string; isPositive: boolean }
  /** Show loading state */
  isLoading?: boolean
}

/**
 * MetricCard Component
 *
 * Reusable card for displaying KPI metrics
 * - Supports icon, label, value, unit
 * - Optional change indicator
 * - Loading skeleton
 *
 * Usage:
 * ```tsx
 * <MetricCard
 *   label="Total Revenue"
 *   value="580,000"
 *   unit="IDR"
 *   icon="💰"
 *   change={{ value: "+12%", isPositive: true }}
 * />
 * ```
 */
export function MetricCard({
  label,
  value,
  unit,
  icon,
  className,
  change,
  isLoading,
}: MetricCardProps): React.ReactElement {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200 p-4',
        'hover:shadow-md transition-shadow',
        className,
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-sm font-medium text-gray-600">{unit}</span>}
      </div>

      {change && (
        <div
          className={clsx('text-xs font-medium', change.isPositive ? 'text-green-600' : 'text-red-600')}
        >
          {change.value}
        </div>
      )}
    </div>
  )
}
