'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Field, TextInput, TextArea } from '@/components/admin/ui'
import ImageUploader from '@/components/admin/ImageUploader'
import { PARTNER_LINK_TYPES, type PartnerLinkType } from '@/lib/dashboard/constants'
import type { ImageDTO, PartnerDTO } from '@/lib/dashboard/dto'

const LINK_LABELS: Record<PartnerLinkType, string> = {
  website: 'Уебсайт',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
}

export default function PartnerForm({ initial }: { initial?: PartnerDTO }) {
  const router = useRouter()
  const isEdit = Boolean(initial)

  const [nameBg, setNameBg] = useState(initial?.nameBg ?? '')
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? '')
  const [descriptionBg, setDescriptionBg] = useState(initial?.descriptionBg ?? '')
  const [descriptionEn, setDescriptionEn] = useState(initial?.descriptionEn ?? '')
  const [isStarPartner, setIsStarPartner] = useState(initial?.isStarPartner ?? false)
  const [image, setImage] = useState<ImageDTO | null>(initial?.image ?? null)
  const [links, setLinks] = useState<Record<PartnerLinkType, string>>({
    website: initial?.links.website ?? '',
    instagram: initial?.links.instagram ?? '',
    facebook: initial?.links.facebook ?? '',
    tiktok: initial?.links.tiktok ?? '',
  })
  const [showEn, setShowEn] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const payload = { nameBg, nameEn, descriptionBg, descriptionEn, isStarPartner, image, links }
    try {
      const res = await fetch(
        isEdit ? `/api/admin/partners/${initial!.id}` : '/api/admin/partners',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? data.error ?? 'Възникна грешка.')
        setSaving(false)
        return
      }
      router.push('/admin/partners')
      router.refresh()
    } catch {
      setError('Възникна грешка при запис.')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initial) return
    if (!confirm(`Изтриване на партньор „${initial.nameBg}“?`)) return
    setError(null)
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/partners/${initial.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? data.error ?? 'Неуспешно изтриване.')
        setDeleting(false)
        return
      }
      router.push('/admin/partners')
      router.refresh()
    } catch {
      setError('Възникна грешка при изтриване.')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-5">
      <Card title="Профил на партньора">
        <div className="flex flex-col gap-4">
          <Field label="Име (BG)">
            <TextInput value={nameBg} onChange={(e) => setNameBg(e.target.value)} required />
          </Field>

          <Field label="Лого / изображение">
            <div className="mt-1">
              <ImageUploader value={image} onChange={setImage} />
            </div>
          </Field>

          <Field label="Описание (BG)">
            <TextArea
              value={descriptionBg}
              onChange={(e) => setDescriptionBg(e.target.value)}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isStarPartner}
              onChange={(e) => setIsStarPartner(e.target.checked)}
            />
            ★ Звезден партньор (дългосрочен ангажимент / значителен принос — подрежда се напред)
          </label>

          <button
            type="button"
            onClick={() => setShowEn((s) => !s)}
            className="self-start text-xs font-medium text-[var(--plum)] hover:underline"
          >
            {showEn ? '− Скрий английската версия' : '+ Английска версия (по избор)'}
          </button>

          {showEn && (
            <div className="flex flex-col gap-4 rounded-[var(--r-sm)] bg-[var(--surface2)] p-4">
              <p className="text-xs text-[var(--text-soft)]">
                Оставете празно за автоматичен превод при запис. Попълнете само ако искате да
                замените машинния превод (напр. официално име на организация).
              </p>
              <Field label="Име (EN)">
                <TextInput value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
              </Field>
              <Field label="Описание (EN)">
                <TextArea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
              </Field>
            </div>
          )}
        </div>
      </Card>

      <Card title="Връзки">
        <div className="grid gap-4 sm:grid-cols-2">
          {PARTNER_LINK_TYPES.map((type) => (
            <Field key={type} label={LINK_LABELS[type]}>
              <TextInput
                type="url"
                placeholder="https://…"
                value={links[type]}
                onChange={(e) => setLinks((prev) => ({ ...prev, [type]: e.target.value }))}
              />
            </Field>
          ))}
        </div>
      </Card>

      {error && (
        <p className="rounded-[var(--r-sm)] bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? 'Запис…' : isEdit ? 'Запази промените' : 'Създай партньор'}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:underline disabled:opacity-60"
          >
            {deleting ? 'Изтриване…' : 'Изтрий партньора'}
          </button>
        )}
      </div>
    </form>
  )
}
