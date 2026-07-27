'use client'

type Props = {
  value: string
  onChange: (v: string) => void
  /**
   * DOM id for the hidden input. Defaults to the original `website` so existing
   * callers are unaffected; override it when a second form (e.g. the site
   * assistant, which is mounted globally) can be on the page at the same time,
   * because two elements sharing an id break label association.
   */
  fieldId?: string
}

export default function HoneypotField({ value, onChange, fieldId = 'website' }: Props) {
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
      <label htmlFor={fieldId}>Website</label>
      <input
        id={fieldId}
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
