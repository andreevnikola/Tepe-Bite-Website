export const dynamic = 'force-dynamic'

import CartToast from '@/components/cart/CartToast'
import PackCard from '@/components/order/PackCard'
import { getAllProductPlans } from '@/lib/db/product-plans'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Поръчай — ТЕПЕ bite',
  description: 'Избери пакет барчета ТЕПЕ bite. 10, 20 или 35 барчета с солен карамел от Пловдив.',
}

export default async function OrderPage() {
  const plans = await getAllProductPlans()
  const dbUnavailable = plans.length === 0

  return (
    <main
      style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse 70% 40% at 50% 0%, oklch(88% 0.05 315 / 0.15), transparent), var(--bg)`,
        paddingTop: 100,
        paddingBottom: 80,
      }}
    >
      <div className="section-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="label-tag" style={{ marginBottom: 14 }}>
            Поръчай / Order
          </div>
          <h1 className="heading-xl" style={{ marginBottom: 20 }}>
            Избери своя пакет
          </h1>
          <p style={{ fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Всяко барче е направено в Пловдив и носи смисъл отвъд вкуса.
            Избери пакета, който ти подхожда.
          </p>
        </div>

        {/* DB unavailable */}
        {dbUnavailable && (
          <div
            style={{
              maxWidth: 560,
              margin: '0 auto 64px',
              background: 'var(--caramel-lt)',
              borderRadius: 'var(--r-md)',
              padding: '24px 28px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>🛒</div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Онлайн поръчките идват скоро
            </div>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              Подготвяме системата за поръчки. Следи ни в социалните мрежи за последна информация.
            </p>
          </div>
        )}

        {/* Pack cards grid */}
        {!dbUnavailable && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
            className="packs-grid"
          >
            {plans.map((plan) => (
              <PackCard key={plan.slug} plan={plan} />
            ))}
          </div>
        )}

        {/* Legal note */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 56,
            fontSize: '0.82rem',
            color: 'var(--text-soft)',
          }}
        >
          <a href="/legal/delivery-payment" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
            Доставка и плащане
          </a>
          {' · '}
          <a href="/legal/product-info" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
            Информация за продукта
          </a>
        </div>
      </div>

      <CartToast />

      <style>{`
        @media (max-width: 900px) {
          .packs-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; }
        }
        @media (min-width: 600px) and (max-width: 900px) {
          .packs-grid { grid-template-columns: repeat(2, 1fr) !important; max-width: 100%; }
        }
      `}</style>
    </main>
  )
}
