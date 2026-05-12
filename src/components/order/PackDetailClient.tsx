'use client'
import CartToast from '@/components/cart/CartToast'
import StickyOrderSummary from '@/components/cart/StickyOrderSummary'
import QuantitySelector from '@/components/order/QuantitySelector'
import type { SafeProductPlan } from '@/lib/db/product-plans'
import { formatDualMoney } from '@/lib/money'
import { useAddToCart, useShowCartToast } from '@/store/cart'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  plan: SafeProductPlan
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

  const handleAddToCart = () => {
    if (!isAvailable) return
    addToCart({
      slug: plan.slug,
      packSize: plan.packSize,
      titleBg: plan.titleBg,
      titleEn: plan.titleEn,
      quantity: qty,
      unitPriceCents: plan.priceCents,
      currency: plan.currency,
    })
    showToast(plan.titleBg, plan.titleEn)
  }

  const handleOrderNow = () => {
    if (!isAvailable) return
    addToCart({
      slug: plan.slug,
      packSize: plan.packSize,
      titleBg: plan.titleBg,
      titleEn: plan.titleEn,
      quantity: qty,
      unitPriceCents: plan.priceCents,
      currency: plan.currency,
    })
    router.push('/cart')
  }

  const summaryItems = isAvailable
    ? [{ titleBg: plan.titleBg, titleEn: plan.titleEn, packSize: plan.packSize, quantity: qty, unitPriceCents: plan.priceCents }]
    : []

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 48,
          alignItems: 'start',
        }}
        className="pack-detail-grid"
      >
        {/* Left: detail */}
        <div>
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Пакет' : 'Pack'}
          </div>
          <h1 className="heading-xl" style={{ marginBottom: 16 }}>
            {title}
          </h1>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--plum)',
              color: 'white',
              borderRadius: 'var(--r-sm)',
              padding: '10px 18px',
              marginBottom: 28,
            }}
          >
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: '1.5rem' }}>
              {plan.packSize}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>
              {lang === 'bg' ? 'барчета' : 'bars'}
            </span>
          </div>

          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, marginBottom: 32 }}>{description}</p>

          {isAvailable ? (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                padding: '24px',
                marginBottom: 32,
              }}
            >
              {/* Price */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-soft)', marginBottom: 6 }}>
                  {lang === 'bg' ? 'Цена за пакет' : 'Price per pack'}
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 700, color: 'var(--plum)', lineHeight: 1 }}>
                  {formatDualMoney(plan.priceCents)}
                </div>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-soft)', marginBottom: 10 }}>
                  {lang === 'bg' ? 'Брой пакети' : 'Number of packs'}
                </div>
                <QuantitySelector value={qty} onChange={setQty} min={1} max={20} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: 8 }}>
                  {lang === 'bg'
                    ? `${plan.packSize * qty} барчета общо`
                    : `${plan.packSize * qty} bars total`}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', minWidth: 140 }}
                >
                  {lang === 'bg' ? 'Добави в количката' : 'Add to cart'}
                </button>
                <button
                  onClick={handleOrderNow}
                  className="btn btn-caramel"
                  style={{ flex: 1, justifyContent: 'center', minWidth: 140 }}
                >
                  {lang === 'bg' ? 'Поръчай сега' : 'Order now'}
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'var(--caramel-lt)',
                border: '1px solid oklch(84% 0.09 52)',
                borderRadius: 'var(--r-md)',
                padding: '24px',
                marginBottom: 32,
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                {lang === 'bg' ? 'Очаквайте скоро' : 'Coming soon'}
              </div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                {lang === 'bg'
                  ? 'Онлайн поръчките за този пакет ще бъдат достъпни скоро. Следи ни в социалните мрежи за последна информация.'
                  : 'Online ordering for this pack will be available soon. Follow us on social media for the latest news.'}
              </p>
            </div>
          )}

          {/* Legal links */}
          <div style={{ fontSize: '0.82rem', color: 'var(--text-soft)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/legal/product-info" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
              {lang === 'bg' ? 'Информация за продукта' : 'Product information'}
            </Link>
            <Link href="/legal/delivery-payment" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
              {lang === 'bg' ? 'Доставка и плащане' : 'Delivery & payment'}
            </Link>
          </div>
        </div>

        {/* Right: sticky summary */}
        <div style={{ position: 'sticky', top: 100 }}>
          {isAvailable ? (
            <StickyOrderSummary
              items={summaryItems}
              mode="pack-detail"
              onAddToCart={handleAddToCart}
              onOrderNow={handleOrderNow}
            />
          ) : (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow)',
                textAlign: 'center',
                color: 'var(--text-soft)',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
              {lang === 'bg' ? 'Поръчките ще бъдат достъпни скоро.' : 'Orders will be available soon.'}
            </div>
          )}
        </div>
      </div>

      <CartToast />

      <style>{`
        @media (max-width: 900px) {
          .pack-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
