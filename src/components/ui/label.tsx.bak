import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-sm font-medium text-foreground', className)}
        {...props}
      >
        {children}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
    )
  },
)
Label.displayName = 'Label'
