'use client'
import { PRICING } from '@/lib/config/pricing'
import type { SafeProductPlan } from '@/lib/db/product-plans'
import { formatDualMoney } from '@/lib/money'
import { useAddToCart } from '@/store/cart'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  plan: SafeProductPlan
}

const available = (p: SafeProductPlan) => p.isActive && p.priceCents > 0

const webOrdersUnavailable = process.env.NEXT_PUBLIC_WEB_ORDERS_AVAILABLE !== 'true'

export default function PackCard({ plan }: Props) {
  const lang = useAtomValue(langAtom)
  const addToCart = useAddToCart()
  const router = useRouter()

  const isAvailable = available(plan)
  const title = lang === 'bg' ? plan.titleBg : plan.titleEn
  const description = lang === 'bg' ? plan.descriptionBg : plan.descriptionEn

  const threshold = PRICING.FREE_DELIVERY_THRESHOLD_CENTS
  const qualifiesFreeDelivery = isAvailable && threshold > 0 && plan.priceCents >= threshold

  const handleOrderNow = () => {
    if (!isAvailable) return
    addToCart({
      slug: plan.slug,
      packSize: plan.packSize,
      titleBg: plan.titleBg,
      titleEn: plan.titleEn,
      quantity: 1,
      unitPriceCents: plan.priceCents,
      currency: plan.currency,
    })
    router.push('/cart')
  }

  return (
    <div
      className="card card-hover"
      style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden', position: 'relative' }}
    >
      {/* Product image strip */}
      <div style={{ position: 'relative', height: 160, background: isAvailable ? 'var(--plum)' : 'var(--surface2)', overflow: 'hidden' }}>
        <Image
          src="/bar-product.png"
          alt={`ТЕПЕ bite — ${title}`}
          fill
          sizes="(max-width: 900px) 100vw, 380px"
          style={{ objectFit: 'cover', objectPosition: 'center 25%', opacity: isAvailable ? 0.75 : 0.35 }}
        />
        {/* Gradient overlay so text overlays stay readable */}
        <div style={{ position: 'absolute', inset: 0, background: isAvailable ? 'linear-gradient(to top, oklch(32% 0.09 315 / 0.92) 0%, oklch(32% 0.09 315 / 0.45) 50%, transparent 100%)' : 'linear-gradient(to top, oklch(15% 0.02 310 / 0.85) 0%, transparent 70%)' }} />
        {/* Pack size overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '3.2rem', fontWeight: 900, lineHeight: 1, color: 'white', textShadow: '0 2px 12px oklch(10% 0.05 310 / 0.6)' }}>
                {plan.packSize}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
                {lang === 'bg' ? 'барчета' : 'bars'}
              </div>
            </div>
            {isAvailable && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', fontWeight: 700, color: 'oklch(85% 0.2 55)', lineHeight: 1.1, textShadow: '0 1px 8px oklch(10% 0.05 310 / 0.4)' }}>
                  {formatDualMoney(plan.priceCents)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Free delivery badge */}
        {qualifiesFreeDelivery && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'oklch(92% 0.1 145)', color: 'oklch(33% 0.14 145)', borderRadius: 99, padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, border: '1px solid oklch(80% 0.12 145)', whiteSpace: 'nowrap' }}>
            🚚 {lang === 'bg' ? 'Безплатна доставка' : 'Free delivery'}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 className="heading-md" style={{ fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ fontSize: '0.88rem', lineHeight: 1.65, flex: 1, color: 'var(--text-mid)' }}>{description}</p>

        {!isAvailable && (
          <div style={{ background: 'var(--caramel-lt)', borderRadius: 'var(--r-sm)', padding: '10px 14px', fontSize: '0.82rem', color: 'var(--text-mid)' }}>
            {lang === 'bg'
              ? 'Онлайн поръчките за този пакет ще бъдат достъпни скоро.'
              : 'Online ordering for this pack will be available soon.'}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link
          href={`/order/${plan.slug}`}
          className="btn btn-secondary"
          style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem', minWidth: 110 }}
        >
          {lang === 'bg' ? 'Виж пакета' : 'View pack'}
        </Link>

        {isAvailable && !webOrdersUnavailable ? (
          <button
            onClick={handleOrderNow}
            className="btn btn-caramel"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem', minWidth: 110 }}
          >
            {lang === 'bg' ? 'Поръчай' : 'Order'}
          </button>
        ) : isAvailable && webOrdersUnavailable ? (
          <button
            disabled
            title={lang === 'bg' ? 'Онлайн поръчките не са налични' : 'Online orders are unavailable'}
            className="btn"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem', minWidth: 110, background: 'var(--surface2)', color: 'var(--text-soft)', cursor: 'not-allowed', opacity: 0.6 }}
          >
            {lang === 'bg' ? 'Недостъпно' : 'Unavailable'}
          </button>
        ) : (
          <button
            disabled
            className="btn"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem', minWidth: 110, background: 'var(--surface2)', color: 'var(--text-soft)', cursor: 'not-allowed' }}
          >
            {lang === 'bg' ? 'Скоро' : 'Coming soon'}
          </button>
        )}
      </div>
    </div>
  )
}
