'use client'
import type { SafeProductPlan } from '@/lib/db/product-plans'
import { formatDualMoney } from '@/lib/money'
import { useAddToCart } from '@/store/cart'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  plan: SafeProductPlan
}

const available = (p: SafeProductPlan) => p.isActive && p.priceCents > 0

export default function PackCard({ plan }: Props) {
  const lang = useAtomValue(langAtom)
  const addToCart = useAddToCart()
  const router = useRouter()

  const isAvailable = available(plan)
  const title = lang === 'bg' ? plan.titleBg : plan.titleEn
  const description = lang === 'bg' ? plan.descriptionBg : plan.descriptionEn

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
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Pack size badge */}
      <div
        style={{
          background: isAvailable ? 'var(--plum)' : 'var(--surface2)',
          padding: '28px 28px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '3rem',
              fontWeight: 900,
              lineHeight: 1,
              color: isAvailable ? 'white' : 'var(--text-soft)',
            }}
          >
            {plan.packSize}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isAvailable ? 'oklch(88% 0.04 315)' : 'var(--text-soft)',
              marginTop: 2,
            }}
          >
            {lang === 'bg' ? 'барчета' : 'bars'}
          </div>
        </div>
        {isAvailable && (
          <div
            style={{
              marginLeft: 'auto',
              textAlign: 'right',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--caramel)',
                lineHeight: 1.2,
              }}
            >
              {formatDualMoney(plan.priceCents)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'oklch(88% 0.04 315)', marginTop: 2 }}>
              {lang === 'bg' ? 'за пакет' : 'per pack'}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 className="heading-md" style={{ fontSize: '1.15rem' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>{description}</p>

        {!isAvailable && (
          <div
            style={{
              background: 'var(--caramel-lt)',
              borderRadius: 'var(--r-sm)',
              padding: '10px 14px',
              fontSize: '0.82rem',
              color: 'var(--text-mid)',
            }}
          >
            {lang === 'bg'
              ? 'Онлайн поръчките за този пакет ще бъдат достъпни скоро.'
              : 'Online ordering for this pack will be available soon.'}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '0 28px 28px',
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href={`/order/${plan.slug}`}
          className="btn btn-secondary"
          style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem', minWidth: 120 }}
        >
          {lang === 'bg' ? 'Виж пакета' : 'View pack'}
        </Link>

        {isAvailable ? (
          <button
            onClick={handleOrderNow}
            className="btn btn-caramel"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.88rem', minWidth: 120 }}
          >
            {lang === 'bg' ? 'Поръчай сега' : 'Order now'}
          </button>
        ) : (
          <button
            disabled
            className="btn"
            style={{
              flex: 1,
              justifyContent: 'center',
              fontSize: '0.88rem',
              minWidth: 120,
              background: 'var(--surface2)',
              color: 'var(--text-soft)',
              cursor: 'not-allowed',
            }}
          >
            {lang === 'bg' ? 'Скоро' : 'Coming soon'}
          </button>
        )}
      </div>
    </div>
  )
}
