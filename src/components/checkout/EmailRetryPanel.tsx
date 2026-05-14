'use client'

import { Fragment, useState } from 'react'

type Props = {
  lang: 'bg' | 'en'
  publicOrderNumber: string
  customerEmail: string
  emailRetryToken: string
}

const T = {
  bg: {
    title: 'Потвърждението не беше изпратено',
    orderLabel: 'Поръчка №',
    pendingWarning: 'Поръчката НЕ е изпратена за обработка — трябва първо да се потвърди.',
    desc: 'Опитайте да изпратим имейла отново. Ако не успее, пишете ни директно с номера на поръчката.',
    retryBtn: 'Изпрати потвърждение отново',
    sending: 'Изпращане...',
    retrySuccess: 'Изпратено! Провери пощата и кликни линка, за да активираш поръчката.',
    failedAgain: 'Не успяхме да изпратим имейла. Пишете ни на',
    failedSuffix: (orderNum: string) => ` с номер на поръчката ${orderNum} и ще я потвърдим ръчно.`,
    expired: 'Срокът за повторно изпращане изтече. Пишете ни на',
    expiredSuffix: (orderNum: string) => ` с номер на поръчката ${orderNum}.`,
    backToHome: 'Обратно към начало',
  },
  en: {
    title: 'Confirmation email not sent',
    orderLabel: 'Order #',
    pendingWarning: 'Your order is NOT being processed — it must be confirmed first.',
    desc: 'We can try sending the email again. If it keeps failing, write to us directly with your order number.',
    retryBtn: 'Resend confirmation email',
    sending: 'Sending...',
    retrySuccess: 'Sent! Check your inbox and click the link to activate your order.',
    failedAgain: 'Failed to send. Please write to us at',
    failedSuffix: (orderNum: string) => ` with order number ${orderNum} and we will confirm it manually.`,
    expired: 'Resend window expired. Please write to us at',
    expiredSuffix: (orderNum: string) => ` with order number ${orderNum}.`,
    backToHome: 'Back to home',
  },
}

export default function EmailRetryPanel({ lang, publicOrderNumber, customerEmail, emailRetryToken: initialToken }: Props) {
  const t = T[lang]
  const [retryState, setRetryState] = useState<'idle' | 'sending' | 'success' | 'failed' | 'expired'>('idle')
  const [currentToken, setCurrentToken] = useState(initialToken)

  async function handleRetry() {
    setRetryState('sending')
    try {
      const res = await fetch('/api/orders/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailRetryToken: currentToken }),
      })
      const data = await res.json()

      if (res.status === 410) {
        setRetryState('expired')
      } else if (data.status === 'email_sent') {
        setRetryState('success')
      } else if (data.status === 'email_failed_again') {
        if (data.emailRetryToken) setCurrentToken(data.emailRetryToken)
        setRetryState('failed')
      } else {
        setRetryState('failed')
      }
    } catch {
      setRetryState('failed')
    }
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
    }}>
      {/* Header */}
      <div style={{ background: 'var(--plum)', padding: '28px 32px' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 10 }}>
          {t.title}
        </div>
        <div style={{
          display: 'inline-block', background: 'oklch(42% 0.09 315)',
          borderRadius: 'var(--r-sm)', padding: '5px 14px',
          fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.07em',
          color: 'oklch(85% 0.04 315)',
        }}>
          {t.orderLabel}{publicOrderNumber}
        </div>
      </div>

      {/* Warning */}
      <div style={{
        background: 'oklch(97% 0.025 55)',
        borderBottom: '1px solid oklch(88% 0.06 55)',
        padding: '12px 24px',
        fontSize: '0.85rem',
        color: 'oklch(38% 0.1 50)',
        fontWeight: 600,
      }}>
        ⚠️ {t.pendingWarning}
      </div>

      {/* Body */}
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', margin: 0, lineHeight: 1.65 }}>
          {t.desc}
        </p>

        {retryState === 'success' ? (
          <div style={{
            background: 'oklch(95% 0.06 145)', border: '1px solid oklch(80% 0.1 145)',
            borderRadius: 'var(--r-sm)', padding: '14px 18px',
            fontSize: '0.9rem', color: 'oklch(32% 0.14 145)', fontWeight: 600,
          }}>
            ✓ {t.retrySuccess}
          </div>
        ) : (retryState === 'failed' || retryState === 'expired') ? (
          <div style={{
            background: 'var(--surface2)', borderRadius: 'var(--r-sm)',
            padding: '14px 18px', fontSize: '0.88rem', color: 'var(--text-mid)', lineHeight: 1.65,
          }}>
            {retryState === 'expired' ? t.expired : t.failedAgain}{' '}
            <a href="mailto:tepe@mail.bg" style={{ color: 'var(--caramel)', fontWeight: 700 }}>tepe@mail.bg</a>
            {retryState === 'expired' ? t.expiredSuffix(publicOrderNumber) : t.failedSuffix(publicOrderNumber)}
          </div>
        ) : (
          <Fragment>
            <button
              type="button"
              className="btn btn-caramel"
              onClick={handleRetry}
              disabled={retryState === 'sending'}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {retryState === 'sending' ? t.sending : t.retryBtn}
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', margin: 0, textAlign: 'center' }}>
              {lang === 'bg' ? 'Въпроси? ' : 'Questions? '}
              <a href="mailto:tepe@mail.bg" style={{ color: 'var(--caramel)', fontWeight: 600 }}>tepe@mail.bg</a>
            </p>
          </Fragment>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '0.82rem', color: 'var(--text-soft)', textDecoration: 'underline' }}>
            ← {t.backToHome}
          </a>
        </div>
      </div>
    </div>
  )
}
