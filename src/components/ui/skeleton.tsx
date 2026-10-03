import { cn } from '@/lib/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'circle' | 'rectangle'
}

export function Skeleton({ className, variant = 'rectangle', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-700',
        {
          'h-4 w-full': variant === 'line',
          'h-10 w-10 rounded-full': variant === 'circle',
          'h-12 w-full rounded': variant === 'rectangle',
        },
        className,
      )}
      {...props}
    />
  )
}
