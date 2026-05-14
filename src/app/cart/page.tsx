'use client'

import Footer from '@/components/Footer'
import { Fragment } from 'react'
import QuantitySelector from '@/components/order/QuantitySelector'
import { PRICING } from '@/lib/config/pricing'
import { formatDualMoney, formatMoneyEUR } from '@/lib/money'
import {
  useCart,
  useCartSubtotalCents,
  useClearCart,
  useRemoveFromCart,
  useUpdateQuantity,
} from '@/store/cart'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'

const T = {
  bg: {
    label: 'Количка',
    title: 'Твоята количка',
    clearAll: 'Изчисти',
    emptyTitle: 'Количката е празна',
    emptyDesc: 'Разгледай нашите пакети и добави любимия си.',
    browsePacks: 'Виж пакетите',
    barsPerPack: 'барчета в пакет',
    unitPrice: 'Ед. цена',
    remove: 'Премахни',
    freeDeliveryReached: '✓ Безплатна доставка до Speedy автомат',
    freeDeliveryProgress: (rem: string, thr: string) => `Остават ${rem} до безплатна доставка (над ${thr})`,
    deliveryNote: 'Научи повече',
    subtotal: 'Сума',
    toCheckout: 'Продължи към поръчка →',
    keepShopping: 'Продължи с пазаруването',
    orderSummaryTitle: 'Резюме',
    delivery: 'Доставка',
    deliveryFree: 'Безплатна (автомат)',
    deliveryPaid: (p: string) => `от ${p}`,
    total: 'Общо',
  },
  en: {
    label: 'Cart',
    title: 'Your cart',
    clearAll: 'Clear all',
    emptyTitle: 'Your cart is empty',
    emptyDesc: 'Browse our packs and add your favourite.',
    browsePacks: 'View packs',
    barsPerPack: 'bars per pack',
    unitPrice: 'Unit price',
    remove: 'Remove',
    freeDeliveryReached: '✓ Free locker delivery',
    freeDeliveryProgress: (rem: string, thr: string) => `${rem} away from free delivery (over ${thr})`,
    deliveryNote: 'Learn more',
    subtotal: 'Subtotal',
    toCheckout: 'Proceed to checkout →',
    keepShopping: 'Continue shopping',
    orderSummaryTitle: 'Summary',
    delivery: 'Delivery',
    deliveryFree: 'Free (locker)',
    deliveryPaid: (p: string) => `from ${p}`,
    total: 'Est. total',
  },
}

