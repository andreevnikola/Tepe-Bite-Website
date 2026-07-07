import Link from 'next/link'
import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import { getMongoose } from '@/lib/mongo'
import { Initiative } from '@/lib/mongo/models/Initiative'
import { Partner } from '@/lib/mongo/models/Partner'
import { serializeInitiative, serializePartner } from '@/lib/dashboard/serialize'
import InitiativeEditor from '@/components/admin/InitiativeEditor'

export const dynamic = 'force-dynamic'

export default async function EditInitiativePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) notFound()

  await getMongoose()
  const [doc, partnerDocs] = await Promise.all([
    Initiative.findById(id).lean(),
    Partner.find({}).sort({ nameBg: 1 }).lean(),
  ])
  if (!doc) notFound()

  const initiative = serializeInitiative(doc)
  const partners = partnerDocs.map(serializePartner)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/initiatives" className="text-sm text-[var(--text-soft)] hover:underline">
          ← Инициативи
        </Link>
        <h1 className="mt-1 font-[family-name:var(--font-head)] text-2xl font-bold text-[var(--plum)]">
          {initiative.titleBg}
        </h1>
      </div>
      <InitiativeEditor initial={initiative} allPartners={partners} />
    </div>
  )
}
