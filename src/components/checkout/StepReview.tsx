'use client'

import { PRICING } from '@/lib/config/pricing'
import { formatDualMoney, formatMoneyEUR } from '@/lib/money'
import type { CartItem } from '@/store/cart'
import Link from 'next/link'
import HoneypotField from './HoneypotField'
import type { DeliveryFields } from './StepDelivery'

type Props = {
  lang: 'bg' | 'en'
  items: CartItem[]
  delivery: DeliveryFields
  newsletterOptIn: boolean
  legalAccepted: boolean
  honeypot: string
  submitting: boolean
  onSetNewsletter: (v: boolean) => void
  onSetLegal: (v: boolean) => void
  onHoneypot: (v: string) => void
  onSubmit: () => void
  onBack: () => void
}

const T = {
  bg: {
    title: 'Преглед и изпращане',
    products: 'Продукти',
    delivery: 'Доставка',
    total: 'Общо',
    free: 'Безплатна',
    payment: 'Плащане',
    paymentValue: 'Наложен платеж',
    receipt: 'Фискален бон',
    receiptValue: 'Издава се от Speedy при доставка',
    timing: 'Очакван срок',
    timingValue: '2–4 работни дни след потвърждение',
    legalText1: 'Съгласявам се с',
    legalTerms: 'Общите условия',
    legalText2: 'и потвърждавам, че съм се запознал/а с',
    legalPrivacy: 'Политиката за поверителност',
    legalText3: '.',
    newsletterText: 'Искам да получавам имейли за новини, инициативи и специални предложения от ТЕПЕ bite.',
    submit: 'Изпрати поръчка',
    submitting: 'Изпращане...',
    back: 'Назад',
    deliveryLocker: 'Speedy автомат',
    deliveryOffice: 'Speedy офис',
    deliveryAddress: 'Доставка до адрес',
    legalNote: 'С изпращането потвърждавате, че сте прочели',
    deliveryTerms: 'Условия за доставка',
  },
  en: {
    title: 'Review & submit',
    products: 'Products',
    delivery: 'Delivery',
    total: 'Total',
    free: 'Free',
    payment: 'Payment',
    paymentValue: 'Cash on delivery',
    receipt: 'Fiscal receipt',
    receiptValue: 'Issued by Speedy upon delivery',
    timing: 'Expected',
    timingValue: '2–4 business days after confirmation',
    legalText1: 'I agree to the',
    legalTerms: 'Terms and Conditions',
    legalText2: 'and confirm I have read the',
    legalPrivacy: 'Privacy Policy',
    legalText3: '.',
    newsletterText: 'I want to receive emails about news, initiatives, and special offers from ТЕПЕ bite.',
    submit: 'Submit order',
    submitting: 'Sending...',
    back: 'Back',
    deliveryLocker: 'Speedy locker',
    deliveryOffice: 'Speedy office',
    deliveryAddress: 'Address delivery',
    legalNote: 'By submitting you confirm you have read our',
    deliveryTerms: 'Delivery terms',
  },
}

function deliveryDescription(delivery: DeliveryFields, lang: 'bg' | 'en'): string {
  const t = T[lang]
  if (delivery.method === 'speedy_locker') {
    return `${t.deliveryLocker}: ${delivery.lockerName}, ${delivery.lockerCity}`
  }
  if (delivery.method === 'speedy_office') {
    return `${t.deliveryOffice}: ${delivery.officeName}, ${delivery.officeCity}`
  }
  return `${t.deliveryAddress}: ${delivery.street}, ${delivery.city}`
}

