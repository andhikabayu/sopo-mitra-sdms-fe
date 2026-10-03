'use client'

import React from 'react'
import clsx from 'clsx'

interface PerformanceRankProps {
  /** Rank number (1, 2, 3, etc) */
  rank: number
  /** Entity name (outlet name, sales name, etc) */
  name: string
  /** Metric value to display */
  value: string | number
  /** Metric label */
  metricLabel?: string
  /** Size variant */
  size?: 'sm' | 'md'
  /** Optional icon/badge */
  badge?: React.ReactNode
}

/**
 * PerformanceRank Component
 *
 * Displays a performance ranking with badge and metrics
 * - Shows rank number
 * - Shows entity name and metric
 * - Color-coded by rank (gold/silver/bronze for top 3)
 *
 * Usage:
 * ```tsx
 * <PerformanceRank
 *   rank={1}
 *   name="Outlet ABC"
 *   value="580,000"
 *   metricLabel="Revenue"
 * />
 * ```
 */
export function PerformanceRank({
  rank,
  name,
  value,
  metricLabel,
  size = 'md',
  badge,
}: PerformanceRankProps): React.ReactElement {
  // Determine rank color
  const getRankColor = (): string => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200'
      case 2:
        return 'bg-gray-50 border-gray-200'
      case 3:
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getRankBadgeColor = (): string => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400 text-yellow-900'
      case 2:
        return 'bg-gray-300 text-gray-800'
      case 3:
        return 'bg-orange-400 text-orange-900'
      default:
        return 'bg-blue-400 text-blue-900'
    }
  }

  const getRankEmoji = (): string => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return '▪'
    }
  }

  const isSm = size === 'sm'

  return (
    <div
      className={clsx(
        'rounded-lg border p-3',
        getRankColor(),
        'hover:shadow-sm transition-shadow',
      )}
    >
      <div className="flex items-start gap-3">
        {/* Rank badge */}
        <div
          className={clsx(
            'flex items-center justify-center font-bold rounded-full',
            isSm ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg',
            getRankBadgeColor(),
          )}
        >
          {getRankEmoji()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={clsx('font-semibold text-gray-900 truncate', isSm ? 'text-sm' : 'text-base')}>
            {name}
          </p>
          <p className={clsx('text-gray-600 mt-0.5', isSm ? 'text-xs' : 'text-sm')}>
            {metricLabel}: <span className="font-bold text-gray-900">{value}</span>
          </p>
        </div>

        {/* Optional badge */}
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
    </div>
  )
}
