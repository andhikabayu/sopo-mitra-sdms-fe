import type {
  DashboardPerformanceOutlet,
  MasterOutlet,
} from '../types/dashboard.types'

export interface OutletMapMarker {
  id: number
  name: string
  salesArea?: string
  address?: string
  lat: number
  lng: number
  soldQty?: number
  revenue?: number
  sellThrough?: number
  status?: boolean
}

export function parseCoordinate(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value).trim())
  return Number.isFinite(num) ? num : null
}

export function buildOutletMapMarkers(
  masterOutlets: MasterOutlet[],
  performanceOutlets: DashboardPerformanceOutlet[],
): OutletMapMarker[] {
  const performanceById = new Map(performanceOutlets.map((item) => [item.outlet_id, item]))

  return masterOutlets.flatMap((outlet) => {
    const lat = parseCoordinate(outlet.latitude)
    const lng = parseCoordinate(outlet.longitude)
    if (lat === null || lng === null) return []

    const performance = performanceById.get(outlet.id)

    const marker: OutletMapMarker = {
      id: outlet.id,
      name: outlet.outlet_name,
      salesArea: outlet.sales_area ?? performance?.sales_area,
      address: outlet.address,
      lat,
      lng,
      soldQty: performance?.sold_qty,
      revenue: performance?.revenue,
      sellThrough: performance?.sell_through,
      status: outlet.status,
    }

    return [marker]
  })
}

export function markerColor(sellThrough?: number): string {
  if (sellThrough === undefined) return '#2563eb'
  if (sellThrough >= 70) return '#16a34a'
  if (sellThrough >= 40) return '#d97706'
  return '#dc2626'
}
