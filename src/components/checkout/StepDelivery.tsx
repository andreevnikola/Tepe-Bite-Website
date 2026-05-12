'use client'

import { PRICING } from '@/lib/config/pricing'
import { formatMoneyEUR } from '@/lib/money'
import SpeedyLocationSelector from './SpeedyLocationSelector'

export type DeliveryFields =
  | {
      method: 'speedy_locker'
      lockerCode: string
      lockerName: string
      lockerAddress: string
      lockerCity: string
    }
  | {
      method: 'speedy_office'
      officeCode: string
      officeName: string
      officeAddress: string
      officeCity: string
    }
  | {
      method: 'address'
      city: string
      postalCode: string
      street: string
      building: string
      notes: string
    }

type Props = {
  lang: 'bg' | 'en'
  delivery: DeliveryFields
  subtotalCents: number
  onChange: (delivery: DeliveryFields) => void
  onNext: () => void
  onBack: () => void
}

const T = {
  bg: {
    title: 'Начин на доставка',
    lockerLabel: 'Speedy автомат',
    officeLabel: 'Speedy офис',
    addressLabel: 'Доставка до адрес',
    free: 'БЕЗПЛАТНО',
    lockerSublabel: 'Получи от удобен за теб автомат',
    officeSublabel: 'Получи от офис на Speedy',
    addressSublabel: 'Доставка до врата — цяла България',
    selectLocker: 'Избери автомат',
    selectOffice: 'Избери офис',
    cityLabel: 'Град',
    postalLabel: 'Пощенски код',
    streetLabel: 'Улица и номер',
    buildingLabel: 'Вход / Апартамент (по желание)',
    notesLabel: 'Допълнителни указания (по желание)',
    required: 'Задължително',
    next: 'Продължи към преглед →',
    back: 'Назад',
    noLockerSelected: 'Изберете автомат за да продължите',
    noOfficeSelected: 'Изберете офис за да продължите',
    cityPlaceholder: 'напр. Пловдив',
    streetPlaceholder: 'ул. Пример № 1',
    buildingPlaceholder: 'вх. А, ет. 3, ап. 12',
    notesPlaceholder: 'Звъни на вратата',
    surcharge: 'надбавка',
    deliveryPolicy: 'Безплатна доставка до Speedy автомат при поръчка над',
    deliveryPolicyLink: 'Виж условия',
  },
  en: {
    title: 'Delivery method',
    lockerLabel: 'Speedy locker',
    officeLabel: 'Speedy office',
    addressLabel: 'Address delivery',
    free: 'FREE',
    lockerSublabel: 'Pick up from a convenient locker',
    officeSublabel: 'Pick up from a Speedy office',
    addressSublabel: 'Door delivery — all of Bulgaria',
    selectLocker: 'Select locker',
    selectOffice: 'Select office',
    cityLabel: 'City',
    postalLabel: 'Postal code',
    streetLabel: 'Street and number',
    buildingLabel: 'Entrance / Apartment (optional)',
    notesLabel: 'Additional notes (optional)',
    required: 'Required',
    next: 'Continue to review →',
    back: 'Back',
    noLockerSelected: 'Please select a locker to continue',
    noOfficeSelected: 'Please select an office to continue',
    cityPlaceholder: 'e.g. Sofia',
    streetPlaceholder: '1 Example Street',
    buildingPlaceholder: 'Apt 12, Floor 3',
    notesPlaceholder: 'Ring the bell',
    surcharge: 'surcharge',
    deliveryPolicy: 'Free locker delivery on orders over',
    deliveryPolicyLink: 'See terms',
  },
}

