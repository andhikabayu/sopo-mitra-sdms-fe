import type { SalesAssignment } from './sales-assignments.api'

const sampleAssignments: SalesAssignment[] = [
  {
    id: 1,
    sales_id: 1,
    sales_area_id: 1,
    sales_name: 'Ahmad',
    sales_area_name: 'Jakarta Selatan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    sales_id: 1,
    sales_area_id: 2,
    sales_name: 'Ahmad',
    sales_area_name: 'Jakarta Timur',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    sales_id: 2,
    sales_area_id: 1,
    sales_name: 'Budi',
    sales_area_name: 'Jakarta Selatan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockSalesAssignmentsApi = {
  async assign(body: { sales_id: number; sales_area_ids: number[] }) {
    return body.sales_area_ids.map((areaId) => ({
      sales_id: body.sales_id,
      sales_area_id: areaId,
    }))
  },

  async list(params?: Record<string, unknown>) {
    return sampleAssignments
  },

  async listBySales(salesId: number, params?: Record<string, unknown>) {
    return sampleAssignments.filter((a) => a.sales_id === salesId)
  },

  async listByArea(salesAreaId: number, params?: Record<string, unknown>) {
    return sampleAssignments.filter((a) => a.sales_area_id === salesAreaId)
  },

  async unassign(salesId: number, salesAreaId: number) {
    return { success: true }
  },
}

export default mockSalesAssignmentsApi
