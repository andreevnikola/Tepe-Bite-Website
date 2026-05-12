'use client'
import { formatDualMoney, formatMoneyEUR } from '@/lib/money'
import { PRICING } from '@/lib/config/pricing'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'

type SummaryItem = {
  titleBg: string
  titleEn: string
  packSize: number
  quantity: number
  unitPriceCents: number
}

type Props = {
  items: SummaryItem[]
  /** Show the checkout button or an "order" CTA */
  mode?: 'cart' | 'pack-detail'
  onOrderNow?: () => void
  onAddToCart?: () => void
}

export default function StickyOrderSummary({ items, mode = 'cart', onOrderNow, onAddToCart }: Props) {
  const lang = useAtomValue(langAtom)

  const subtotalCents = items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0)
  const threshold = PRICING.FREE_DELIVERY_THRESHOLD_CENTS
  // threshold may be 0 on the client (non-NEXT_PUBLIC_ env var not available in browser bundle)
  const showDeliveryProgress = threshold > 0
  const progress = showDeliveryProgress ? Math.min((subtotalCents / threshold) * 100, 100) : 0
  const remaining = showDeliveryProgress ? Math.max(threshold - subtotalCents, 0) : 0
  const freeDelivery = showDeliveryProgress && subtotalCents >= threshold

  if (items.length === 0) return null

  return (
    <div
      className="sticky-summary"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-soft)', marginBottom: 16 }}>
        {lang === 'bg' ? 'Резюме' : 'Summary'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-mid)', lineHeight: 1.3 }}>
              {lang === 'bg' ? item.titleBg : item.titleEn}
              {item.quantity > 1 && <span style={{ color: 'var(--text-soft)', marginLeft: 4 }}>×{item.quantity}</span>}
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)', whiteSpace: 'nowrap' }}>
              {item.unitPriceCents > 0 ? formatMoneyEUR(item.unitPriceCents * item.quantity) : '—'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{lang === 'bg' ? 'Сума' : 'Subtotal'}</span>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--plum)' }}>
            {subtotalCents > 0 ? formatDualMoney(subtotalCents) : '—'}
          </span>
        </div>
      </div>

      {/* Free delivery progress — hidden if threshold not available in client bundle */}
      {subtotalCents > 0 && showDeliveryProgress && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-soft)', marginBottom: 6 }}>
            <span>{freeDelivery
              ? (lang === 'bg' ? '✓ Безплатна доставка' : '✓ Free delivery')
              : (lang === 'bg' ? `Остават ${formatMoneyEUR(remaining)} до безплатна доставка` : `${formatMoneyEUR(remaining)} away from free delivery`)
            }</span>
          </div>
          <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
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
        </div>
      )}

      {mode === 'pack-detail' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {onAddToCart && (
            <button onClick={onAddToCart} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              {lang === 'bg' ? 'Добави в количката' : 'Add to cart'}
            </button>
          )}
          {onOrderNow && (
            <button onClick={onOrderNow} className="btn btn-caramel" style={{ justifyContent: 'center' }}>
              {lang === 'bg' ? 'Поръчай сега' : 'Order now'}
            </button>
          )}
        </div>
      )}

      {mode === 'cart' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            className="btn"
            style={{
              justifyContent: 'center',
              background: 'var(--surface2)',
              color: 'var(--text-soft)',
              cursor: 'not-allowed',
              opacity: 0.7,
              fontSize: '0.9rem',
            }}
            aria-disabled="true"
            title={lang === 'bg' ? 'Ще бъде достъпно скоро' : 'Coming soon'}
          >
            {lang === 'bg' ? 'Плащане — скоро' : 'Checkout — coming soon'}
          </div>
          <Link href="/order" className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: '0.88rem' }}>
            {lang === 'bg' ? 'Продължи с пазаруването' : 'Continue shopping'}
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .sticky-summary { position: static !important; }
        }
      `}</style>
    </div>
  )
}
