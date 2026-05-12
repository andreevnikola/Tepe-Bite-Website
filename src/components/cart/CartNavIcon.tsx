'use client'
import { IconCart } from '@/components/icons'
import { useCartItemCount } from '@/store/cart'
import Link from 'next/link'

export default function CartNavIcon() {
  const count = useCartItemCount()
  if (count === 0) return null

  return (
    <Link
      href="/cart"
      aria-label={`Количка — ${count} артикул${count === 1 ? '' : 'а'}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--plum)',
        textDecoration: 'none',
        padding: 6,
        borderRadius: '50%',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface2)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <IconCart size={22} />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'var(--caramel)',
          color: 'white',
          borderRadius: '50%',
          width: 16,
          height: 16,
          fontSize: '0.6rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        {count > 9 ? '9+' : count}
      </span>
    </Link>
  )
}
