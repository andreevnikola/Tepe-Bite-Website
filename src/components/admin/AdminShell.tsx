'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS: { href: string; label: string }[] = [
  { href: '/admin', label: 'Табло' },
  { href: '/admin/initiatives', label: 'Инициативи' },
  { href: '/admin/partners', label: 'Партньори' },
]

export default function AdminShell({
  displayName,
  children,
}: {
  displayName: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="mb-6 px-2">
          <p className="label-tag">ТЕПЕ bite</p>
          <p className="font-[family-name:var(--font-head)] text-lg font-bold text-[var(--plum)]">
            Админ панел
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[var(--r-sm)] px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-[var(--plum)] text-white'
                  : 'text-[var(--text-mid)] hover:bg-[var(--surface2)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-[var(--border)] pt-4">
          <p className="px-3 text-xs text-[var(--text-soft)]">Влезли като</p>
          <p className="px-3 pb-2 text-sm font-medium">{displayName}</p>
          <button
            onClick={handleLogout}
            className="w-full rounded-[var(--r-sm)] px-3 py-2 text-left text-sm text-[var(--text-mid)] hover:bg-[var(--surface2)]"
          >
            Изход
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  )
}
