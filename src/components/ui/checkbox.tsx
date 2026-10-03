import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const fieldId = id ?? props.name
    return (
      <label className="inline-flex cursor-pointer items-center gap-2">
        <input
          ref={ref}
          id={fieldId}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-1',
            className,
          )}
          {...props}
        />
        {label && <span className="text-sm">{label}</span>}
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'
