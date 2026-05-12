'use client'

type Props = {
  currentStep: 1 | 2 | 3
  lang: 'bg' | 'en'
}

const STEPS = {
  bg: ['Данни', 'Доставка', 'Преглед'],
  en: ['Details', 'Delivery', 'Review'],
}

export default function CheckoutStepper({ currentStep, lang }: Props) {
  const labels = STEPS[lang]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        marginBottom: 32,
      }}
    >
      {labels.map((label, idx) => {
        const step = (idx + 1) as 1 | 2 | 3
        const active = step === currentStep
        const done = step < currentStep

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  background: active
                    ? 'var(--plum)'
                    : done
                    ? 'var(--caramel)'
                    : 'var(--surface2)',
                  color: active || done ? '#fff' : 'var(--text-soft)',
                  border: active ? '2px solid var(--plum)' : done ? '2px solid var(--caramel)' : '2px solid var(--border)',
                }}
              >
                {done ? '✓' : step}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--plum)' : done ? 'var(--caramel)' : 'var(--text-soft)',
                  letterSpacing: '0.04em',
                }}
              >
                {label}
              </span>
            </div>

            {idx < labels.length - 1 && (
              <div
                style={{
                  width: 48,
                  height: 2,
                  background: step < currentStep ? 'var(--caramel)' : 'var(--border)',
                  margin: '-18px 8px 0',
                  transition: 'background 0.2s',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
