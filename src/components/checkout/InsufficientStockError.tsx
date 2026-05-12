'use client'

import Link from 'next/link'

type Props = {
  lang: 'bg' | 'en'
  message: string
}

export default function InsufficientStockError({ lang, message }: Props) {
  return (
    <div
      style={{
        background: 'oklch(97% 0.02 20)',
        border: '1.5px solid oklch(80% 0.08 20)',
        borderRadius: 'var(--r-md)',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>⚠️</div>
      <div style={{ fontWeight: 700, color: 'oklch(40% 0.1 20)', marginBottom: 8 }}>
        {lang === 'bg' ? 'Недостатъчна наличност' : 'Insufficient stock'}
      </div>
      <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', marginBottom: 16 }}>{message}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/cart" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>
          {lang === 'bg' ? 'Към количката' : 'Back to cart'}
        </Link>
        <a href="mailto:tepe@mail.bg" className="btn btn-caramel" style={{ fontSize: '0.9rem' }}>
          {lang === 'bg' ? 'Свържете се с нас' : 'Contact us'}
        </a>
      </div>
    </div>
  )
}
