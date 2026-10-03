import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env, isProxiedApiBaseUrl } from '@/config/env'
import { tokenStorage } from '@/lib/auth/token-storage'

/**
 * Shared Axios instance. UI/components must never import axios directly —
 * they go through feature `api/` modules which use this client.
 *
 * CORS: set NEXT_PUBLIC_API_BASE_URL=/api/app/v1 so requests stay same-origin
 * and are proxied server-side to API_BACKEND_URL (see app/api/app/v1/[...path]).
 */
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken()
  console.log('apiClient request interceptor: token', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Direct cross-origin calls to ngrok (legacy setup) need this header.
  if (
    !isProxiedApiBaseUrl() &&
    typeof config.baseURL === 'string' &&
    config.baseURL.includes('ngrok')
  ) {
    config.headers['ngrok-skip-browser-warning'] = 'true'
  }

  return config
})

/** Hook for the auth layer to react to a hard session expiry. */
let onSessionExpired: (() => void) | null = null
export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler
}

function isTokenExpiry(error: AxiosError): boolean {
  const status = error.response?.status
  if (status === 401) return true
  if (status === 403) {
    const detail = (error.response?.data as { detail?: string } | undefined)?.detail ?? ''
    return /validate credentials|expired/i.test(detail)
  }
  return false
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')

    if (!isLoginRequest && isTokenExpiry(error)) {
      tokenStorage.clear()
      onSessionExpired?.()
    }

    if (!error.response && error.message === 'Network Error' && !isProxiedApiBaseUrl()) {
      error.message =
        'Network/CORS error reaching the API. Set NEXT_PUBLIC_API_BASE_URL=/api/app/v1 and API_BACKEND_URL to your backend URL.'
    }

    return Promise.reject(error)
  },
)
