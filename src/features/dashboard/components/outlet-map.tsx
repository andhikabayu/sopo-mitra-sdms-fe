'use client'

import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format'
import type { DashboardPerformanceOutlet, MasterOutlet } from '../types/dashboard.types'
import {
  buildOutletMapMarkers,
  markerColor,
  type OutletMapMarker,
} from '../utils/outlet-map.utils'

// Webpack/Next.js does not bundle Leaflet default marker assets automatically.
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = defaultIcon

function createColoredIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<span style="
      display:block;
      width:14px;
      height:14px;
      margin-left:3px;
      margin-top:3px;
      background:${color};
      border:2px solid #fff;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
    "></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  })
}

function FitBounds({ markers }: { markers: OutletMapMarker[] }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length === 0) return
    const first = markers[0]
    if (!first) return
    if (markers.length === 1) {
      map.setView([first.lat, first.lng], 9)
      return
    }
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 9 })
  }, [map, markers])

  return null
}

interface OutletMapProps {
  masterOutlets: MasterOutlet[]
  performanceOutlets: DashboardPerformanceOutlet[]
}

// Center coordinates for the Jabodetabek area (Jakarta)
const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456]

export function OutletMap({ masterOutlets, performanceOutlets }: OutletMapProps) {
  const markers = useMemo(
    () => buildOutletMapMarkers(masterOutlets, performanceOutlets),
    [masterOutlets, performanceOutlets],
  )

  const firstMarker = markers[0]
  const center: [number, number] =
    firstMarker !== undefined ? [firstMarker.lat, firstMarker.lng] : DEFAULT_CENTER

  if (markers.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed bg-muted/20 text-sm text-muted-foreground">
        No outlets with valid latitude/longitude coordinates from GET /outlets.
      </div>
    )
  }

  return (
    <div className="relative z-0 isolate h-[420px] overflow-hidden rounded-lg border">
      <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createColoredIcon(markerColor(marker.sellThrough))}
          >
            <Popup>
              <div className="min-w-[200px] space-y-1 text-sm">
                <p className="font-semibold">{marker.name}</p>
                {marker.salesArea ? (
                  <p className="text-xs text-muted-foreground">{marker.salesArea}</p>
                ) : null}
                {marker.address ? <p className="text-xs">{marker.address}</p> : null}
                <hr className="my-2" />
                {marker.soldQty !== undefined ? (
                  <p>
                    <span className="text-muted-foreground">Sold Qty:</span>{' '}
                    {formatNumber(marker.soldQty)}
                  </p>
                ) : null}
                {marker.revenue !== undefined ? (
                  <p>
                    <span className="text-muted-foreground">Revenue:</span>{' '}
                    {formatCurrency(marker.revenue)}
                  </p>
                ) : null}
                {marker.sellThrough !== undefined ? (
                  <p>
                    <span className="text-muted-foreground">Sell Through:</span>{' '}
                    {formatPercent(marker.sellThrough)}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-md border bg-background/95 px-3 py-2 text-xs shadow-sm">
        <p className="mb-1 font-medium">Sell-through</p>
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> ≥70%
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> 40–69%
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> &lt;40%
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> No KPI
          </span>
        </div>
      </div>
    </div>
  )
}
