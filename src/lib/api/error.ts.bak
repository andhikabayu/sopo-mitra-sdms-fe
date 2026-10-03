import { AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

/**
 * Convert any thrown value (AxiosError, Error, unknown) into the
 * normalized {@link ApiError} shape consumed by hooks and UI.
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const response = error.response
    const data = response?.data as
      | { detail?: string | { msg?: string }[]; message?: string; errors?: Record<string, string[]> }
      | undefined

    // FastAPI uses `detail` for errors (string, or an array for 422 validation).
    let detailMessage: string | undefined
    if (typeof data?.detail === 'string') {
      detailMessage = data.detail
    } else if (Array.isArray(data?.detail)) {
      detailMessage = data.detail.map((d) => d?.msg).filter(Boolean).join(', ') || undefined
    }

    return {
      status: response?.status ?? 0,
      message:
        detailMessage ??
        data?.message ??
        (response ? 'Request failed. Please try again.' : 'Network error. Check your connection.'),
      errors: data?.errors,
    }
  }

  if (error instanceof Error) {
    return { status: 0, message: error.message }
  }

  return { status: 0, message: 'An unexpected error occurred.' }
}
