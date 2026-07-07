import Link from 'next/link'
import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import { getMongoose } from '@/lib/mongo'
import { Partner } from '@/lib/mongo/models/Partner'
import { serializePartner } from '@/lib/dashboard/serialize'
import PartnerForm from '@/components/admin/PartnerForm'

export const dynamic = 'force-dynamic'

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) notFound()

  await getMongoose()
  const doc = await Partner.findById(id).lean()
  if (!doc) notFound()
  const partner = serializePartner(doc)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/partners" className="text-sm text-[var(--text-soft)] hover:underline">
          ← Партньори
        </Link>
        <h1 className="mt-1 font-[family-name:var(--font-head)] text-2xl font-bold text-[var(--plum)]">
          {partner.nameBg}
        </h1>
      </div>
      <PartnerForm initial={partner} />
    </div>
  )
}
