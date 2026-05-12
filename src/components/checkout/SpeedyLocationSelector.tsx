'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

type PickupPoint = {
  code: string
  type: 'locker' | 'office'
  name: string
  address: string
  city: string
  workingTime?: string
  lat?: number
  lng?: number
}

type Props = {
  lang: 'bg' | 'en'
  type: 'locker' | 'office'
  selectedCode: string
  onSelect: (point: PickupPoint) => void
}

const SpeedyMap = dynamic(() => import('./SpeedyMap'), { ssr: false })

const T = {
  bg: {
    loading: 'Зареждане на точките за получаване...',
    error: 'Неуспешно зареждане на пунктовете.',
    unsupported: 'В момента онлайн доставката до Speedy автомат/офис е активна само за Пловдив. За друг град, моля свържете се с нас на tepe@mail.bg.',
    noPoints: 'Няма намерени пунктове.',
    select: 'Изберете пункт',
    workingTime: 'Работно време',
    selected: 'Избран',
  },
  en: {
    loading: 'Loading pickup points...',
    error: 'Failed to load pickup points.',
    unsupported: 'Online delivery to a Speedy locker/office is currently available only for Plovdiv. For another city, please contact us at tepe@mail.bg.',
    noPoints: 'No pickup points found.',
    select: 'Select a pickup point',
    workingTime: 'Working hours',
    selected: 'Selected',
  },
}

export default function SpeedyLocationSelector({ lang, type, selectedCode, onSelect }: Props) {
  const t = T[lang]
  const [points, setPoints] = useState<PickupPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const r = await fetch(`/api/courier/speedy-locations?city=Plovdiv&type=${type}`)
        const data = (await r.json()) as { error?: string; points?: PickupPoint[] }
        if (cancelled) return
        if (data.error) setError(t.error)
        else setPoints(data.points ?? [])
      } catch {
        if (!cancelled) setError(t.error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [type, t.error])

  const filtered = points.filter(
    (p) =>
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.address.toLowerCase().includes(searchFilter.toLowerCase()),
  )

  const mapPoints = points.filter((p) => p.lat && p.lng)

  if (loading) {
    return (
      <div style={{ padding: '24px 0', color: 'var(--text-soft)', fontSize: '0.9rem', textAlign: 'center' }}>
        {t.loading}
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ color: 'oklch(50% 0.15 20)', fontSize: '0.9rem', padding: '12px 0' }}>
        {error}
      </div>
    )
  }

  if (points.length === 0) {
    return (
      <div style={{ color: 'var(--text-soft)', fontSize: '0.9rem', padding: '12px 0' }}>
        {t.unsupported}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Map */}
      {mapPoints.length > 0 && (
        <div style={{ borderRadius: 'var(--r-sm)', overflow: 'hidden', border: '1px solid var(--border)', height: 240 }}>
          <SpeedyMap
            points={mapPoints}
            selectedCode={selectedCode}
            onSelect={(p) => {
              const full = points.find((pt) => pt.code === p.code)
              if (full) onSelect(full)
            }}
          />
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
        placeholder={lang === 'bg' ? 'Търси по адрес или наименование...' : 'Search by name or address...'}
        style={{
          padding: '10px 14px',
          borderRadius: 'var(--r-sm)',
          border: '1.5px solid var(--border)',
          fontSize: '0.9rem',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: 'var(--font-body)',
        }}
      />

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
        {filtered.map((point) => {
          const isSelected = point.code === selectedCode
          return (
            <button
              key={point.code}
              type="button"
              onClick={() => onSelect(point)}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: 'var(--r-sm)',
                border: isSelected ? '2px solid var(--plum)' : '1.5px solid var(--border)',
                background: isSelected ? 'var(--plum-lt)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 2 }}>
                    {point.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-soft)' }}>
                    {point.address}
                  </div>
                  {point.workingTime && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: 2 }}>
                      {t.workingTime}: {point.workingTime}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--plum)', whiteSpace: 'nowrap' }}>
                    ✓ {t.selected}
                  </div>
                )}
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ color: 'var(--text-soft)', fontSize: '0.9rem', padding: '12px 0' }}>
            {t.noPoints}
          </div>
        )}
      </div>
    </div>
  )
}
