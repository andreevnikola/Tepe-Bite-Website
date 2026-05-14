'use client'

import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'

const T = {
  bg: {
    eyebrow: 'Важно съобщение',
    title: 'Онлайн поръчките са временно недостъпни',
    body: 'В момента не приемаме поръчки през уебсайта. Можеш да се свържеш с нас на имейл или да намериш продуктите ни на партньорски локации в Пловдив.',
    email: 'Поръчай по имейл',
    locations: 'Партньорски локации',
  },
  en: {
    eyebrow: 'Important notice',
    title: 'Online orders are currently unavailable',
    body: "We're not accepting website orders at this time. You can reach us by email or find our products at partnering locations in Plovdiv.",
    email: 'Order by email',
    locations: 'Partnering locations',
  },
}

const webOrdersAvailable = process.env.NEXT_PUBLIC_WEB_ORDERS_AVAILABLE === 'true'

export default function PermanentOrdersOverlay() {
  const lang = useAtomValue(langAtom)
  const t = T[lang]

  if (webOrdersAvailable) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'oklch(32% 0.09 315 / 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl)',
          maxWidth: 520,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 24px 80px oklch(20% 0.08 315 / 0.4), 0 0 0 1px oklch(90% 0.02 315)',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: 4,
            background: 'linear-gradient(90deg, var(--plum) 0%, var(--caramel) 100%)',
          }}
        />

        {/* Header */}
        <div
          style={{
            background: 'var(--plum)',
            padding: '32px 36px 28px',
            textAlign: 'center',
          }}
        >
          {/* Icon circle */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'oklch(42% 0.09 315)',
              border: '2px solid oklch(50% 0.09 315)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '1.8rem',
            }}
          >
            🏪
          </div>

          <div
            className="label-tag"
            style={{
              color: 'var(--caramel)',
              marginBottom: 12,
            }}
          >
            {t.eyebrow}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              margin: 0,
              textWrap: 'balance',
            }}
          >
            {t.title}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 36px 36px' }}>
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.72,
              color: 'var(--text-mid)',
              marginBottom: 28,
              textAlign: 'center',
            }}
          >
            {t.body}
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <a
              href="mailto:tepe@mail.bg"
              className="btn btn-primary"
              style={{
                justifyContent: 'center',
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              ✉ {t.email}
            </a>

            <Link
              href="/partnering-locations"
              className="btn btn-caramel"
              style={{
                justifyContent: 'center',
                fontSize: '0.95rem',
              }}
            >
              📍 {t.locations}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
