'use client'

import CheckoutStepper from '@/components/checkout/CheckoutStepper'
import EmailRetryPanel from '@/components/checkout/EmailRetryPanel'
import InsufficientStockError from '@/components/checkout/InsufficientStockError'
import StepCustomerInfo, { type CustomerInfoFields } from '@/components/checkout/StepCustomerInfo'
import StepDelivery, { type DeliveryFields } from '@/components/checkout/StepDelivery'
import StepReview from '@/components/checkout/StepReview'
import Footer from '@/components/Footer'
import PermanentOrdersOverlay from '@/components/orders/PermanentOrdersOverlay'
import { useCart, useCartSubtotalCents, useClearCart } from '@/store/cart'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'

type CheckoutStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'check_email'; publicOrderNumber: string; customerEmail: string }
  | { kind: 'email_failed'; publicOrderNumber: string; customerEmail: string; emailRetryToken: string }
  | { kind: 'insufficient_stock'; message: string }
  | { kind: 'error'; message: string }

const T = {
  bg: {
    title: 'Поръчка',
    emptyCart: 'Количката е празна',
    emptyCartDesc: 'Разгледай нашите пакети и добави любимия си.',
    goShopping: 'Виж пакетите',
    // check_email screen
    checkEmailBadge: 'Поръчката е запазена',
    checkEmailTitle: 'Потвърди имейла си',
    checkEmailOrder: 'Поръчка №',
    checkEmailActionHeader: 'Следваща стъпка — провери пощата',
    checkEmailSentTo: 'Изпратихме линк за потвърждение до:',
    checkEmailCta: 'Кликни линка в имейла, за да активираш поръчката за обработка.',
    checkEmailPending: 'Поръчката НЕ е изпратена за обработка, докато не бъде потвърдена.',
    checkEmailSpam: 'Не виждаш имейла? Провери папката Спам или Нежелана поща.',
    checkEmailExpiry: 'Линкът е валиден 24 часа.',
    checkEmailContact: 'Въпроси? Пиши ни на',
    backToHome: 'Обратно към начало',
  },
  en: {
    title: 'Checkout',
    emptyCart: 'Your cart is empty',
    emptyCartDesc: 'Browse our packs and add your favourite.',
    goShopping: 'View packs',
    // check_email screen
    checkEmailBadge: 'Order saved',
    checkEmailTitle: 'Confirm your email',
    checkEmailOrder: 'Order #',
    checkEmailActionHeader: 'Next step — check your inbox',
    checkEmailSentTo: 'We sent a confirmation link to:',
    checkEmailCta: 'Click the link in the email to activate your order for processing.',
    checkEmailPending: 'Your order will NOT be processed until you confirm it.',
    checkEmailSpam: 'Can\'t find the email? Check your Spam or Junk folder.',
    checkEmailExpiry: 'The link is valid for 24 hours.',
    checkEmailContact: 'Questions? Write to us at',
    backToHome: 'Back to home',
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
  const clearCart = useClearCart()

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
        clearCart()
        setStatus({ kind: 'check_email', publicOrderNumber: data.publicOrderNumber, customerEmail: data.customerEmail ?? '' })
      } else if (data.status === 'email_failed') {
        clearCart()
        setStatus({
          kind: 'email_failed',
          publicOrderNumber: data.publicOrderNumber,
          customerEmail: data.customerEmail ?? '',
          emailRetryToken: data.emailRetryToken,
        })
      } else if (data.status === 'pending') {
        // Honeypot triggered — show check_email silently
        clearCart()
        setStatus({
          kind: 'check_email',
          publicOrderNumber: 'TEPE-' + Math.floor(Math.random() * 9000 + 1000),
          customerEmail: customerInfo.email,
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
    paddingTop: 88,
    paddingBottom: 64,
  }

  const innerStyle: React.CSSProperties = {
    maxWidth: 680,
    margin: '0 auto',
    padding: '0 clamp(16px, 5vw, 32px)',
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)',
    borderRadius: 'var(--r-lg)',
    padding: 'clamp(24px, 5vw, 36px)',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)',
  }

  // Empty cart
  if (items.length === 0 && status.kind === 'idle') {
    return (
      <Fragment>
        <PermanentOrdersOverlay />
        <main style={containerStyle}>
          <div style={innerStyle}>
            <div style={{ ...cardStyle, textAlign: 'center', padding: '56px 32px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--surface2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', margin: '0 auto 24px',
              }}>🛒</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.6rem', color: 'var(--plum)', marginBottom: 12 }}>
                {t.emptyCart}
              </div>
              <p style={{ color: 'var(--text-soft)', marginBottom: 28, fontSize: '0.95rem' }}>{t.emptyCartDesc}</p>
              <Link href="/order" className="btn btn-caramel" style={{ fontSize: '0.95rem' }}>
                {t.goShopping}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </Fragment>
    )
  }

  // Success — check email
  if (status.kind === 'check_email') {
    return (
      <Fragment>
      <PermanentOrdersOverlay />
      <main style={{ ...containerStyle, background: `radial-gradient(ellipse 70% 50% at 50% 0%, oklch(88% 0.05 315 / 0.18), transparent), var(--bg)` }}>
        <div style={innerStyle}>
          <div style={{ ...cardStyle, padding: '0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'var(--plum)', padding: '32px 36px 28px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'oklch(55% 0.15 145)', borderRadius: 99,
                padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', color: 'white',
                marginBottom: 18,
              }}>
                ✓ {t.checkEmailBadge}
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.65rem', fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.01em' }}>
                {t.checkEmailTitle}
              </div>
              <div style={{
                display: 'inline-block',
                background: 'oklch(42% 0.09 315)', borderRadius: 'var(--r-sm)',
                padding: '6px 16px', fontSize: '0.82rem', fontWeight: 700,
                letterSpacing: '0.08em', color: 'oklch(85% 0.04 315)',
              }}>
                {t.checkEmailOrder}{status.publicOrderNumber}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 36px 32px' }}>
              {/* Action box */}
              <div style={{
                background: 'oklch(96% 0.02 250)',
                border: '1.5px solid oklch(82% 0.06 250)',
                borderRadius: 'var(--r-sm)',
                padding: '18px 20px',
                marginBottom: 20,
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'oklch(35% 0.1 260)', marginBottom: 10 }}>
                  📧 {t.checkEmailActionHeader}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)', marginBottom: 8 }}>
                  {t.checkEmailSentTo}
                </div>
                {status.customerEmail && (
                  <div style={{
                    background: 'white', borderRadius: 'var(--r-sm)',
                    padding: '7px 14px', fontWeight: 700,
                    color: 'var(--plum)', fontSize: '0.95rem',
                    wordBreak: 'break-all', marginBottom: 12,
                    border: '1px solid var(--border)',
                  }}>
                    {status.customerEmail}
                  </div>
                )}
                <div style={{ fontSize: '0.88rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>
                  {t.checkEmailCta}
                </div>
              </div>

              {/* Warning: not processed until confirmed */}
              <div style={{
                background: 'oklch(97% 0.025 55)',
                border: '1px solid oklch(85% 0.07 55)',
                borderRadius: 'var(--r-sm)',
                padding: '12px 16px',
                marginBottom: 20,
                fontSize: '0.84rem',
                color: 'oklch(42% 0.1 50)',
                fontWeight: 600,
              }}>
                ⚠️ {t.checkEmailPending}
              </div>

              {/* Hints */}
              <div style={{ fontSize: '0.82rem', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span>• {t.checkEmailSpam}</span>
                <span>• {t.checkEmailExpiry}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                <Link href="/" className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
                  {t.backToHome}
                </Link>
                <p style={{ fontSize: '0.79rem', color: 'var(--text-soft)', margin: 0, textAlign: 'center' }}>
                  {t.checkEmailContact}{' '}
                  <a href="mailto:tepe@mail.bg" style={{ color: 'var(--caramel)', fontWeight: 600 }}>tepe@mail.bg</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      </Fragment>
    )
  }

  // Email failed — retry panel
  if (status.kind === 'email_failed') {
    return (
      <Fragment>
        <PermanentOrdersOverlay />
        <main style={containerStyle}>
          <div style={innerStyle}>
            <EmailRetryPanel
              lang={lang}
              publicOrderNumber={status.publicOrderNumber}
              customerEmail={status.customerEmail}
              emailRetryToken={status.emailRetryToken}
            />
          </div>
        </main>
        <Footer />
      </Fragment>
    )
  }

  // Insufficient stock
  if (status.kind === 'insufficient_stock') {
    return (
      <Fragment>
        <PermanentOrdersOverlay />
        <main style={containerStyle}>
          <div style={innerStyle}>
            <InsufficientStockError lang={lang} message={status.message} />
          </div>
        </main>
        <Footer />
      </Fragment>
    )
  }

  return (
    <Fragment>
    <PermanentOrdersOverlay />
    <main style={containerStyle}>
      <div style={innerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/cart" style={{ fontSize: '0.82rem', color: 'var(--text-soft)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
            ← {lang === 'bg' ? 'Обратно към количката' : 'Back to cart'}
          </Link>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--plum)', marginBottom: 0 }}>
            {t.title}
          </h1>
        </div>

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
    <Footer />
    </Fragment>
  )
}
