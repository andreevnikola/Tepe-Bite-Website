'use client'
import { useCartToast } from '@/store/cart'
import { langAtom } from '@/store/lang'
import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { useEffect } from 'react'

export default function CartToast() {
  const [toast, setToast] = useCartToast()
  const lang = useAtomValue(langAtom)

  useEffect(() => {
    if (!toast.visible) return
    const t = setTimeout(() => setToast((s) => ({ ...s, visible: false })), 4000)
    return () => clearTimeout(t)
  }, [toast.visible, setToast])

  if (!toast.visible) return null

  const title = lang === 'bg' ? toast.titleBg : toast.titleEn

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 2000,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 320,
        width: 'calc(100vw - 48px)',
        animation: 'slideUpToast 0.25s ease',
      }}
    >
      <style>{`
        @keyframes slideUpToast {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'oklch(90% 0.08 145)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'oklch(38% 0.12 145)',
            fontSize: '0.85rem',
          }}
        >
          ✓
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.3 }}>
            {lang === 'bg' ? 'Добавено в количката' : 'Added to cart'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: 2 }}>{title}</div>
        </div>
        <button
          onClick={() => setToast((s) => ({ ...s, visible: false }))}
          aria-label={lang === 'bg' ? 'Затвори' : 'Close'}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-soft)',
            fontSize: '1rem',
            lineHeight: 1,
            padding: 2,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Link
          href="/cart"
          onClick={() => setToast((s) => ({ ...s, visible: false }))}
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '9px 14px' }}
        >
          {lang === 'bg' ? 'Виж количката' : 'View cart'}
        </Link>
        <button
          onClick={() => setToast((s) => ({ ...s, visible: false }))}
          className="btn btn-ghost"
          style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '9px 14px' }}
        >
          {lang === 'bg' ? 'Продължи' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
