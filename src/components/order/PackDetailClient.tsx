'use client'
import CartToast from '@/components/cart/CartToast'
import QuantitySelector from '@/components/order/QuantitySelector'
import { PRICING } from '@/lib/config/pricing'
import type { SafeProductPlan } from '@/lib/db/product-plans'
import { formatDualMoney, formatMoneyEUR } from '@/lib/money'
import { useAddToCart, useShowCartToast } from '@/store/cart'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  plan: SafeProductPlan
}

const T = {
  bg: {
    packLabel: 'Пакет',
    bars: 'барчета',
    pricePerPack: 'Цена за пакет',
    numPacks: 'Брой пакети',
    barsTotal: (n: number) => `${n} барчета общо`,
    addToCart: 'Добави в количката',
    orderNow: 'Поръчай сега',
    comingSoon: 'Очаквайте скоро',
    comingSoonDesc: 'Онлайн поръчките за този пакет ще бъдат достъпни скоро. Следи ни в социалните мрежи.',
    deliveryTitle: 'Доставка и плащане',
    deliveryLocker: 'Speedy автомат',
    deliveryLockerDesc: (price: string) => `Доставка до автомат ${price}`,
    deliveryLockerFree: 'Доставка до автомат — БЕЗПЛАТНА при тази поръчка',
    deliveryOffice: 'Speedy офис',
    deliveryOfficeDesc: (price: string) => `+${price} надбавка`,
    deliveryAddress: 'До адрес',
    deliveryAddressDesc: (price: string) => `+${price} надбавка`,
    paymentCOD: 'Наложен платеж',
    paymentCODDesc: 'Плащаш при получаване',
    freeDeliveryBadge: 'Безплатна доставка',
    freeDeliveryNote: (threshold: string) => `Безплатна доставка до Speedy автомат при поръчка над ${threshold}. Важи за тази поръчка.`,
    deliveryNote: (threshold: string) => `Безплатна доставка до Speedy автомат при поръчка над ${threshold}.`,
    deliveryLink: 'Виж условия',
    whyTitle: 'Какво прави ТЕПЕ bite различно',
    whyDesc: 'Всяко барче е направено с внимание в Пловдив — с качествени съставки и кауза. Частта от приходите подкрепя наши обществени инициативи.',
    whyLink: 'Научи повече за продукта',
    initiativesTitle: 'Всяко барче прави разлика',
    initiativesDesc: 'Купувайки ТЕПЕ bite, ти подкрепяш реални инициативи за обучение и изкуство в Пловдив.',
    initiativesLink: 'Виж нашите инициативи',
    legalProductInfo: 'Информация за продукта',
    legalDelivery: 'Доставка и плащане',
    legalReturns: 'Рекламации',
    productVisual: 'Визуализация на пакета',
  },
  en: {
    packLabel: 'Pack',
    bars: 'bars',
    pricePerPack: 'Price per pack',
    numPacks: 'Number of packs',
    barsTotal: (n: number) => `${n} bars total`,
    addToCart: 'Add to cart',
    orderNow: 'Order now',
    comingSoon: 'Coming soon',
    comingSoonDesc: 'Online ordering for this pack will be available soon. Follow us on social media.',
    deliveryTitle: 'Delivery & payment',
    deliveryLocker: 'Speedy locker',
    deliveryLockerDesc: (price: string) => `Locker delivery ${price}`,
    deliveryLockerFree: 'Locker delivery — FREE on this order',
    deliveryOffice: 'Speedy office',
    deliveryOfficeDesc: (price: string) => `+${price} surcharge`,
    deliveryAddress: 'To address',
    deliveryAddressDesc: (price: string) => `+${price} surcharge`,
    paymentCOD: 'Cash on delivery',
    paymentCODDesc: 'Pay when you receive the package',
    freeDeliveryBadge: 'Free delivery',
    freeDeliveryNote: (threshold: string) => `Free locker delivery on orders over ${threshold}. Applies to this order.`,
    deliveryNote: (threshold: string) => `Free locker delivery on orders over ${threshold}.`,
    deliveryLink: 'See terms',
    whyTitle: 'What makes ТЕПЕ bite different',
    whyDesc: 'Every bar is crafted with care in Plovdiv — quality ingredients with a cause. A portion of revenue supports our community initiatives.',
    whyLink: 'Learn more about the product',
    initiativesTitle: 'Every bar makes a difference',
    initiativesDesc: 'When you buy ТЕПЕ bite, you support real initiatives for education and art in Plovdiv.',
    initiativesLink: 'See our initiatives',
    legalProductInfo: 'Product information',
    legalDelivery: 'Delivery & payment',
    legalReturns: 'Returns',
    productVisual: 'Pack visual',
  },
}

