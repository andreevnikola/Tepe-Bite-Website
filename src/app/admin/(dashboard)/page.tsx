import Link from 'next/link'
import { getMongoose } from '@/lib/mongo'
import { Initiative } from '@/lib/mongo/models/Initiative'
import { Partner } from '@/lib/mongo/models/Partner'
import {
  INITIATIVE_STATUSES,
  INITIATIVE_STATUS_LABELS,
  type InitiativeStatus,
} from '@/lib/dashboard/constants'

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  await getMongoose()

  const [recent, partnerCount, statusCounts] = await Promise.all([
    Initiative.find({}, 'titleBg status isPublished updatedAt')
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean(),
    Partner.countDocuments({}),
    Initiative.aggregate<{ _id: InitiativeStatus; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ])

  const countByStatus = new Map(statusCounts.map((s) => [s._id, s.count]))
  const totalInitiatives = statusCounts.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-head)] text-2xl font-bold text-[var(--plum)]">
          Табло
        </h1>
        <div className="flex gap-2">
          <Link href="/admin/initiatives/new" className="btn btn-primary">
            Нова инициатива
          </Link>
          <Link href="/admin/partners/new" className="btn btn-secondary">
            Нов партньор
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Инициативи" value={totalInitiatives} />
        {INITIATIVE_STATUSES.map((status) => (
          <StatCard
            key={status}
            label={INITIATIVE_STATUS_LABELS[status].bg}
            value={countByStatus.get(status) ?? 0}
          />
        ))}
        <StatCard label="Партньори" value={partnerCount} />
      </div>

      <h2 className="mb-3 text-lg font-semibold">Последно обновени</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-[var(--text-soft)]">
          Още няма инициативи.{' '}
          <Link href="/admin/initiatives/new" className="text-[var(--plum)] underline">
            Създайте първата
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)]">
          {recent.map((i) => (
            <li key={String(i._id)}>
              <Link
                href={`/admin/initiatives/${String(i._id)}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-[var(--surface2)]"
              >
                <span className="font-medium">{i.titleBg}</span>
                <span className="flex items-center gap-2 text-xs">
                  {!i.isPublished && (
                    <span className="rounded-full bg-[var(--surface2)] px-2 py-0.5 text-[var(--text-soft)]">
                      чернова
                    </span>
                  )}
                  <StatusBadge status={i.status as InitiativeStatus} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-2xl font-bold text-[var(--plum)]">{value}</p>
      <p className="text-xs text-[var(--text-soft)]">{label}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: InitiativeStatus }) {
  return (
    <span className="rounded-full bg-[var(--plum)]/10 px-2 py-0.5 font-medium text-[var(--plum)]">
      {INITIATIVE_STATUS_LABELS[status].bg}
    </span>
  )
}
