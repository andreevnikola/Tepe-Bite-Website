import Link from 'next/link'
import Image from 'next/image'
import { getMongoose } from '@/lib/mongo'
import { Partner } from '@/lib/mongo/models/Partner'
import { serializePartner } from '@/lib/dashboard/serialize'

export const dynamic = 'force-dynamic'

export default async function PartnersPage() {
  await getMongoose()
  const partners = (await Partner.find({}).sort({ nameBg: 1 }).lean()).map(serializePartner)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-head)] text-2xl font-bold text-[var(--plum)]">
          Партньори
        </h1>
        <Link href="/admin/partners/new" className="btn btn-primary">
          Нов партньор
        </Link>
      </div>

      {partners.length === 0 ? (
        <p className="text-sm text-[var(--text-soft)]">Още няма партньори.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <Link
              key={p.id}
              href={`/admin/partners/${p.id}`}
              className="flex items-center gap-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--plum)]"
            >
              {p.image ? (
                <Image
                  src={p.image.url}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full border border-[var(--border)] object-cover"
                />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--surface2)] text-xs text-[var(--text-soft)]">
                  —
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-medium">{p.nameBg}</p>
                {p.needsTranslationReview && (
                  <p className="text-xs text-amber-600">нужен превод</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
