export const dynamic = 'force-dynamic'

import PackDetailClient from '@/components/order/PackDetailClient'
import { getProductPlanBySlug } from '@/lib/db/product-plans'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type Props = {
  params: Promise<{ pack: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pack } = await params
  const plan = await getProductPlanBySlug(pack)
  if (!plan) return { title: 'Пакет — ТЕПЕ bite' }
  return {
    title: `${plan.titleBg} — ТЕПЕ bite`,
    description: plan.descriptionBg,
  }
}

export default async function PackDetailPage({ params }: Props) {
  const { pack } = await params
  const plan = await getProductPlanBySlug(pack)

  if (!plan) notFound()

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
        {/* Breadcrumb */}
        <nav
          aria-label="Навигация"
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-soft)',
            marginBottom: 40,
          }}
        >
          <Link href="/" style={{ color: 'var(--text-soft)', textDecoration: 'none' }}>Начало</Link>
          <span>›</span>
          <Link href="/order" style={{ color: 'var(--text-soft)', textDecoration: 'none' }}>Поръчай</Link>
          <span>›</span>
          <span style={{ color: 'var(--text)' }}>{plan.titleBg}</span>
        </nav>

        <PackDetailClient plan={plan} />
      </div>
    </main>
  )
}
