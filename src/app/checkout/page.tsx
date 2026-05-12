'use client'

import CheckoutStepper from '@/components/checkout/CheckoutStepper'
import EmailRetryPanel from '@/components/checkout/EmailRetryPanel'
import InsufficientStockError from '@/components/checkout/InsufficientStockError'
import StepCustomerInfo, { type CustomerInfoFields } from '@/components/checkout/StepCustomerInfo'
import StepDelivery, { type DeliveryFields } from '@/components/checkout/StepDelivery'
import StepReview from '@/components/checkout/StepReview'
import { useCart, useCartSubtotalCents } from '@/store/cart'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type CheckoutStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'check_email'; publicOrderNumber: string }
  | { kind: 'email_failed'; publicOrderNumber: string; emailRetryToken: string }
  | { kind: 'insufficient_stock'; message: string }
  | { kind: 'error'; message: string }

const T = {
  bg: {
    title: 'Поръчка',
    emptyCart: 'Количката е празна',
    goShopping: 'Разгледай продуктите',
    checkEmailTitle: 'Провери имейла си',
    checkEmailDesc: 'Изпратихме потвърдителен имейл.',
    checkEmailOrder: 'Поръчка',
    checkEmailNote: 'Натисни линка в имейла, за да потвърдиш поръчката и да я пуснем в обработка.',
  },
  en: {
    title: 'Checkout',
    emptyCart: 'Your cart is empty',
    goShopping: 'Browse products',
    checkEmailTitle: 'Check your email',
    checkEmailDesc: 'We sent you a confirmation email.',
    checkEmailOrder: 'Order',
    checkEmailNote: 'Click the link in the email to confirm your order and start processing.',
  },
}

