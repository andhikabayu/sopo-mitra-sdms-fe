/**
 * Global API contracts shared across all features.
 * The SDMS backend (FastAPI) wraps successful responses in an envelope
 * and reports errors via a `detail` field. See API_DOCS.md.
 */

/** Standard success envelope: { code, message, data }. */
export interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

/** Client-side pagination params (backend returns plain arrays). */
export interface PaginationParams {
  page: number
  perPage: number
}

/** Normalized error surfaced to hooks/UI (never a raw AxiosError). */
export interface ApiError {
  status: number
  message: string
  /** Field-level validation errors keyed by field name. */
  errors?: Record<string, string[]>
}