export default function StepReview({
  lang,
  items,
  delivery,
  newsletterOptIn,
  legalAccepted,
  honeypot,
  submitting,
  onSetNewsletter,
  onSetLegal,
  onHoneypot,
  onSubmit,
  onBack,
}: Props) {
  const t = T[lang]

  const subtotalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0)
  const threshold = PRICING.FREE_DELIVERY_THRESHOLD_CENTS
  const freeBase = threshold > 0 && subtotalCents >= threshold
  const baseCents = PRICING.DELIVERY.BASE_LOCKER_CENTS

  const deliveryBaseCharged = freeBase ? 0 : baseCents
  const deliverySurcharge =
    delivery.method === 'speedy_office'
      ? PRICING.DELIVERY.OFFICE_SURCHARGE_CENTS
      : delivery.method === 'address'
      ? PRICING.DELIVERY.ADDRESS_SURCHARGE_CENTS
      : 0
  const totalDeliveryCents = deliveryBaseCharged + deliverySurcharge
  const totalCents = subtotalCents + totalDeliveryCents

  const checkboxStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    accentColor: 'var(--plum)',
    cursor: 'pointer',
    flexShrink: 0,
    marginTop: 2,
  }

  function handleSubmit() {
    if (!legalAccepted) return
    onSubmit()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--plum)' }}>
        {t.title}
      </div>

      {/* Order summary */}
      <div style={{
        background: 'var(--surface2)',
        borderRadius: 'var(--r-sm)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {/* Items */}
        {items.map((item) => (
          <div key={item.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-mid)' }}>
              {lang === 'bg' ? item.titleBg : item.titleEn}
              {item.quantity > 1 && <span style={{ color: 'var(--text-soft)' }}> ×{item.quantity}</span>}
            </span>
            <span style={{ fontWeight: 600 }}>{formatMoneyEUR(item.unitPriceCents * item.quantity)}</span>
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 0', fontSize: '0.88rem' }}>
          <span style={{ color: 'var(--text-mid)' }}>{t.products}</span>
          <span>{formatMoneyEUR(subtotalCents)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: '0.88rem' }}>
          <span style={{ color: 'var(--text-mid)' }}>{t.delivery}</span>
          <span>
            {totalDeliveryCents === 0 ? (
              <span style={{ color: 'oklch(40% 0.14 145)', fontWeight: 600, background: 'oklch(92% 0.08 145)', padding: '2px 10px', borderRadius: 99, fontSize: '0.82rem' }}>{t.free}</span>
            ) : (
              formatMoneyEUR(totalDeliveryCents)
            )}
            {freeBase && deliverySurcharge > 0 && (
              <span style={{ color: 'var(--text-soft)', fontSize: '0.79rem', marginLeft: 4 }}>(+{formatMoneyEUR(deliverySurcharge)} {lang === 'bg' ? 'надбавка' : 'surcharge'})</span>
            )}
          </span>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700, fontSize: '1.1rem', padding: '4px 0' }}>
          <span style={{ color: 'var(--text)' }}>{t.total}</span>
          <span style={{ color: 'var(--plum)' }}>{formatDualMoney(totalCents)}</span>
        </div>
      </div>

      {/* Delivery & payment info */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-sm)',
        overflow: 'hidden',
      }}>
        {[
          [t.delivery, deliveryDescription(delivery, lang)],
          [t.payment, t.paymentValue],
          [t.receipt, t.receiptValue],
          [t.timing, t.timingValue],
        ].map(([label, value], idx) => (
          <div
            key={label}
            style={{
              display: 'flex',
              gap: 12,
              fontSize: '0.87rem',
              padding: '10px 16px',
              borderBottom: idx < 3 ? '1px solid var(--border)' : 'none',
              background: idx % 2 === 0 ? 'transparent' : 'var(--surface2)',
            }}
          >
            <span style={{ color: 'var(--text-soft)', minWidth: 110, flexShrink: 0 }}>{label}</span>
            <span style={{ color: 'var(--text-mid)', fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Checkboxes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={legalAccepted}
            onChange={(e) => onSetLegal(e.target.checked)}
            style={checkboxStyle}
            required
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.55 }}>
            {t.legalText1}{' '}
            <Link href="/legal/terms" target="_blank" style={{ color: 'var(--caramel)', fontWeight: 600, textDecoration: 'underline' }}>{t.legalTerms}</Link>
            {' '}{t.legalText2}{' '}
            <Link href="/legal/privacy" target="_blank" style={{ color: 'var(--caramel)', fontWeight: 600, textDecoration: 'underline' }}>{t.legalPrivacy}</Link>
            {t.legalText3}
          </span>
        </label>

        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={newsletterOptIn}
            onChange={(e) => onSetNewsletter(e.target.checked)}
            style={checkboxStyle}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', lineHeight: 1.55 }}>
            {t.newsletterText}
          </span>
        </label>
      </div>

      <HoneypotField value={honeypot} onChange={onHoneypot} />

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onBack}
          disabled={submitting}
          style={{ flex: '0 0 auto' }}
        >
          {t.back}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!legalAccepted || submitting}
          style={{ flex: 1, justifyContent: 'center', opacity: legalAccepted && !submitting ? 1 : 0.45 }}
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </div>

      {/* Legal footer note */}
      <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)', textAlign: 'center', lineHeight: 1.5 }}>
        {t.legalNote}{' '}
        <Link href="/legal/delivery-payment" target="_blank" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
          {t.deliveryTerms}
        </Link>
      </div>
    </div>
  )
}
