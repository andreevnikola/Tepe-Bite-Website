'use client'

import { PRICING } from '@/lib/config/pricing'
import { formatDualMoney, formatMoneyEUR } from '@/lib/money'
import type { CartItem } from '@/store/cart'
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
    title: 'Преглед и потвърждение',
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
    legalText: 'Съгласявам се с Общите условия и потвърждавам, че се запознах с Политиката за поверителност.',
    newsletterText: 'Искам да получавам имейли за новини, инициативи и специални предложения от ТЕПЕ bite.',
    submit: 'Изпрати имейл за потвърждение',
    submitting: 'Изпращане...',
    legalRequired: 'Необходимо е да се съгласите с условията',
    back: 'Назад',
    deliveryLocker: 'Speedy автомат',
    deliveryOffice: 'Speedy офис',
    deliveryAddress: 'Доставка до адрес',
  },
  en: {
    title: 'Review & confirm',
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
    legalText: 'I agree to the Terms and Conditions and confirm that I have read the Privacy Policy.',
    newsletterText: 'I want to receive emails about news, initiatives, and special offers from ТЕПЕ bite.',
    submit: 'Send confirmation email',
    submitting: 'Sending...',
    legalRequired: 'You must agree to the terms to continue',
    back: 'Back',
    deliveryLocker: 'Speedy locker',
    deliveryOffice: 'Speedy office',
    deliveryAddress: 'Address delivery',
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
  return `${t.deliveryAddress}: ${delivery.city}`
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
  let deliverySurcharge = 0
  if (delivery.method === 'speedy_office') {
    deliverySurcharge = PRICING.DELIVERY.OFFICE_SURCHARGE_CENTS
  } else if (delivery.method === 'address') {
    deliverySurcharge = PRICING.DELIVERY.ADDRESS_SURCHARGE_CENTS
  }
  const totalDeliveryCents = deliveryBaseCharged + deliverySurcharge
  const totalCents = subtotalCents + totalDeliveryCents

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '6px 0',
    fontSize: '0.9rem',
  }

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
      <div
        style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--plum)' }}
      >
        {t.title}
      </div>

      {/* Order summary */}
      <div
        style={{
          background: 'var(--surface2)',
          borderRadius: 'var(--r-sm)',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Items */}
        {items.map((item) => (
          <div key={item.slug} style={rowStyle}>
            <span style={{ color: 'var(--text-mid)' }}>
              {lang === 'bg' ? item.titleBg : item.titleEn}
              {item.quantity > 1 && (
                <span style={{ color: 'var(--text-soft)' }}> ×{item.quantity}</span>
              )}
            </span>
            <span style={{ fontWeight: 600 }}>
              {formatMoneyEUR(item.unitPriceCents * item.quantity)}
            </span>
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />

        <div style={rowStyle}>
          <span style={{ color: 'var(--text-mid)' }}>{t.products}</span>
          <span>{formatMoneyEUR(subtotalCents)}</span>
        </div>

        <div style={rowStyle}>
          <span style={{ color: 'var(--text-mid)' }}>{t.delivery}</span>
          <span>
            {totalDeliveryCents === 0 ? (
              <span style={{ color: 'oklch(45% 0.14 145)', fontWeight: 600 }}>{t.free}</span>
            ) : (
              formatMoneyEUR(totalDeliveryCents)
            )}
            {freeBase && deliverySurcharge > 0 && (
              <span style={{ color: 'var(--text-soft)', fontSize: '0.8rem', marginLeft: 4 }}>
                (+{formatMoneyEUR(deliverySurcharge)})
              </span>
            )}
          </span>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />

        <div style={{ ...rowStyle, fontWeight: 700, fontSize: '1.05rem' }}>
          <span style={{ color: 'var(--text)' }}>{t.total}</span>
          <span style={{ color: 'var(--plum)' }}>{formatDualMoney(totalCents)}</span>
        </div>
      </div>

      {/* Delivery & payment info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          [t.delivery, deliveryDescription(delivery, lang)],
          [t.payment, t.paymentValue],
          [t.receipt, t.receiptValue],
          [t.timing, t.timingValue],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', gap: 12, fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-soft)', minWidth: 120, flexShrink: 0 }}>{label}</span>
            <span style={{ color: 'var(--text-mid)' }}>{value}</span>
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
          <span style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>
            {t.legalText}
          </span>
        </label>

        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={newsletterOptIn}
            onChange={(e) => onSetNewsletter(e.target.checked)}
            style={checkboxStyle}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>
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
          style={{ flex: 1, justifyContent: 'center', opacity: legalAccepted && !submitting ? 1 : 0.5 }}
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </div>
    </div>
  )
}
