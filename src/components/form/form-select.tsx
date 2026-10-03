import { forwardRef, type SelectHTMLAttributes } from 'react'
import { Label } from '@/components/ui/label'
import { Select, type SelectOption } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils/cn'

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  required?: boolean
  hint?: string
  options: SelectOption[]
  placeholder?: string
  isLoading?: boolean
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, required, hint, id, name, className, options, placeholder, isLoading, disabled, ...props }, ref) => {
    const fieldId = id ?? name

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <Label htmlFor={fieldId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative">
          <Select
            id={fieldId}
            name={name}
            ref={ref}
            hasError={Boolean(error)}
            options={options}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            disabled={disabled || isLoading}
            className={cn(isLoading && 'pr-10')}
            {...props}
          />
          {isLoading && (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <Spinner className="h-4 w-4 text-muted-foreground" />
            </span>
          )}
        </div>
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    )
  },
)
FormSelect.displayName = 'FormSelect'
