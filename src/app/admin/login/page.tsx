'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Възникна грешка. Опитайте отново.')
        setLoading(false)
        return
      }
      const next = params.get('next')
      router.replace(next && next.startsWith('/admin') ? next : '/admin')
    } catch {
      setError('Възникна грешка. Опитайте отново.')
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-lg)]">
        <div className="mb-6 text-center">
          <p className="label-tag mb-2">ТЕПЕ bite</p>
          <h1 className="font-[family-name:var(--font-head)] text-2xl font-bold text-[var(--plum)]">
            Админ панел
          </h1>
          <p className="mt-1 text-sm text-[var(--text-soft)]">Вход за администратори</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-mid)]">
            Потребителско име
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--plum)]"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-[var(--text-mid)]">
            Парола
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--plum)]"
            />
          </label>

          {error && (
            <p className="rounded-[var(--r-sm)] bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-2 justify-center disabled:opacity-60"
          >
            {loading ? 'Влизане…' : 'Вход'}
          </button>
        </form>
      </div>
    </main>
  )
}
