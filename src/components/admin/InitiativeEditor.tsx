'use client'

import '@uploadthing/react/styles.css'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, Field, TextInput, TextArea, Select } from '@/components/admin/ui'
import ImageUploader from '@/components/admin/ImageUploader'
import { UploadButton } from '@/lib/uploadthing/client'
import {
  INITIATIVE_STATUSES,
  INITIATIVE_STATUS_LABELS,
  INITIATIVE_CATEGORIES,
  INITIATIVE_CATEGORY_LABELS,
  PARTNERSHIP_TYPES,
  PARTNERSHIP_TYPE_LABELS,
  INFLOW_SOURCES,
  INFLOW_SOURCE_LABELS,
  INFLOW_PHASES,
  INFLOW_PHASE_LABELS,
  ARRANGED_TYPES,
  ARRANGED_TYPE_LABELS,
  type InitiativeStatus,
  type InitiativeCategory,
  type PartnershipType,
  type InflowSource,
  type InflowPhase,
  type ArrangedType,
} from '@/lib/dashboard/constants'
import type { ImageDTO, InitiativeDTO, PartnerDTO } from '@/lib/dashboard/dto'

let counter = 0
const uid = () => `k${Date.now()}_${counter++}`

const eur = (cents: number) => `${(cents / 100).toFixed(2)} €`
const centsToStr = (cents: number) => (cents / 100).toFixed(2)
const strToCents = (s: string) => Math.round((parseFloat(s) || 0) * 100)

type EditStep = {
  key: string
  labelBg: string
  labelEn: string
  detailBg: string
  detailEn: string
  done: boolean
  completedDateISO: string
  outcomeBg: string
  outcomeEn: string
}
type EditPartner = {
  key: string
  partnerId: string
  partnershipType: PartnershipType
  contributionBg: string
  contributionEn: string
}
type EditInflow = {
  key: string
  source: InflowSource
  partnerId: string
  sourceLabelBg: string
  sourceLabelEn: string
  amount: string
  dateISO: string
  phase: InflowPhase
  arrangedType: ArrangedType
  noteBg: string
}
type EditGallery = { key: string; url: string; ukey: string; captionBg: string }

const TABS = ['Детайли', 'Стъпки', 'Партньори', 'Финанси', 'Галерия'] as const

