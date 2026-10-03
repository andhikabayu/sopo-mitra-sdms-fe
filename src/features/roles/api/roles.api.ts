import { apiClient } from '@/lib/api/axios'
import { API_ROUTES } from '@/config/routes'
import { env } from '@/config/env'
import type { MasterRole } from '@/types/role'
import type { ApiEnvelope } from '@/types/api'
import { mockRolesApi } from './roles.mock'

const realRolesApi = {
  async list(): Promise<MasterRole[]> {
    const { data } = await apiClient.get<ApiEnvelope<MasterRole[]>>(API_ROUTES.roles.base)
    return data.data
  },

  async getById(id: number): Promise<MasterRole> {
    const { data } = await apiClient.get<ApiEnvelope<MasterRole>>(API_ROUTES.roles.byId(id))
    return data.data
  },
}

export const rolesApi = env.NEXT_PUBLIC_ENABLE_MOCK_AUTH ? mockRolesApi : realRolesApi
