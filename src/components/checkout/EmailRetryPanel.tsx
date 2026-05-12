'use client'

import { useState } from 'react'

type Props = {
  lang: 'bg' | 'en'
  publicOrderNumber: string
  emailRetryToken: string
}

const T = {
  bg: {
    title: 'Имейлът не беше изпратен',
    desc: 'Поръчката е приета и стоката е запазена, но потвърдителният имейл не беше изпратен.',
    retry: 'Изпрати имейла отново',
    sending: 'Изпращане...',
    success: 'Имейлът беше изпратен. Проверете пощата си.',
    failed: 'Изпращането отново не успя. Свържете се с нас на',
    expired: 'Времето изтече. Свържете се с нас на',
    order: 'Поръчка',
  },
  en: {
    title: 'Email was not sent',
    desc: 'Your order was received and stock reserved, but the confirmation email could not be sent.',
    retry: 'Resend confirmation email',
    sending: 'Sending...',
    success: 'Email sent. Please check your inbox.',
    failed: 'Email failed again. Please contact us at',
    expired: 'Retry window expired. Please contact us at',
    order: 'Order',
  },
}

export default function EmailRetryPanel({ lang, publicOrderNumber, emailRetryToken: initialToken }: Props) {
  const t = T[lang]
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'failed' | 'expired'>('idle')
  const isSending = state === 'sending'
  const [currentToken, setCurrentToken] = useState(initialToken)

  async function handleRetry() {
    setState('sending')
    try {
      const res = await fetch('/api/orders/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailRetryToken: currentToken }),
      })
      const data = await res.json()

      if (res.status === 410) {
        setState('expired')
      } else if (data.status === 'email_sent') {
        setState('success')
      } else if (data.status === 'email_failed_again') {
        if (data.emailRetryToken) setCurrentToken(data.emailRetryToken)
        setState('failed')
      } else {
        setState('failed')
      }
    } catch {
      setState('failed')
    }
  }

  return (
    <div
      style={{
        background: 'oklch(97% 0.015 60)',
        border: '1.5px solid oklch(85% 0.06 60)',
        borderRadius: 'var(--r-md)',
        padding: '28px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>📧</div>
      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--plum)', marginBottom: 8 }}>
        {t.title}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: 4 }}>
        {t.order}: <strong style={{ color: 'var(--text)' }}>{publicOrderNumber}</strong>
      </div>
      <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', marginBottom: 20 }}>{t.desc}</p>

      {state === 'success' && (
        <div style={{ color: 'oklch(45% 0.14 145)', fontWeight: 600, padding: '10px 0' }}>
          ✓ {t.success}
        </div>
      )}

      {state === 'expired' && (
        <div style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>
          {t.expired}{' '}
          <a href="mailto:tepe@mail.bg" style={{ color: 'var(--caramel)' }}>
            tepe@mail.bg
          </a>
        </div>
      )}

      {(state === 'idle' || state === 'failed') && (
        <>
          <button
            type="button"
            className="btn btn-caramel"
            onClick={handleRetry}
            disabled={isSending}
            style={{ width: '100%', justifyContent: 'center', marginBottom: state === 'failed' ? 12 : 0 }}
          >
            {isSending ? t.sending : t.retry}
          </button>

          {state === 'failed' && (
            <div style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginTop: 12 }}>
              {t.failed}{' '}
              <a href="mailto:tepe@mail.bg" style={{ color: 'var(--caramel)' }}>
                tepe@mail.bg
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
