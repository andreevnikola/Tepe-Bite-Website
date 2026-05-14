'use client'

import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const SESSION_KEY = 'tepe_orders_notice_dismissed'

const T = {
  bg: {
    eyebrow: 'Важно съобщение',
    title: 'Онлайн поръчките са временно недостъпни',
    body: 'Все още не приемаме поръчки директно през уебсайта. Ако искаш да поръчаш, свържи се с нас по имейл или намери продуктите ни на партньорска локация в Пловдив.',
    email: 'Поръчай по имейл',
    locations: 'Партньорски локации',
    close: 'Разбрах, продължи разглеждането',
    infoBannerTitle: 'Онлайн поръчките не са налични',
    infoBannerBody: 'Поради тази причина някои функции на тази страница са неактивни. За да поръчаш, посети нашите',
    infoBannerLink: 'партньорски локации',
    infoBannerOr: 'или се свържи с нас на',
  },
  en: {
    eyebrow: 'Important notice',
    title: 'Online orders are currently unavailable',
    body: "We're not yet accepting orders directly through the website. To order, reach us by email or find our products at a partnering location in Plovdiv.",
    email: 'Order by email',
    locations: 'Partnering locations',
    close: 'Got it, continue browsing',
    infoBannerTitle: 'Online orders are unavailable',
    infoBannerBody: 'Some features on this page are therefore disabled. To order, visit our',
    infoBannerLink: 'partnering locations',
    infoBannerOr: 'or contact us at',
  },
}

const webOrdersAvailable = process.env.NEXT_PUBLIC_WEB_ORDERS_AVAILABLE === 'true'

export default function DismissibleOrdersGate() {
  const lang = useAtomValue(langAtom)
  const t = T[lang]

  // null = not yet read from storage (avoid hydration mismatch)
  const [dismissed, setDismissed] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(SESSION_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  if (webOrdersAvailable) return null
  if (dismissed === null) return null // wait for client hydration

  function handleDismiss() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // ignore
    }
    setDismissed(true)
  }

  if (dismissed) {
    return <InfoBanner t={t} />
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'oklch(32% 0.09 315 / 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
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
            position: 'relative',
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              height: 4,
              background: 'linear-gradient(90deg, var(--plum) 0%, var(--caramel) 100%)',
            }}
          />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="Затвори / Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'oklch(42% 0.09 315)',
              border: '1px solid oklch(50% 0.09 315)',
              color: 'oklch(80% 0.04 315)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              lineHeight: 1,
              zIndex: 1,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'oklch(52% 0.09 315)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'oklch(42% 0.09 315)'
            }}
          >
            ×
          </button>

          {/* Header */}
          <div
            style={{
              background: 'var(--plum)',
              padding: '32px 36px 28px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'oklch(42% 0.09 315)',
                border: '2px solid oklch(50% 0.09 315)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.6rem',
              }}
            >
              🏪
            </div>

            <div
              className="label-tag"
              style={{ color: 'var(--caramel)', marginBottom: 12 }}
            >
              {t.eyebrow}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 'clamp(1.15rem, 3vw, 1.5rem)',
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
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              {t.body}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href="mailto:tepe@mail.bg"
                className="btn btn-primary"
                style={{ justifyContent: 'center', fontSize: '0.93rem', textDecoration: 'none' }}
              >
                ✉ {t.email}
              </a>

              <Link
                href="/partnering-locations"
                className="btn btn-caramel"
                style={{ justifyContent: 'center', fontSize: '0.93rem' }}
              >
                📍 {t.locations}
              </Link>

              <button
                onClick={handleDismiss}
                className="btn btn-ghost"
                style={{ justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-soft)' }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function InfoBanner({ t }: { t: typeof T['bg'] }) {
  return (
    <div
      style={{
        background: 'oklch(97% 0.025 55)',
        border: '1.5px solid oklch(84% 0.09 55)',
        borderRadius: 'var(--r-md)',
        padding: '16px 20px',
        marginBottom: 28,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
      }}
    >
      {/* Icon */}
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'oklch(90% 0.1 55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          marginTop: 1,
        }}
      >
        ℹ️
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: 'oklch(42% 0.1 50)',
            marginBottom: 4,
          }}
        >
          {t.infoBannerTitle}
        </div>
        <p style={{ fontSize: '0.88rem', color: 'oklch(48% 0.08 50)', lineHeight: 1.6, margin: 0 }}>
          {t.infoBannerBody}{' '}
          <Link
            href="/partnering-locations"
            style={{
              color: 'var(--caramel)',
              fontWeight: 700,
              textDecoration: 'underline',
            }}
          >
            {t.infoBannerLink}
          </Link>{' '}
          {t.infoBannerOr}{' '}
          <a
            href="mailto:tepe@mail.bg"
            style={{ color: 'var(--caramel)', fontWeight: 700, textDecoration: 'underline' }}
          >
            tepe@mail.bg
          </a>
          .
        </p>
      </div>
    </div>
  )
}
