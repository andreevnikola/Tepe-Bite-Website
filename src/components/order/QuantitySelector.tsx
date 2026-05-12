'use client'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'

type Props = {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: Props) {
  const lang = useAtomValue(langAtom)

  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 100, overflow: 'hidden', background: 'var(--surface)' }}
      role="group"
      aria-label={lang === 'bg' ? 'Количество' : 'Quantity'}
    >
      <button
        onClick={dec}
        disabled={value <= min}
        aria-label={lang === 'bg' ? 'Намали' : 'Decrease'}
        style={{
          width: 40,
          height: 40,
          border: 'none',
          background: 'none',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          color: value <= min ? 'var(--text-soft)' : 'var(--plum)',
          fontSize: '1.2rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (value > min) e.currentTarget.style.background = 'var(--surface2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
      >
        −
      </button>
      <span
        aria-live="polite"
        style={{
          minWidth: 36,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--text)',
          userSelect: 'none',
        }}
      >
        {value}
      </span>
      <button
        onClick={inc}
        disabled={value >= max}
        aria-label={lang === 'bg' ? 'Увеличи' : 'Increase'}
        style={{
          width: 40,
          height: 40,
          border: 'none',
          background: 'none',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          color: value >= max ? 'var(--text-soft)' : 'var(--plum)',
          fontSize: '1.2rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (value < max) e.currentTarget.style.background = 'var(--surface2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
      >
        +
      </button>
    </div>
  )
}
