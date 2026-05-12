'use client'

import StickyOrderSummary from '@/components/cart/StickyOrderSummary'
import QuantitySelector from '@/components/order/QuantitySelector'
import { formatDualMoney, formatMoneyEUR } from '@/lib/money'
import { PRICING } from '@/lib/config/pricing'
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

export default function CartPage() {
  const lang = useAtomValue(langAtom)
  const items = useCart()
  const subtotalCents = useCartSubtotalCents()
  const removeFromCart = useRemoveFromCart()
  const updateQuantity = useUpdateQuantity()
  const clearCart = useClearCart()

  const threshold = PRICING.FREE_DELIVERY_THRESHOLD_CENTS
  const progress = Math.min((subtotalCents / threshold) * 100, 100)
  const remaining = Math.max(threshold - subtotalCents, 0)
  const freeDelivery = subtotalCents >= threshold

  // Empty state
  if (items.length === 0) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          paddingTop: 100,
          paddingBottom: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 24 }}>🛒</div>
          <h1 className="heading-lg" style={{ marginBottom: 16 }}>
            {lang === 'bg' ? 'Количката е празна' : 'Your cart is empty'}
          </h1>
          <p style={{ marginBottom: 32 }}>
            {lang === 'bg'
              ? 'Разгледай нашите пакети и добави любимия си.'
              : 'Browse our packs and add your favourite.'}
          </p>
          <Link href="/order" className="btn btn-caramel" style={{ fontSize: '1rem' }}>
            {lang === 'bg' ? 'Виж пакетите' : 'View packs'}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        paddingTop: 100,
        paddingBottom: 80,
      }}
    >
      <div className="section-inner">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div className="label-tag" style={{ marginBottom: 10 }}>
            {lang === 'bg' ? 'Количка' : 'Cart'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h1 className="heading-lg">{lang === 'bg' ? 'Твоята количка' : 'Your cart'}</h1>
            <button
              onClick={clearCart}
              className="btn btn-ghost"
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
            >
              {lang === 'bg' ? 'Изчисти всичко' : 'Clear all'}
            </button>
          </div>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}
          className="cart-grid"
        >
          {/* Left: items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 16,
                    alignItems: 'center',
                  }}
                  className="cart-item"
                >
                  <div>
                    {/* Title + pack size */}
                    <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{itemTitle}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                      {item.packSize} {lang === 'bg' ? 'барчета в пакет' : 'bars per pack'}
                    </div>

                    {/* Unit price */}
                    {item.unitPriceCents > 0 && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-mid)', marginTop: 6 }}>
                        {lang === 'bg' ? 'Единична цена:' : 'Unit price:'} {formatDualMoney(item.unitPriceCents)}
                      </div>
                    )}

                    {/* Quantity + remove */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity({ slug: item.slug, quantity: q })}
                        min={1}
                        max={20}
                      />
                      <button
                        onClick={() => removeFromCart(item.slug)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          color: 'var(--text-soft)',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        {lang === 'bg' ? 'Премахни' : 'Remove'}
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div style={{ textAlign: 'right' }}>
                    {item.unitPriceCents > 0 ? (
                      <>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--plum)' }}>
                          {formatMoneyEUR(lineTotal)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: 2 }}>
                          {(lineTotal / 100 * PRICING.EUR_TO_BGN).toFixed(2)} лв.
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>—</div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Free delivery progress bar (inline, mobile-visible) */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-mid)', marginBottom: 8 }}>
                <span>
                  {freeDelivery
                    ? (lang === 'bg' ? '✓ Безплатна доставка до автомат' : '✓ Free delivery to locker')
                    : (lang === 'bg'
                        ? `Остават ${formatMoneyEUR(remaining)} за безплатна доставка`
                        : `${formatMoneyEUR(remaining)} away from free delivery`)}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--caramel)' }}>
                  {formatMoneyEUR(PRICING.FREE_DELIVERY_THRESHOLD_CENTS)}
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: freeDelivery ? 'oklch(60% 0.14 145)' : 'var(--caramel)',
                    borderRadius: 99,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: 8 }}>
                {lang === 'bg' ? (
                  <>Доставката е безплатна за поръчки над {formatMoneyEUR(PRICING.FREE_DELIVERY_THRESHOLD_CENTS)}. <a href="/legal/delivery-payment" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>Научи повече</a>.</>
                ) : (
                  <>Free delivery on orders over {formatMoneyEUR(PRICING.FREE_DELIVERY_THRESHOLD_CENTS)}. <a href="/legal/delivery-payment" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>Learn more</a>.</>
                )}
              </div>
            </div>

            {/* Subtotal row (mobile) */}
            <div
              style={{
                borderTop: '2px solid var(--border)',
                paddingTop: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                {lang === 'bg' ? 'Сума' : 'Subtotal'}
              </span>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--plum)' }}>
                {subtotalCents > 0 ? formatDualMoney(subtotalCents) : '—'}
              </span>
            </div>

            {/* Checkout note */}
            <div
              style={{
                background: 'var(--caramel-lt)',
                borderRadius: 'var(--r-sm)',
                padding: '12px 16px',
                fontSize: '0.82rem',
                color: 'var(--text-mid)',
              }}
            >
              {lang === 'bg'
                ? 'Плащането с наложен платеж ще бъде достъпно скоро. Системата за поръчки се подготвя.'
                : 'Cash on delivery checkout is coming soon. The order system is being prepared.'}
            </div>
          </div>

          {/* Right: sticky summary */}
          <div style={{ position: 'sticky', top: 100 }}>
            <StickyOrderSummary
              items={items.map((i) => ({
                titleBg: i.titleBg,
                titleEn: i.titleEn,
                packSize: i.packSize,
                quantity: i.quantity,
                unitPriceCents: i.unitPriceCents,
              }))}
              mode="cart"
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-grid > div:last-child { display: none; }
        }
        @media (max-width: 480px) {
          .cart-item { grid-template-columns: 1fr !important; }
          .cart-item > div:last-child { text-align: left !important; }
        }
      `}</style>
    </main>
  )
}