export default function StepDelivery({
  lang,
  delivery,
  subtotalCents,
  onChange,
  onNext,
  onBack,
}: Props) {
  const t = T[lang]
  const threshold = PRICING.FREE_DELIVERY_THRESHOLD_CENTS
  const baseCents = PRICING.DELIVERY.BASE_LOCKER_CENTS
  const officeSurchargeCents = PRICING.DELIVERY.OFFICE_SURCHARGE_CENTS
  const addressSurchargeCents = PRICING.DELIVERY.ADDRESS_SURCHARGE_CENTS
  const freeBase = threshold > 0 && subtotalCents >= threshold

  // Total delivery cost per method
  const lockerTotal = freeBase ? 0 : baseCents
  const officeTotal = freeBase ? officeSurchargeCents : baseCents + officeSurchargeCents
  const addressTotal = freeBase ? addressSurchargeCents : baseCents + addressSurchargeCents

  function priceLabel(method: 'speedy_locker' | 'speedy_office' | 'address'): { text: string; isFree: boolean; isSurcharge: boolean } {
    if (method === 'speedy_locker') {
      if (lockerTotal === 0) return { text: t.free, isFree: true, isSurcharge: false }
      return { text: baseCents > 0 ? formatMoneyEUR(baseCents) : t.free, isFree: false, isSurcharge: false }
    }
    if (method === 'speedy_office') {
      if (freeBase) return { text: officeSurchargeCents > 0 ? `+${formatMoneyEUR(officeSurchargeCents)}` : t.free, isFree: officeSurchargeCents === 0, isSurcharge: true }
      return { text: officeTotal > 0 ? formatMoneyEUR(officeTotal) : t.free, isFree: false, isSurcharge: false }
    }
    // address
    if (freeBase) return { text: addressSurchargeCents > 0 ? `+${formatMoneyEUR(addressSurchargeCents)}` : t.free, isFree: addressSurchargeCents === 0, isSurcharge: true }
    return { text: addressTotal > 0 ? formatMoneyEUR(addressTotal) : t.free, isFree: false, isSurcharge: false }
  }

  function selectMethod(method: 'speedy_locker' | 'speedy_office' | 'address') {
    if (method === 'speedy_locker') {
      onChange({ method: 'speedy_locker', lockerCode: '', lockerName: '', lockerAddress: '', lockerCity: '' })
    } else if (method === 'speedy_office') {
      onChange({ method: 'speedy_office', officeCode: '', officeName: '', officeAddress: '', officeCity: '' })
    } else {
      onChange({ method: 'address', city: '', postalCode: '', street: '', building: '', notes: '' })
    }
  }

  function canContinue(): boolean {
    if (delivery.method === 'speedy_locker') return !!delivery.lockerCode
    if (delivery.method === 'speedy_office') return !!delivery.officeCode
    return !!delivery.city.trim() && !!delivery.street.trim()
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--r-sm)',
    border: '1.5px solid var(--border)',
    background: '#fff',
    fontSize: '1rem',
    color: 'var(--text)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    transition: 'border-color 0.15s',
  }

  const methods: Array<{ method: 'speedy_locker' | 'speedy_office' | 'address'; label: string; sublabel: string; icon: string }> = [
    { method: 'speedy_locker', label: t.lockerLabel, sublabel: t.lockerSublabel, icon: '🏧' },
    { method: 'speedy_office', label: t.officeLabel, sublabel: t.officeSublabel, icon: '🏢' },
    { method: 'address', label: t.addressLabel, sublabel: t.addressSublabel, icon: '🏠' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--plum)' }}>
        {t.title}
      </div>

      {/* Free delivery callout */}
      {threshold > 0 && (
        <div style={{
          background: freeBase ? 'oklch(94% 0.06 145)' : 'var(--surface2)',
          border: `1px solid ${freeBase ? 'oklch(80% 0.1 145)' : 'var(--border)'}`,
          borderRadius: 'var(--r-sm)',
          padding: '10px 16px',
          fontSize: '0.83rem',
          color: freeBase ? 'oklch(35% 0.14 145)' : 'var(--text-mid)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>{freeBase ? '✓' : '🚚'}</span>
          <span>
            {freeBase
              ? (lang === 'bg' ? 'Безплатна доставка до Speedy автомат включена!' : 'Free locker delivery included!')
              : <>{t.deliveryPolicy} {formatMoneyEUR(threshold)}. {' '}
                  <a href="/legal/delivery-payment" style={{ color: 'var(--caramel)', textDecoration: 'underline' }}>{t.deliveryPolicyLink}</a>
                </>
            }
          </span>
        </div>
      )}

      {/* Method selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {methods.map((m) => {
          const active = delivery.method === m.method
          const pl = priceLabel(m.method)
          return (
            <button
              key={m.method}
              type="button"
              onClick={() => selectMethod(m.method)}
              style={{
                textAlign: 'left',
                padding: '14px 18px',
                borderRadius: 'var(--r-sm)',
                border: active ? '2px solid var(--plum)' : '1.5px solid var(--border)',
                background: active ? 'var(--plum-lt)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: active ? 'var(--plum)' : 'var(--text)' }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: '0.79rem', color: 'var(--text-soft)', marginTop: 2 }}>
                      {m.sublabel}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: pl.isFree ? 'oklch(40% 0.14 145)' : pl.isSurcharge ? 'var(--text-mid)' : 'var(--caramel)',
                  whiteSpace: 'nowrap',
                  background: pl.isFree ? 'oklch(92% 0.08 145)' : 'transparent',
                  padding: pl.isFree ? '3px 10px' : '0',
                  borderRadius: pl.isFree ? 99 : 0,
                }}>
                  {pl.text}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Speedy locker selector */}
      {delivery.method === 'speedy_locker' && (
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 10 }}>
            {t.selectLocker}
          </div>
          <SpeedyLocationSelector
            lang={lang}
            type="locker"
            selectedCode={delivery.lockerCode}
            onSelect={(point) =>
              onChange({
                method: 'speedy_locker',
                lockerCode: point.code,
                lockerName: point.name,
                lockerAddress: point.address,
                lockerCity: point.city,
              })
            }
          />
        </div>
      )}

      {/* Speedy office selector */}
      {delivery.method === 'speedy_office' && (
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-mid)', marginBottom: 10 }}>
            {t.selectOffice}
          </div>
          <SpeedyLocationSelector
            lang={lang}
            type="office"
            selectedCode={delivery.officeCode}
            onSelect={(point) =>
              onChange({
                method: 'speedy_office',
                officeCode: point.code,
                officeName: point.name,
                officeAddress: point.address,
                officeCity: point.city,
              })
            }
          />
        </div>
      )}

      {/* Address form */}
      {delivery.method === 'address' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-mid)' }}>
              {t.cityLabel} <span style={{ color: 'oklch(55% 0.18 20)' }}>*</span>
            </label>
            <input
              value={delivery.city}
              onChange={(e) => onChange({ ...delivery, city: e.target.value })}
              placeholder={t.cityPlaceholder}
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-mid)' }}>
                {t.streetLabel} <span style={{ color: 'oklch(55% 0.18 20)' }}>*</span>
              </label>
              <input
                value={delivery.street}
                onChange={(e) => onChange({ ...delivery, street: e.target.value })}
                placeholder={t.streetPlaceholder}
                style={fieldStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 100 }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-mid)' }}>
                {t.postalLabel}
              </label>
              <input
                value={delivery.postalCode}
                onChange={(e) => onChange({ ...delivery, postalCode: e.target.value })}
                placeholder="4000"
                style={fieldStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-mid)' }}>
              {t.buildingLabel}
            </label>
            <input
              value={delivery.building}
              onChange={(e) => onChange({ ...delivery, building: e.target.value })}
              placeholder={t.buildingPlaceholder}
              style={fieldStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-mid)' }}>
              {t.notesLabel}
            </label>
            <textarea
              value={delivery.notes}
              onChange={(e) => onChange({ ...delivery, notes: e.target.value })}
              placeholder={t.notesPlaceholder}
              rows={2}
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onBack}
          style={{ flex: '0 0 auto' }}
        >
          {t.back}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canContinue()}
          style={{ flex: 1, justifyContent: 'center', opacity: canContinue() ? 1 : 0.45 }}
        >
          {t.next}
        </button>
      </div>
    </div>
  )
}