export default function InitiativeEditor({
  initial,
  allPartners,
}: {
  initial?: InitiativeDTO
  allPartners: PartnerDTO[]
}) {
  const router = useRouter()
  const isEdit = Boolean(initial)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Детайли')

  const [titleBg, setTitleBg] = useState(initial?.titleBg ?? '')
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? '')
  const [descriptionBg, setDescriptionBg] = useState(initial?.descriptionBg ?? '')
  const [status, setStatus] = useState<InitiativeStatus>(initial?.status ?? 'planned')
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false)
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false)
  const [frozenReasonBg, setFrozenReasonBg] = useState(initial?.frozenReasonBg ?? '')
  const [completionDateISO, setCompletionDateISO] = useState(
    initial?.completionDateISO ? initial.completionDateISO.slice(0, 10) : '',
  )
  const [category, setCategory] = useState<InitiativeCategory | ''>(initial?.category ?? '')
  const [locationBg, setLocationBg] = useState(initial?.locationBg ?? '')
  const [coverImage, setCoverImage] = useState<ImageDTO | null>(initial?.coverImage ?? null)
  const [expectedCost, setExpectedCost] = useState(centsToStr(initial?.expectedCostCents ?? 0))
  const [spent, setSpent] = useState(centsToStr(initial?.spentCents ?? 0))

  const [steps, setSteps] = useState<EditStep[]>(
    (initial?.steps ?? []).map((s) => ({
      key: uid(),
      labelBg: s.labelBg,
      labelEn: s.labelEn,
      detailBg: s.detailBg,
      detailEn: s.detailEn,
      done: s.done,
      completedDateISO: s.completedDateISO ? s.completedDateISO.slice(0, 10) : '',
      outcomeBg: s.outcomeBg,
      outcomeEn: s.outcomeEn,
    })),
  )
  const [currentStepIndex, setCurrentStepIndex] = useState(initial?.currentStepIndex ?? 0)

  const [partners, setPartners] = useState<EditPartner[]>(
    (initial?.partners ?? []).map((p) => ({
      key: uid(),
      partnerId: p.partnerId,
      partnershipType: p.partnershipType,
      contributionBg: p.contributionBg,
      contributionEn: p.contributionEn,
    })),
  )

  const [inflows, setInflows] = useState<EditInflow[]>(
    (initial?.inflows ?? []).map((f) => ({
      key: uid(),
      source: f.source,
      partnerId: f.partnerId ?? '',
      sourceLabelBg: f.sourceLabelBg,
      sourceLabelEn: f.sourceLabelEn,
      amount: centsToStr(f.amountCents),
      dateISO: f.dateISO ? f.dateISO.slice(0, 10) : '',
      phase: f.phase,
      arrangedType: f.arrangedType ?? 'awaiting_transfer',
      noteBg: f.noteBg,
    })),
  )

  const [gallery, setGallery] = useState<EditGallery[]>(
    (initial?.gallery ?? []).map((g) => ({
      key: uid(),
      url: g.url,
      ukey: g.key,
      captionBg: g.captionBg,
    })),
  )

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const partnerName = (id: string) => allPartners.find((p) => p.id === id)?.nameBg ?? '—'

  const doneCount = steps.filter((s) => s.done).length
  const progress = steps.length ? Math.round((doneCount / steps.length) * 100) : 0

  // Money grouped by lifecycle phase (each inflow counts in exactly one bucket).
  const phaseTotals = useMemo(() => {
    const totals = { planned: 0, arranged: 0, available: 0 }
    for (const f of inflows) totals[f.phase] += strToCents(f.amount)
    return totals
  }, [inflows])
  const totalCents = phaseTotals.planned + phaseTotals.arranged + phaseTotals.available

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!titleBg.trim() || !titleEn.trim() || !descriptionBg.trim()) {
      setError('Заглавие (BG), заглавие (EN) и описание (BG) са задължителни.')
      setTab('Детайли')
      return
    }
    // Every completed step must have a completion date.
    if (steps.some((s) => s.done && !s.completedDateISO)) {
      setError('Всяка завършена стъпка изисква дата на завършване.')
      setTab('Стъпки')
      return
    }
    // Every completed step must describe what was accomplished.
    if (steps.some((s) => s.done && !s.outcomeBg.trim())) {
      setError('Всяка завършена стъпка изисква описание на завършеното.')
      setTab('Стъпки')
      return
    }
    if (status === 'done' && !completionDateISO) {
      setError('Изберете дата на завършване на инициативата.')
      setTab('Детайли')
      return
    }
    setSaving(true)

    const payload = {
      titleBg,
      titleEn,
      descriptionBg,
      status,
      isPublished,
      isFeatured,
      frozenReasonBg: status === 'frozen' ? frozenReasonBg : '',
      completionDateISO: status === 'done' ? completionDateISO : '',
      category: category || null,
      locationBg,
      coverImage,
      expectedCostCents: strToCents(expectedCost),
      spentCents: strToCents(spent),
      currentStepIndex,
      steps: steps.map((s) => ({
        labelBg: s.labelBg,
        labelEn: s.labelEn,
        detailBg: s.detailBg,
        detailEn: s.detailEn,
        done: s.done,
        completedDateISO: s.done ? s.completedDateISO : '',
        outcomeBg: s.done ? s.outcomeBg : '',
        outcomeEn: s.outcomeEn,
      })),
      partners: partners
        .filter((p) => p.partnerId)
        .map((p) => ({
          partnerId: p.partnerId,
          partnershipType: p.partnershipType,
          contributionBg: p.contributionBg,
          contributionEn: p.contributionEn,
        })),
      inflows: inflows.map((f) => ({
        source: f.source,
        partnerId: f.source === 'partner' ? f.partnerId || null : null,
        sourceLabelBg: f.sourceLabelBg,
        amountCents: strToCents(f.amount),
        dateISO: f.dateISO || new Date().toISOString().slice(0, 10),
        phase: f.phase,
        arrangedType: f.phase === 'arranged' ? f.arrangedType : null,
        noteBg: f.noteBg,
      })),
      gallery: gallery.map((g) => ({ url: g.url, key: g.ukey, captionBg: g.captionBg })),
    }

    try {
      const res = await fetch(
        isEdit ? `/api/admin/initiatives/${initial!.id}` : '/api/admin/initiatives',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? data.error ?? 'Възникна грешка при запис.')
        setSaving(false)
        return
      }
      router.push('/admin/initiatives')
      router.refresh()
    } catch {
      setError('Възникна грешка при запис.')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initial) return
    if (!confirm(`Изтриване на инициатива „${initial.titleBg}“?`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/initiatives/${initial.id}`, { method: 'DELETE' })
      if (!res.ok) {
        setError('Неуспешно изтриване.')
        setDeleting(false)
        return
      }
      router.push('/admin/initiatives')
      router.refresh()
    } catch {
      setError('Възникна грешка при изтриване.')
      setDeleting(false)
    }
  }

  // ─── step helpers ───
  function moveStep(idx: number, dir: -1 | 1) {
    const next = idx + dir
    if (next < 0 || next >= steps.length) return
    const copy = [...steps]
    ;[copy[idx], copy[next]] = [copy[next], copy[idx]]
    setSteps(copy)
    if (currentStepIndex === idx) setCurrentStepIndex(next)
    else if (currentStepIndex === next) setCurrentStepIndex(idx)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl flex-col gap-5">
      {/* summary bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm">
        <span>
          Напредък: <strong>{progress}%</strong> ({doneCount}/{steps.length})
        </span>
        <span>
          Налично: <strong>{eur(phaseTotals.available)}</strong>
        </span>
        <span>
          Очаквана цена: <strong>{eur(strToCents(expectedCost))}</strong>
        </span>
        <span>
          Похарчени: <strong>{eur(strToCents(spent))}</strong>
        </span>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t
                ? 'border-[var(--plum)] text-[var(--plum)]'
                : 'border-transparent text-[var(--text-soft)] hover:text-[var(--text)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Детайли' && (
        <Card>
          <div className="flex flex-col gap-4">
            <Field label="Заглавие (BG)">
              <TextInput value={titleBg} onChange={(e) => setTitleBg(e.target.value)} required />
            </Field>
            <Field label="Заглавие (EN) — задължително, въвежда се ръчно">
              <TextInput value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Статус">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InitiativeStatus)}
                >
                  {INITIATIVE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {INITIATIVE_STATUS_LABELS[s].bg}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Категория">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InitiativeCategory | '')}
                >
                  <option value="">—</option>
                  {INITIATIVE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {INITIATIVE_CATEGORY_LABELS[c].bg}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Публикувана (видима на сайта)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              На фокус (спотлайт на публичната страница — само една инициатива)
            </label>
            {status === 'frozen' && (
              <Field label="Причина за замразяване (BG)" hint="Показва се публично; преведена автоматично на EN.">
                <TextArea
                  value={frozenReasonBg}
                  onChange={(e) => setFrozenReasonBg(e.target.value)}
                  className="min-h-20"
                />
              </Field>
            )}
            {status === 'done' && (
              <div>
                <Field label="Дата на завършване" hint="Показва се публично на картите и страницата на инициативата.">
                  <TextInput
                    type="date"
                    value={completionDateISO}
                    onChange={(e) => setCompletionDateISO(e.target.value)}
                  />
                </Field>
                {!completionDateISO && (
                  <p className="mt-1 text-xs text-red-600">
                    Изберете дата на завършване, за да запазите.
                  </p>
                )}
              </div>
            )}
            <Field label="Локация (BG)">
              <TextInput value={locationBg} onChange={(e) => setLocationBg(e.target.value)} />
            </Field>
            <Field label="Корица">
              <div className="mt-1">
                <ImageUploader value={coverImage} onChange={setCoverImage} size={220} />
              </div>
            </Field>
            <Field label="Описание (BG)">
              <TextArea
                value={descriptionBg}
                onChange={(e) => setDescriptionBg(e.target.value)}
                className="min-h-40"
                required
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Очаквана обща цена (€)">
                <TextInput
                  type="number"
                  step="0.01"
                  min="0"
                  value={expectedCost}
                  onChange={(e) => setExpectedCost(e.target.value)}
                />
              </Field>
              <Field label="Похарчени до момента (€)">
                <TextInput
                  type="number"
                  step="0.01"
                  min="0"
                  value={spent}
                  onChange={(e) => setSpent(e.target.value)}
                />
              </Field>
            </div>
            <p className="text-xs text-[var(--text-soft)]">
              Английските версии на описанието, локацията, стъпките и т.н. се превеждат автоматично
              при запис.
            </p>
          </div>
        </Card>
      )}

      {tab === 'Стъпки' && (
        <Card>
          <div className="flex flex-col gap-3">
            {steps.length === 0 && (
              <p className="text-sm text-[var(--text-soft)]">Още няма стъпки.</p>
            )}
            {steps.map((s, idx) => (
              <div
                key={s.key}
                className="rounded-[var(--r-sm)] border border-[var(--border)] p-3"
              >
                <div className="mb-2 flex items-center gap-3 text-xs text-[var(--text-soft)]">
                  <span>#{idx + 1}</span>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="currentStep"
                      checked={currentStepIndex === idx}
                      onChange={() => setCurrentStepIndex(idx)}
                    />
                    текуща
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={s.done}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, done: e.target.checked } : x)),
                        )
                      }
                    />
                    завършена
                  </label>
                  <span className="ml-auto flex gap-2">
                    <button type="button" onClick={() => moveStep(idx, -1)}>
                      ↑
                    </button>
                    <button type="button" onClick={() => moveStep(idx, 1)}>
                      ↓
                    </button>
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() => {
                        setSteps((prev) => prev.filter((_, i) => i !== idx))
                        if (currentStepIndex >= idx && currentStepIndex > 0)
                          setCurrentStepIndex((c) => c - 1)
                      }}
                    >
                      Изтрий
                    </button>
                  </span>
                </div>
                <TextInput
                  placeholder="Заглавие на стъпката (BG)"
                  value={s.labelBg}
                  onChange={(e) =>
                    setSteps((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, labelBg: e.target.value } : x)),
                    )
                  }
                  className="mb-2"
                />
                <TextInput
                  placeholder="Детайл (BG, по избор)"
                  value={s.detailBg}
                  onChange={(e) =>
                    setSteps((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, detailBg: e.target.value } : x)),
                    )
                  }
                />
                {s.done && (
                  <div className="mt-2">
                    <Field label="Дата на завършване">
                      <TextInput
                        type="date"
                        value={s.completedDateISO}
                        onChange={(e) =>
                          setSteps((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, completedDateISO: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </Field>
                    {!s.completedDateISO && (
                      <p className="mt-1 text-xs text-red-600">
                        Изберете дата на завършване, за да запазите.
                      </p>
                    )}
                    <Field
                      label="Какво беше направено (BG)"
                      hint="Показва се публично под стъпката; преведено автоматично на EN."
                    >
                      <TextArea
                        value={s.outcomeBg}
                        onChange={(e) =>
                          setSteps((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, outcomeBg: e.target.value } : x,
                            ),
                          )
                        }
                        className="min-h-20"
                        placeholder="Опишете какво постигнахме в тази стъпка"
                      />
                    </Field>
                    {!s.outcomeBg.trim() && (
                      <p className="mt-1 text-xs text-red-600">
                        Опишете какво беше направено, за да запазите.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setSteps((prev) => [
                  ...prev,
                  {
                    key: uid(),
                    labelBg: '',
                    labelEn: '',
                    detailBg: '',
                    detailEn: '',
                    done: false,
                    completedDateISO: '',
                    outcomeBg: '',
                    outcomeEn: '',
                  },
                ])
              }
              className="btn btn-secondary self-start"
            >
              + Добави стъпка
            </button>
          </div>
        </Card>
      )}

      {tab === 'Партньори' && (
        <Card>
          <div className="flex flex-col gap-3">
            {allPartners.length === 0 && (
              <p className="text-sm text-[var(--text-soft)]">
                Първо създайте партньори в раздел „Партньори“.
              </p>
            )}
            {partners.map((p, idx) => (
              <div key={p.key} className="rounded-[var(--r-sm)] border border-[var(--border)] p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Партньор">
                    <Select
                      value={p.partnerId}
                      onChange={(e) =>
                        setPartners((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, partnerId: e.target.value } : x,
                          ),
                        )
                      }
                    >
                      <option value="">— избери —</option>
                      {allPartners.map((ap) => (
                        <option key={ap.id} value={ap.id}>
                          {ap.nameBg}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Тип партньорство">
                    <Select
                      value={p.partnershipType}
                      onChange={(e) =>
                        setPartners((prev) =>
                          prev.map((x, i) =>
                            i === idx
                              ? { ...x, partnershipType: e.target.value as PartnershipType }
                              : x,
                          ),
                        )
                      }
                    >
                      {PARTNERSHIP_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {PARTNERSHIP_TYPE_LABELS[t].bg}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Как помага (BG)">
                    <TextInput
                      value={p.contributionBg}
                      onChange={(e) =>
                        setPartners((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, contributionBg: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  className="mt-2 text-xs text-red-600"
                  onClick={() => setPartners((prev) => prev.filter((_, i) => i !== idx))}
                >
                  Премахни
                </button>
              </div>
            ))}
            {allPartners.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setPartners((prev) => [
                    ...prev,
                    {
                      key: uid(),
                      partnerId: '',
                      partnershipType: 'sponsor',
                      contributionBg: '',
                      contributionEn: '',
                    },
                  ])
                }
                className="btn btn-secondary self-start"
              >
                + Добави партньор
              </button>
            )}
          </div>
        </Card>
      )}

      {tab === 'Финанси' && (
        <Card>
          {/* Financial situation of the campaign */}
          <div className="mb-5 rounded-[var(--r-sm)] bg-[var(--surface2)] p-4">
            <div className="mb-4 max-w-xs">
              <Field label="Очаквана обща цена (€)">
                <TextInput
                  type="number"
                  step="0.01"
                  min="0"
                  value={expectedCost}
                  onChange={(e) => setExpectedCost(e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <PhaseStat
                label={INFLOW_PHASE_LABELS.planned.bg}
                value={eur(phaseTotals.planned)}
                hint="Очаквано, но несигурно"
              />
              <PhaseStat
                label={INFLOW_PHASE_LABELS.arranged.bg}
                value={eur(phaseTotals.arranged)}
                hint="Договорено, но още не в наличност"
              />
              <PhaseStat
                label={INFLOW_PHASE_LABELS.available.bg}
                value={eur(phaseTotals.available)}
                hint="Реално достъпно сега"
              />
            </div>
            <p className="mt-3 text-xs text-[var(--text-soft)]">
              Общо по всички фази: <strong>{eur(totalCents)}</strong> · Похарчени:{' '}
              <strong>{eur(strToCents(spent))}</strong>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {inflows.map((f, idx) => {
              const linkedPartners = partners.filter((p) => p.partnerId)
              return (
                <div
                  key={f.key}
                  className="rounded-[var(--r-sm)] border border-[var(--border)] p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Източник">
                      <Select
                        value={f.source}
                        onChange={(e) =>
                          setInflows((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, source: e.target.value as InflowSource } : x,
                            ),
                          )
                        }
                      >
                        {INFLOW_SOURCES.map((s) => (
                          <option key={s} value={s}>
                            {INFLOW_SOURCE_LABELS[s].bg}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    {f.source === 'partner' && (
                      <Field label="Партньор донор">
                        <Select
                          value={f.partnerId}
                          onChange={(e) =>
                            setInflows((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, partnerId: e.target.value } : x,
                              ),
                            )
                          }
                        >
                          <option value="">— избери —</option>
                          {linkedPartners.map((lp) => (
                            <option key={lp.key} value={lp.partnerId}>
                              {partnerName(lp.partnerId)}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}
                    {f.source === 'external_other' && (
                      <Field label="Име на източника (BG)">
                        <TextInput
                          value={f.sourceLabelBg}
                          onChange={(e) =>
                            setInflows((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, sourceLabelBg: e.target.value } : x,
                              ),
                            )
                          }
                        />
                      </Field>
                    )}
                    <Field label="Сума (€)">
                      <TextInput
                        type="number"
                        step="0.01"
                        min="0"
                        value={f.amount}
                        onChange={(e) =>
                          setInflows((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, amount: e.target.value } : x)),
                          )
                        }
                      />
                    </Field>
                    <Field label="Дата">
                      <TextInput
                        type="date"
                        value={f.dateISO}
                        onChange={(e) =>
                          setInflows((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, dateISO: e.target.value } : x)),
                          )
                        }
                      />
                    </Field>
                    <Field label="Фаза" hint={INFLOW_PHASE_LABELS[f.phase].hintBg}>
                      <Select
                        value={f.phase}
                        onChange={(e) =>
                          setInflows((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, phase: e.target.value as InflowPhase } : x,
                            ),
                          )
                        }
                      >
                        {INFLOW_PHASES.map((p) => (
                          <option key={p} value={p}>
                            {INFLOW_PHASE_LABELS[p].bg}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    {f.phase === 'arranged' && (
                      <Field label="Тип на осигуряването" hint={ARRANGED_TYPE_LABELS[f.arrangedType].hintBg}>
                        <Select
                          value={f.arrangedType}
                          onChange={(e) =>
                            setInflows((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? { ...x, arrangedType: e.target.value as ArrangedType }
                                  : x,
                              ),
                            )
                          }
                        >
                          {ARRANGED_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {ARRANGED_TYPE_LABELS[t].bg}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}
                  </div>
                  <div className="mt-3">
                    <Field label="Бележка (BG, по избор)">
                      <TextInput
                        value={f.noteBg}
                        onChange={(e) =>
                          setInflows((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, noteBg: e.target.value } : x)),
                          )
                        }
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    className="mt-2 text-xs text-red-600"
                    onClick={() => setInflows((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    Премахни
                  </button>
                </div>
              )
            })}
            <button
              type="button"
              onClick={() =>
                setInflows((prev) => [
                  ...prev,
                  {
                    key: uid(),
                    source: 'impact_fund',
                    partnerId: '',
                    sourceLabelBg: '',
                    sourceLabelEn: '',
                    amount: '',
                    dateISO: new Date().toISOString().slice(0, 10),
                    phase: 'planned',
                    arrangedType: 'awaiting_transfer',
                    noteBg: '',
                  },
                ])
              }
              className="btn btn-secondary self-start"
            >
              + Добави постъпление
            </button>
          </div>
        </Card>
      )}

      {tab === 'Галерия' && (
        <Card>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((g, idx) => (
                <div key={g.key} className="flex flex-col gap-1">
                  <Image
                    src={g.url}
                    alt=""
                    width={160}
                    height={120}
                    className="h-28 w-full rounded-[var(--r-sm)] border border-[var(--border)] object-cover"
                  />
                  <TextInput
                    placeholder="Надпис (BG)"
                    value={g.captionBg}
                    onChange={(e) =>
                      setGallery((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, captionBg: e.target.value } : x)),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    Премахни
                  </button>
                </div>
              ))}
            </div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                const added = (res ?? []).map((f) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const sd = (f as any).serverData
                  return {
                    key: uid(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    url: sd?.url ?? (f as any).ufsUrl ?? (f as any).url,
                    ukey: sd?.key ?? f.key,
                    captionBg: '',
                  }
                })
                setGallery((prev) => [...prev, ...added])
              }}
              onUploadError={(e) => setError(`Грешка при качване: ${e.message}`)}
            />
          </div>
        </Card>
      )}

      {error && (
        <p className="rounded-[var(--r-sm)] bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="sticky bottom-0 flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg)] py-3">
        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? 'Запис…' : isEdit ? 'Запази промените' : 'Създай инициатива'}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:underline disabled:opacity-60"
          >
            {deleting ? 'Изтриване…' : 'Изтрий инициативата'}
          </button>
        )}
      </div>
    </form>
  )
}

function PhaseStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--surface)] p-3">
      <p className="text-xs text-[var(--text-soft)]">{label}</p>
      <p className="text-lg font-bold text-[var(--plum)]">{value}</p>
      <p className="text-[11px] text-[var(--text-soft)]">{hint}</p>
    </div>
  )
}
