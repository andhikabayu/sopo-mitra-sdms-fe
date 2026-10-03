import type { MasterRole } from '@/types/role'

const MOCK_ROLES: MasterRole[] = [
  { id: 1, name: 'Super Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Store Inspector' },
  { id: 4, name: 'Sales' },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockRolesApi = {
  async list(): Promise<MasterRole[]> {
    await delay(150)
    return MOCK_ROLES
  },

  async getById(id: number): Promise<MasterRole> {
    await delay(100)
    const role = MOCK_ROLES.find((item) => item.id === id)
    if (!role) throw new Error('Role not found')
    return role
  },
}
