import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import { env } from '@/config/env'
import type { ApiEnvelope } from '@/types/api'
import type { BackendLoginResponse, LoginCredentials } from '../types/auth.types'
import { mockAuthApi } from './auth.mock'

interface UserProfile {
  id: number
  role?: string
  email?: string
  username?: string
  name?: string
}
const realAuthApi = {
  async login(credentials: LoginCredentials): Promise<BackendLoginResponse['data']> {
    const body = new URLSearchParams()
    body.append('username', credentials.username)
    body.append('password', credentials.password)

    const { data } = await apiClient.post<BackendLoginResponse>(API_ROUTES.auth.login, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return data.data
  },

  async getUserProfile(id: number): Promise<UserProfile> {
    const { data } = await apiClient.get<ApiEnvelope<UserProfile>>(API_ROUTES.users.byId(id))
    return data.data
  },
}

/**
 * Swap to the in-memory mock when NEXT_PUBLIC_ENABLE_MOCK_AUTH=true
 * (development without a backend). Production uses the real client.
 */
export const authApi = env.NEXT_PUBLIC_ENABLE_MOCK_AUTH ? mockAuthApi : realAuthApi
