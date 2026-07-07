import Link from 'next/link'
import { getMongoose } from '@/lib/mongo'
import { Partner } from '@/lib/mongo/models/Partner'
import { serializePartner } from '@/lib/dashboard/serialize'
import InitiativeEditor from '@/components/admin/InitiativeEditor'

export const dynamic = 'force-dynamic'

export default async function NewInitiativePage() {
  await getMongoose()
  const partners = (await Partner.find({}).sort({ nameBg: 1 }).lean()).map(serializePartner)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/initiatives" className="text-sm text-[var(--text-soft)] hover:underline">
          ← Инициативи
        </Link>
        <h1 className="mt-1 font-[family-name:var(--font-head)] text-2xl font-bold text-[var(--plum)]">
          Нова инициатива
        </h1>
      </div>
      <InitiativeEditor allPartners={partners} />
    </div>
  )
}
