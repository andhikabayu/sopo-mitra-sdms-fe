import type { NextRequest } from 'next/server'

const DEFAULT_BACKEND = 'http://localhost:8000/api/app/v1'

export function getApiBackendUrl(): string {
  return (process.env.API_BACKEND_URL ?? DEFAULT_BACKEND).replace(/\/$/, '')
}

export function isNgrokBackend(url: string = getApiBackendUrl()): boolean {
  return url.includes('ngrok')
}

/** Headers forwarded from the browser to the backend API. */
const FORWARDED_REQUEST_HEADERS = [
  'authorization',
  'content-type',
  'accept',
  'accept-language',
] as const

/** Build outbound proxy headers for the backend request. */
export function buildProxyRequestHeaders(request: NextRequest): Headers {
  const headers = new Headers()

  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name)
    if (value) {
      // don't forward obviously-broken token values
      if (name === 'authorization') {
        const lower = value.toLowerCase()
        if (lower.includes('undefined') || lower.includes('null')) continue
      }
      headers.set(name, value)
    }
  }

  if (isNgrokBackend()) {
    headers.set('ngrok-skip-browser-warning', 'true')
  }

  return headers
}

export function buildBackendUrl(pathSegments: string[], search: string): string {
  const backend = getApiBackendUrl()
  const path = pathSegments.filter(Boolean).join('/')
  return `${backend}/${path}${search}`
}