export default function CartPage() {
  const lang = useAtomValue(langAtom)
  const t = T[lang]
  const items = useCart()
  const subtotalCents = useCartSubtotalCents()
  const removeFromCart = useRemoveFromCart()
  const updateQuantity = useUpdateQuantity()
  const clearCart = useClearCart()

  const threshold = PRICING.FREE_DELIVERY_THRESHOLD_CENTS
  const baseCents = PRICING.DELIVERY.BASE_LOCKER_CENTS
  const showProgress = threshold > 0
  const progress = showProgress ? Math.min((subtotalCents / threshold) * 100, 100) : 0
  const remaining = showProgress ? Math.max(threshold - subtotalCents, 0) : 0
  const freeDelivery = showProgress && subtotalCents >= threshold

  // Empty state
  if (items.length === 0) {
    return (
      <Fragment>
        <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 100, paddingBottom: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 24px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 24px' }}>🛒</div>
            <h1 className="heading-lg" style={{ marginBottom: 12 }}>{t.emptyTitle}</h1>
            <p style={{ marginBottom: 28 }}>{t.emptyDesc}</p>
            <Link href="/order" className="btn btn-caramel" style={{ fontSize: '1rem' }}>{t.browsePacks}</Link>
          </div>
        </main>
        <Footer />
      </Fragment>
    )
  }

  return (
    <Fragment>
    <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 100, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="label-tag" style={{ marginBottom: 8 }}>{t.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h1 className="heading-lg">{t.title}</h1>
            <button onClick={clearCart} className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '8px 18px' }}>
              {t.clearAll}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }} className="cart-grid">
          {/* Left: items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item) => {
              const itemTitle = lang === 'bg' ? item.titleBg : item.titleEn
              const lineTotal = item.unitPriceCents * item.quantity

              return (
                <div
                  key={item.slug}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-md)',
                    padding: '20px 24px',
                    display: 'flex',
                    gap: 20,
                    alignItems: 'flex-start',
                  }}
                  className="cart-item"
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 3 }}>{itemTitle}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: 10 }}>
                      {item.packSize} {t.barsPerPack}
                      {item.unitPriceCents > 0 && (
                        <Fragment> · {t.unitPrice}: {formatMoneyEUR(item.unitPriceCents)}</Fragment>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity({ slug: item.slug, quantity: q })}
                        min={1}
                        max={20}
                      />
                      <button
                        onClick={() => removeFromCart(item.slug)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-soft)', textDecoration: 'underline', padding: 0 }}
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>

                  {item.unitPriceCents > 0 && (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--plum)' }}>
                        {formatMoneyEUR(lineTotal)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: 2 }}>
                        {(lineTotal / 100 * PRICING.EUR_TO_BGN).toFixed(2)} лв.
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Free delivery progress */}
            {showProgress && (
              <div style={{
                background: freeDelivery ? 'oklch(95% 0.06 145)' : 'var(--surface)',
                border: `1px solid ${freeDelivery ? 'oklch(82% 0.1 145)' : 'var(--border)'}`,
                borderRadius: 'var(--r-md)',
                padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 8, gap: 8 }}>
                  <span style={{ color: freeDelivery ? 'oklch(38% 0.14 145)' : 'var(--text-mid)', fontWeight: freeDelivery ? 700 : 400 }}>
                    {freeDelivery
                      ? t.freeDeliveryReached
                      : t.freeDeliveryProgress(formatMoneyEUR(remaining), formatMoneyEUR(threshold))}
                  </span>
                  {!freeDelivery && (
                    <Link href="/legal/delivery-payment" style={{ color: 'var(--caramel)', fontSize: '0.78rem', whiteSpace: 'nowrap', textDecoration: 'underline' }}>
                      {t.deliveryNote}
                    </Link>
                  )}
                </div>
                <div style={{ height: 7, background: freeDelivery ? 'oklch(88% 0.1 145)' : 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${progress}%`,
                    background: freeDelivery ? 'oklch(55% 0.15 145)' : 'var(--caramel)',
                    borderRadius: 99, transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            )}

            {/* Mobile CTA */}
            <div className="mobile-cta">
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{t.subtotal}</span>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--plum)' }}>
                  {subtotalCents > 0 ? formatDualMoney(subtotalCents) : '—'}
                </span>
              </div>
              <Link href="/checkout" className="btn btn-primary" style={{ justifyContent: 'center', fontSize: '1rem', width: '100%' }}>
                {t.toCheckout}
              </Link>
            </div>
          </div>

          {/* Right: order summary */}
          <div style={{ position: 'sticky', top: 100 }} className="cart-sidebar">
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
            }}>
              <div style={{ background: 'var(--plum)', padding: '18px 24px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(75% 0.04 315)', marginBottom: 4 }}>
                  {t.orderSummaryTitle}
                </div>
              </div>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Item lines */}
                {items.map((item) => (
                  <div key={item.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-mid)' }}>
                      {lang === 'bg' ? item.titleBg : item.titleEn}
                      {item.quantity > 1 && <span style={{ color: 'var(--text-soft)' }}> ×{item.quantity}</span>}
                    </span>
                    <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {formatMoneyEUR(item.unitPriceCents * item.quantity)}
                    </span>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-soft)' }}>{t.delivery}</span>
                    <span style={{ color: freeDelivery ? 'oklch(40% 0.14 145)' : 'var(--text-mid)', fontWeight: freeDelivery ? 700 : 400 }}>
                      {freeDelivery
                        ? t.deliveryFree
                        : baseCents > 0 ? t.deliveryPaid(formatMoneyEUR(baseCents)) : '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem' }}>
                    <span style={{ color: 'var(--text)' }}>{t.subtotal}</span>
                    <span style={{ color: 'var(--plum)' }}>{subtotalCents > 0 ? formatDualMoney(subtotalCents) : '—'}</span>
                  </div>
                </div>

                {/* Progress bar in sidebar */}
                {showProgress && !freeDelivery && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginBottom: 5 }}>
                      {t.freeDeliveryProgress(formatMoneyEUR(remaining), formatMoneyEUR(threshold))}
                    </div>
                    <div style={{ height: 5, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progress}%`, background: 'var(--caramel)', borderRadius: 99, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                )}

                <Link href="/checkout" className="btn btn-primary" style={{ justifyContent: 'center', fontSize: '0.95rem' }}>
                  {t.toCheckout}
                </Link>
                <Link href="/order" className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: '0.88rem' }}>
                  {t.keepShopping}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-sidebar { display: none; }
          .mobile-cta { display: flex; flex-direction: column; }
        }
        @media (min-width: 901px) {
          .mobile-cta { display: none; }
        }
        @media (max-width: 480px) {
          .cart-item { flex-direction: column !important; }
          .cart-item > div:last-child { text-align: left !important; }
        }
      `}</style>
    </main>
    <Footer />
    </Fragment>
  )
}