export default function PackDetailClient({ plan }: Props) {
  const lang = useAtomValue(langAtom)
  const [qty, setQty] = useState(1)
  const addToCart = useAddToCart()
  const showToast = useShowCartToast()
  const router = useRouter()

  const isAvailable = plan.isActive && plan.priceCents > 0
  const title = lang === 'bg' ? plan.titleBg : plan.titleEn
  const description = lang === 'bg' ? plan.descriptionBg : plan.descriptionEn
  const t = T[lang]

  const threshold = PRICING.FREE_DELIVERY_THRESHOLD_CENTS
  const baseCents = PRICING.DELIVERY.BASE_LOCKER_CENTS
  const officeSurchargeCents = PRICING.DELIVERY.OFFICE_SURCHARGE_CENTS
  const addressSurchargeCents = PRICING.DELIVERY.ADDRESS_SURCHARGE_CENTS
  const orderSubtotal = plan.priceCents * qty
  const freeBase = threshold > 0 && orderSubtotal >= threshold

  const handleAddToCart = () => {
    if (!isAvailable) return
    addToCart({ slug: plan.slug, packSize: plan.packSize, titleBg: plan.titleBg, titleEn: plan.titleEn, quantity: qty, unitPriceCents: plan.priceCents, currency: plan.currency })
    showToast(plan.titleBg, plan.titleEn)
  }

  const handleOrderNow = () => {
    if (!isAvailable) return
    addToCart({ slug: plan.slug, packSize: plan.packSize, titleBg: plan.titleBg, titleEn: plan.titleEn, quantity: qty, unitPriceCents: plan.priceCents, currency: plan.currency })
    router.push('/cart')
  }

  // Free delivery applies at qty=1 for 20-bars and 35-bars (threshold=3000, prices 3800/6250)
  const qualifiesForFreeDelivery = threshold > 0 && plan.priceCents >= threshold

  return (
    <>
      {/* Hero: photo + CTA */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 56, alignItems: 'start', marginBottom: 64 }}
        className="pack-detail-grid"
      >
        {/* Left: bars visual + description */}
        <div>
          {/* Product photo hero */}
          <div
            style={{
              position: 'relative',
              height: 260,
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
              marginBottom: 36,
              background: 'var(--plum)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <Image
              src="/bar-product.png"
              alt={`ТЕПЕ bite — ${title}`}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 560px"
              style={{ objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.78 }}
            />
            {/* Gradient: dark at bottom-left, transparent at top-right */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, oklch(32% 0.09 315 / 0.82) 0%, oklch(32% 0.09 315 / 0.3) 55%, transparent 100%)' }} />
            {/* Pack count in bottom-left */}
            <div style={{ position: 'absolute', bottom: 24, left: 28 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, color: 'white', textShadow: '0 2px 16px oklch(10% 0.05 310 / 0.7)' }}>
                {plan.packSize}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                {t.bars}
              </div>
            </div>
          </div>

          <div className="label-tag" style={{ marginBottom: 10 }}>{t.packLabel}</div>
          <h1 className="heading-xl" style={{ marginBottom: 12 }}>{title}</h1>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: qualifiesForFreeDelivery ? 12 : 24 }}>
            <div style={{
              background: 'var(--plum)', color: 'white',
              borderRadius: 'var(--r-sm)', padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: '1.4rem' }}>{plan.packSize}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>{t.bars}</span>
            </div>
            {qualifiesForFreeDelivery && (
              <div style={{
                background: 'oklch(92% 0.1 145)', color: 'oklch(33% 0.14 145)',
                borderRadius: 'var(--r-sm)', padding: '8px 14px',
                fontSize: '0.8rem', fontWeight: 700,
                border: '1px solid oklch(80% 0.12 145)',
              }}>
                🚚 {t.freeDeliveryBadge}
              </div>
            )}
          </div>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-mid)', marginBottom: 0 }}>{description}</p>
        </div>

        {/* Right: price + CTA */}
        <div style={{ position: 'sticky', top: 100 }}>
          {isAvailable ? (
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}>
              {/* Price header */}
              <div style={{ background: 'var(--plum)', padding: '24px 28px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(75% 0.04 315)', marginBottom: 6 }}>
                  {t.pricePerPack}
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.2rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {formatDualMoney(plan.priceCents)}
                </div>
                {qualifiesForFreeDelivery && (
                  <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'oklch(92% 0.1 145)', color: 'oklch(33% 0.14 145)', borderRadius: 99, padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700 }}>
                    🚚 {t.freeDeliveryBadge}
                  </div>
                )}
              </div>

              {/* Quantity + CTA */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-soft)', marginBottom: 10 }}>
                    {t.numPacks}
                  </div>
                  <QuantitySelector value={qty} onChange={setQty} min={1} max={20} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: 8 }}>
                    {t.barsTotal(plan.packSize * qty)} · {formatMoneyEUR(plan.priceCents * qty)}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button onClick={handleOrderNow} className="btn btn-caramel" style={{ justifyContent: 'center' }}>
                    {t.orderNow}
                  </button>
                  <button onClick={handleAddToCart} className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: '0.9rem' }}>
                    {t.addToCart}
                  </button>
                </div>

                {/* Delivery mini-summary */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, fontSize: '0.8rem', color: 'var(--text-soft)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {freeBase ? (
                    <div style={{ color: 'oklch(38% 0.14 145)', fontWeight: 600 }}>✓ {t.deliveryLockerFree}</div>
                  ) : (
                    baseCents > 0 && (
                      <div>🚚 {t.deliveryLockerDesc(formatMoneyEUR(baseCents))}</div>
                    )
                  )}
                  <div>💳 {t.paymentCOD} — {t.paymentCODDesc}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--caramel-lt)', border: '1px solid oklch(84% 0.09 52)',
              borderRadius: 'var(--r-lg)', padding: '28px',
              boxShadow: 'var(--shadow)', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{t.comingSoon}</div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{t.comingSoonDesc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delivery & payment details */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--plum)', marginBottom: 16 }}>
          {t.deliveryTitle}
        </div>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
        }}>
          {[
            {
              icon: '🏧',
              label: t.deliveryLocker,
              desc: freeBase
                ? <span style={{ color: 'oklch(38% 0.14 145)', fontWeight: 600 }}>{lang === 'bg' ? 'БЕЗПЛАТНА' : 'FREE'}</span>
                : baseCents > 0 ? formatMoneyEUR(baseCents) : (lang === 'bg' ? 'Безплатна' : 'Free'),
            },
            {
              icon: '🏢',
              label: t.deliveryOffice,
              desc: officeSurchargeCents > 0 ? t.deliveryOfficeDesc(formatMoneyEUR(officeSurchargeCents)) : (lang === 'bg' ? 'Без надбавка' : 'No surcharge'),
            },
            {
              icon: '🏠',
              label: t.deliveryAddress,
              desc: addressSurchargeCents > 0 ? t.deliveryAddressDesc(formatMoneyEUR(addressSurchargeCents)) : (lang === 'bg' ? 'Без надбавка' : 'No surcharge'),
            },
            {
              icon: '💳',
              label: t.paymentCOD,
              desc: t.paymentCODDesc,
            },
          ].map((row, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 20px',
              borderBottom: idx < 3 ? '1px solid var(--border)' : 'none',
              fontSize: '0.88rem',
            }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{row.icon}</span>
              <span style={{ color: 'var(--text-mid)', fontWeight: 600, minWidth: 140, flexShrink: 0 }}>{row.label}</span>
              <span style={{ color: 'var(--text-soft)' }}>{row.desc}</span>
            </div>
          ))}
        </div>
        {threshold > 0 && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: 10, paddingLeft: 4 }}>
            {qualifiesForFreeDelivery
              ? t.freeDeliveryNote(formatMoneyEUR(threshold))
              : t.deliveryNote(formatMoneyEUR(threshold))
            }{' '}
            <Link href="/legal/delivery-payment" style={{ color: 'var(--caramel)', textDecoration: 'underline' }}>{t.deliveryLink}</Link>
          </div>
        )}
      </div>

      {/* Cross-sell: product + initiatives */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }} className="cross-sell-grid">
        <div style={{
          background: 'var(--plum)',
          borderRadius: 'var(--r-md)',
          padding: '28px 28px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{ fontSize: '1.4rem' }}>🍫</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700 }}>{t.whyTitle}</div>
          <p style={{ color: 'oklch(80% 0.03 315)', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{t.whyDesc}</p>
          <Link href="/#product" style={{ color: 'var(--caramel)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            {t.whyLink} →
          </Link>
        </div>
        <div style={{
          background: 'var(--caramel-lt)',
          border: '1px solid oklch(84% 0.09 52)',
          borderRadius: 'var(--r-md)',
          padding: '28px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{ fontSize: '1.4rem' }}>🌱</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--plum)' }}>{t.initiativesTitle}</div>
          <p style={{ color: 'var(--text-mid)', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{t.initiativesDesc}</p>
          <Link href="/#initiatives" style={{ color: 'var(--caramel)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            {t.initiativesLink} →
          </Link>
        </div>
      </div>

      {/* Legal links */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: '0.8rem' }}>
        {[
          { href: '/legal/product-info', label: t.legalProductInfo },
          { href: '/legal/delivery-payment', label: t.legalDelivery },
          { href: '/legal/returns-complaints', label: t.legalReturns },
        ].map((link) => (
          <Link key={link.href} href={link.href} style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
            {link.label}
          </Link>
        ))}
      </div>

      <CartToast />

      <style>{`
        @media (max-width: 900px) {
          .pack-detail-grid { grid-template-columns: 1fr !important; }
          .pack-detail-grid > div:last-child { position: static !important; }
          .cross-sell-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