function generateCheckoutId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function CheckoutPage() {
  const lang = useAtomValue(langAtom)
  const t = T[lang]
  const items = useCart()
  const subtotalCents = useCartSubtotalCents()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [status, setStatus] = useState<CheckoutStatus>({ kind: 'idle' })

  const [customerInfo, setCustomerInfo] = useState<CustomerInfoFields>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const [delivery, setDelivery] = useState<DeliveryFields>({
    method: 'speedy_locker',
    lockerCode: '',
    lockerName: '',
    lockerAddress: '',
    lockerCity: 'Plovdiv',
  })

  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const [legalAccepted, setLegalAccepted] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  // Idempotency key — generated once per checkout, rotated when cart changes
  const checkoutIdRef = useRef<string | null>(null)
  const cartSnapshotRef = useRef<string>('')

  useEffect(() => {
    const cartKey = JSON.stringify(items.map((i) => ({ slug: i.slug, qty: i.quantity })).sort())
    if (cartSnapshotRef.current !== cartKey) {
      // Cart changed — rotate idempotency key
      const newId = generateCheckoutId()
      try {
        sessionStorage.setItem('tepe_checkout_id', newId)
        sessionStorage.setItem('tepe_checkout_id_created', new Date().toISOString())
      } catch {
        // sessionStorage unavailable
      }
      checkoutIdRef.current = newId
      cartSnapshotRef.current = cartKey
    } else if (!checkoutIdRef.current) {
      // First load — reuse existing or generate
      try {
        const existing = sessionStorage.getItem('tepe_checkout_id')
        if (existing) {
          checkoutIdRef.current = existing
        } else {
          const newId = generateCheckoutId()
          sessionStorage.setItem('tepe_checkout_id', newId)
          sessionStorage.setItem('tepe_checkout_id_created', new Date().toISOString())
          checkoutIdRef.current = newId
        }
      } catch {
        checkoutIdRef.current = generateCheckoutId()
      }
      cartSnapshotRef.current = cartKey
    }
  }, [items])

  async function handleSubmit() {
    setStatus({ kind: 'submitting' })

    const checkoutId = checkoutIdRef.current ?? generateCheckoutId()
    let checkoutCreatedAt: string | undefined
    try {
      checkoutCreatedAt = sessionStorage.getItem('tepe_checkout_id_created') ?? undefined
    } catch {
      // ignore
    }

    let deliveryPayload: Record<string, unknown>
    if (delivery.method === 'speedy_locker') {
      deliveryPayload = {
        method: 'speedy_locker',
        lockerCode: delivery.lockerCode,
        lockerName: delivery.lockerName,
        lockerAddress: delivery.lockerAddress,
        lockerCity: delivery.lockerCity,
      }
    } else if (delivery.method === 'speedy_office') {
      deliveryPayload = {
        method: 'speedy_office',
        officeCode: delivery.officeCode,
        officeName: delivery.officeName,
        officeAddress: delivery.officeAddress,
        officeCity: delivery.officeCity,
      }
    } else {
      deliveryPayload = {
        method: 'address',
        city: delivery.city,
        postalCode: delivery.postalCode,
        street: delivery.street,
        building: delivery.building,
        notes: delivery.notes,
      }
    }

    const payload = {
      website: honeypot,
      clientCheckoutId: checkoutId,
      clientCheckoutCreatedAt: checkoutCreatedAt,
      language: lang,
      firstName: customerInfo.firstName.trim(),
      lastName: customerInfo.lastName.trim(),
      email: customerInfo.email.trim(),
      phone: customerInfo.phone.trim(),
      cartItems: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
      delivery: deliveryPayload,
      newsletterOptIn,
      legalAccepted: true,
    }

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.status === 409 && data.error === 'checkout_changed') {
        // Rotate idempotency key and try again next submit
        const newId = generateCheckoutId()
        try {
          sessionStorage.setItem('tepe_checkout_id', newId)
          sessionStorage.setItem('tepe_checkout_id_created', new Date().toISOString())
        } catch {
          // ignore
        }
        checkoutIdRef.current = newId
        setStatus({ kind: 'error', message: lang === 'bg' ? 'Моля, опитайте отново.' : 'Please try again.' })
        return
      }

      if (res.status === 409 && data.error === 'insufficient_stock') {
        setStatus({ kind: 'insufficient_stock', message: data.message ?? '' })
        return
      }

      if (!res.ok) {
        const msg =
          data.error ??
          (lang === 'bg'
            ? 'Възникна грешка. Моля, опитайте отново.'
            : 'An error occurred. Please try again.')
        setStatus({ kind: 'error', message: msg })
        return
      }

      if (data.status === 'check_email') {
        setStatus({ kind: 'check_email', publicOrderNumber: data.publicOrderNumber })
      } else if (data.status === 'email_failed') {
        setStatus({
          kind: 'email_failed',
          publicOrderNumber: data.publicOrderNumber,
          emailRetryToken: data.emailRetryToken,
        })
      } else if (data.status === 'pending') {
        // Honeypot triggered — show check_email silently
        setStatus({
          kind: 'check_email',
          publicOrderNumber: 'TEPE-' + Math.floor(Math.random() * 9000 + 1000),
        })
      } else {
        setStatus({ kind: 'error', message: lang === 'bg' ? 'Неизвестна грешка.' : 'Unknown error.' })
      }
    } catch {
      setStatus({
        kind: 'error',
        message: lang === 'bg' ? 'Мрежова грешка. Моля, опитайте отново.' : 'Network error. Please try again.',
      })
    }
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'var(--bg)',
    paddingTop: 80,
    paddingBottom: 64,
  }

  const innerStyle: React.CSSProperties = {
    maxWidth: 680,
    margin: '0 auto',
    padding: '0 16px',
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)',
    borderRadius: 'var(--r-lg)',
    padding: '32px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)',
  }

  // Empty cart
  if (items.length === 0 && status.kind === 'idle') {
    return (
      <main style={containerStyle}>
        <div style={innerStyle}>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🛒</div>
            <div
              style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', color: 'var(--plum)', marginBottom: 16 }}
            >
              {t.emptyCart}
            </div>
            <Link href="/order" className="btn btn-primary">
              {t.goShopping}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Success — check email
  if (status.kind === 'check_email') {
    return (
      <main style={containerStyle}>
        <div style={innerStyle}>
          <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>📬</div>
            <div
              style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', color: 'var(--plum)', marginBottom: 8 }}
            >
              {t.checkEmailTitle}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: 8 }}>
              {t.checkEmailOrder}: <strong style={{ color: 'var(--text)' }}>{status.publicOrderNumber}</strong>
            </div>
            <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 0 }}>
              {t.checkEmailNote}
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Email failed — retry panel
  if (status.kind === 'email_failed') {
    return (
      <main style={containerStyle}>
        <div style={innerStyle}>
          <EmailRetryPanel
            lang={lang}
            publicOrderNumber={status.publicOrderNumber}
            emailRetryToken={status.emailRetryToken}
          />
        </div>
      </main>
    )
  }

  // Insufficient stock
  if (status.kind === 'insufficient_stock') {
    return (
      <main style={containerStyle}>
        <div style={innerStyle}>
          <InsufficientStockError lang={lang} message={status.message} />
        </div>
      </main>
    )
  }

  return (
    <main style={containerStyle}>
      <div style={innerStyle}>
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--plum)',
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          {t.title}
        </h1>

        <CheckoutStepper currentStep={step} lang={lang} />

        <div style={cardStyle}>
          {status.kind === 'error' && (
            <div
              style={{
                background: 'oklch(97% 0.02 20)',
                border: '1px solid oklch(80% 0.08 20)',
                borderRadius: 'var(--r-sm)',
                padding: '12px 16px',
                color: 'oklch(40% 0.1 20)',
                fontSize: '0.9rem',
                marginBottom: 20,
              }}
            >
              {status.message}
            </div>
          )}

          {step === 1 && (
            <StepCustomerInfo
              lang={lang}
              values={customerInfo}
              onChange={(fields) => setCustomerInfo((prev) => ({ ...prev, ...fields }))}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepDelivery
              lang={lang}
              delivery={delivery}
              subtotalCents={subtotalCents}
              onChange={setDelivery}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <StepReview
              lang={lang}
              items={items}
              delivery={delivery}
              newsletterOptIn={newsletterOptIn}
              legalAccepted={legalAccepted}
              honeypot={honeypot}
              submitting={status.kind === 'submitting'}
              onSetNewsletter={setNewsletterOptIn}
              onSetLegal={setLegalAccepted}
              onHoneypot={setHoneypot}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      </div>
    </main>
  )
}
