import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names while resolving Tailwind conflicts
 * (later classes win). Used by every UI primitive in the design system.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
