import Link from 'next/link'
import { getMongoose } from '@/lib/mongo'
import { Initiative } from '@/lib/mongo/models/Initiative'
import { serializeInitiative } from '@/lib/dashboard/serialize'
import { INITIATIVE_STATUS_LABELS } from '@/lib/dashboard/constants'

export const dynamic = 'force-dynamic'

export default async function InitiativesPage() {
  await getMongoose()
  const list = (await Initiative.find({}).sort({ updatedAt: -1 }).lean()).map(serializeInitiative)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-head)] text-2xl font-bold text-[var(--plum)]">
          Инициативи
        </h1>
        <Link href="/admin/initiatives/new" className="btn btn-primary">
          Нова инициатива
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-[var(--text-soft)]">Още няма инициативи.</p>
      ) : (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)]">
          {list.map((i) => {
            const done = i.steps.filter((s) => s.done).length
            const progress = i.steps.length ? Math.round((done / i.steps.length) * 100) : 0
            return (
              <li key={i.id}>
                <Link
                  href={`/admin/initiatives/${i.id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--surface2)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{i.titleBg}</p>
                    <p className="text-xs text-[var(--text-soft)]">
                      {progress}% · {done}/{i.steps.length} стъпки
                    </p>
                  </div>
                  {!i.isPublished && (
                    <span className="rounded-full bg-[var(--surface2)] px-2 py-0.5 text-xs text-[var(--text-soft)]">
                      чернова
                    </span>
                  )}
                  <span className="rounded-full bg-[var(--plum)]/10 px-2 py-0.5 text-xs font-medium text-[var(--plum)]">
                    {INITIATIVE_STATUS_LABELS[i.status].bg}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
