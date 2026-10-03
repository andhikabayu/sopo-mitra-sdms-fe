interface CoverageAreaItem {
  id: number
  sales_area_id: number
  sub_district_id: number
  sales_area_name: string
  sub_district_name: string
  createdAt: string
  updatedAt: string
}

const sampleCoverageAreas: CoverageAreaItem[] = [
  {
    id: 1,
    sales_area_id: 1,
    sub_district_id: 1,
    sales_area_name: 'Jakarta Selatan',
    sub_district_name: 'Kebayoran Baru',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    sales_area_id: 1,
    sub_district_id: 2,
    sales_area_name: 'Jakarta Selatan',
    sub_district_name: 'Setiabudi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    sales_area_id: 2,
    sub_district_id: 3,
    sales_area_name: 'Jakarta Timur',
    sub_district_name: 'Pasar Rebo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockCoverageAreasApi = {
  async assign(body: { sales_area_id: number; sub_district_ids: number[] }) {
    return body.sub_district_ids.map((subDistrictId) => ({
      sales_area_id: body.sales_area_id,
      sub_district_id: subDistrictId,
    }))
  },

  async list(salesAreaId: number, params?: Record<string, unknown>) {
    return sampleCoverageAreas.filter((ca) => ca.sales_area_id === salesAreaId)
  },

  async unassign(salesAreaId: number, subDistrictId: number) {
    return { success: true }
  },
}

export default mockCoverageAreasApi
