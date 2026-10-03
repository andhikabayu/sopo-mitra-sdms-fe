import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/cn'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
  hint?: string
  /** Optional adornment rendered on the right (e.g. password toggle). */
  endAdornment?: ReactNode
}

/**
 * RHF-friendly field: pass `register('field')` props plus `error`.
 * Pure presentational wrapper — no coupling to a specific form library.
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, hint, id, name, className, endAdornment, ...props }, ref) => {
    const fieldId = id ?? name

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <Label htmlFor={fieldId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative">
          <Input
            id={fieldId}
            name={name}
            ref={ref}
            hasError={Boolean(error)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={endAdornment ? 'pr-10' : undefined}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">{endAdornment}</div>
          )}
        </div>
        {error ? (
          <p id={`${fieldId}-error`} className="text-xs text-destructive">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    )
  },
)
FormInput.displayName = 'FormInput'
