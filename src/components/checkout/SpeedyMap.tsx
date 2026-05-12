'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

// Fix default marker icon path for Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

type Point = {
  code: string
  type?: string
  name: string
  address: string
  city?: string
  lat?: number
  lng?: number
}

type RecenterProps = {
  selectedCode: string
  points: Point[]
}

function RecenterOnSelect({ selectedCode, points }: RecenterProps) {
  const map = useMap()
  useEffect(() => {
    const point = points.find((p) => p.code === selectedCode)
    if (point?.lat && point?.lng) {
      map.panTo([point.lat, point.lng])
    }
  }, [selectedCode, points, map])
  return null
}

type Props = {
  points: Point[]
  selectedCode: string
  onSelect: (point: Point) => void
}

export default function SpeedyMap({ points, selectedCode, onSelect }: Props) {
  const hasCoords = points.filter((p) => p.lat && p.lng)
  if (hasCoords.length === 0) return null

  const center: [number, number] = [
    hasCoords.reduce((s, p) => s + (p.lat ?? 0), 0) / hasCoords.length,
    hasCoords.reduce((s, p) => s + (p.lng ?? 0), 0) / hasCoords.length,
  ]

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterOnSelect selectedCode={selectedCode} points={hasCoords} />
      {hasCoords.map((point) => (
        <Marker
          key={point.code}
          position={[point.lat!, point.lng!]}
          icon={point.code === selectedCode ? selectedIcon : new L.Icon.Default()}
          eventHandlers={{ click: () => onSelect(point) }}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
