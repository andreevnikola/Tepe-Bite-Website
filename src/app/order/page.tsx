export const dynamic = 'force-dynamic'

import CartToast from '@/components/cart/CartToast'
import PackCard from '@/components/order/PackCard'
import { getAllProductPlans } from '@/lib/db/product-plans'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

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
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="label-tag" style={{ marginBottom: 14 }}>
            Поръчай / Order
          </div>
          <h1 className="heading-xl" style={{ marginBottom: 16 }}>
            Избери своя пакет
          </h1>
          <p style={{ fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.75 }}>
            Всяко барче е направено в Пловдив и носи смисъл отвъд вкуса.
            Избери пакета, който ти подхожда.
          </p>

          {/* Product photo strip */}
          <div style={{ position: 'relative', height: 180, borderRadius: 'var(--r-md)', overflow: 'hidden', maxWidth: 640, margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
            <Image
              src="/bar-product.png"
              alt="ТЕПЕ bite барчета"
              fill
              priority
              sizes="640px"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, oklch(32% 0.09 315 / 0.55), transparent 60%)' }} />
            <div style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                ТЕПЕ bite
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginTop: 4, letterSpacing: '0.04em' }}>
                Солен карамел от Пловдив
              </div>
            </div>
          </div>
        </div>

        {/* DB unavailable */}
        {dbUnavailable && (
          <div style={{ maxWidth: 560, margin: '0 auto 64px', background: 'var(--caramel-lt)', borderRadius: 'var(--r-md)', padding: '24px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>🛒</div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Онлайн поръчките идват скоро</div>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              Подготвяме системата за поръчки. Следи ни в социалните мрежи за последна информация.
            </p>
          </div>
        )}

        {/* Pack cards grid */}
        {!dbUnavailable && (
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
            className="packs-grid"
          >
            {plans.map((plan) => (
              <PackCard key={plan.slug} plan={plan} />
            ))}
          </div>
        )}

        {/* Delivery policy strip */}
        {!dbUnavailable && (
          <div style={{
            marginTop: 48,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: '20px 28px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🚚</span>
                <span style={{ color: 'var(--text-mid)' }}>
                  <strong style={{ color: 'var(--text)' }}>Безплатна доставка</strong> до Speedy автомат при поръчка над €30
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
                <span style={{ fontSize: '1.2rem' }}>💳</span>
                <span style={{ color: 'var(--text-mid)' }}>
                  <strong style={{ color: 'var(--text)' }}>Наложен платеж</strong> — плащаш при получаване
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📦</span>
                <span style={{ color: 'var(--text-mid)' }}>
                  <strong style={{ color: 'var(--text)' }}>2–4 работни дни</strong> след потвърждение
                </span>
              </div>
            </div>
            <Link href="/legal/delivery-payment" style={{ fontSize: '0.82rem', color: 'var(--caramel)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Условия за доставка →
            </Link>
          </div>
        )}

        {/* Legal links */}
        <div style={{ textAlign: 'center', marginTop: 36, fontSize: '0.8rem', color: 'var(--text-soft)', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/legal/delivery-payment" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
            Доставка и плащане
          </Link>
          <Link href="/legal/product-info" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
            Информация за продукта
          </Link>
          <Link href="/legal/returns-complaints" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
            Рекламации
          </Link>
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
