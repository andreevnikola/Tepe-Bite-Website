'use client'

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function HoneypotField({ value, onChange }: Props) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        opacity: 0,
        pointerEvents: 'none',
        width: 0,
        height: 0,
        overflow: 'hidden',
      }}
    >
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  )
}
