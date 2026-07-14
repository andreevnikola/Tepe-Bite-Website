import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getMongoose } from '@/lib/mongo'
import { Partner } from '@/lib/mongo/models/Partner'
import { Initiative } from '@/lib/mongo/models/Initiative'
import { translateFields } from '@/lib/translate'
import { serializePartner } from '@/lib/dashboard/serialize'
import { uniquePartnerSlug } from '@/lib/dashboard/partner-slug'
import { writeAudit } from '@/lib/dashboard/audit'
import { deleteUploads } from '@/lib/uploadthing/server'
import { getIp } from '@/lib/dashboard/http'
import { PartnerUpdateSchema } from '@/lib/dashboard/validation'

export const runtime = 'nodejs'

function isValidId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { admin, response } = await requireAdmin()
  if (!admin) return response
  const { id } = await params
  if (!isValidId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await getMongoose()
  const partner = await Partner.findById(id).lean()
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ partner: serializePartner(partner) })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { admin, response } = await requireAdmin()
  if (!admin) return response
  const { id } = await params
  if (!isValidId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = PartnerUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }
  const data = parsed.data

  await getMongoose()
  const partner = await Partner.findById(id)
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const oldImageKey = partner.image?.key ?? null

  if (data.nameBg !== undefined) partner.nameBg = data.nameBg
  if (data.descriptionBg !== undefined) partner.descriptionBg = data.descriptionBg
  if (data.isStarPartner !== undefined) partner.isStarPartner = data.isStarPartner
  if (data.isYouthLed !== undefined) partner.isYouthLed = data.isYouthLed
  if (data.links !== undefined) partner.set('links', { ...partner.links, ...data.links })
  if (data.image !== undefined) partner.set('image', data.image)

  // Recompute EN: use manual override when provided & non-empty, else translate.
  const toTranslate: Record<string, string> = {}
  if (!data.nameEn?.trim()) toTranslate.nameEn = partner.nameBg
  if (!data.descriptionEn?.trim()) toTranslate.descriptionEn = partner.descriptionBg ?? ''
  const { result, ok } = await translateFields(toTranslate)

  partner.nameEn = data.nameEn?.trim() || result.nameEn || partner.nameBg
  partner.descriptionEn = data.descriptionEn?.trim() || result.descriptionEn || ''
  partner.needsTranslationReview = !ok

  // Backfill a slug for legacy partners created before the field existed.
  if (!partner.slug) partner.slug = await uniquePartnerSlug(partner.nameEn, id)

  await partner.save()

  // Clean up a replaced/removed image blob.
  const newImageKey = partner.image?.key ?? null
  if (oldImageKey && oldImageKey !== newImageKey) {
    await deleteUploads([oldImageKey])
  }

  await writeAudit({
    actorAdminId: admin._id.toString(),
    actorDisplayName: admin.displayName,
    action: 'partner.update',
    entityType: 'partner',
    entityId: id,
    ipAddress: getIp(req),
  })

  return NextResponse.json({ partner: serializePartner(partner.toObject()) })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { admin, response } = await requireAdmin()
  if (!admin) return response
  const { id } = await params
  if (!isValidId(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await getMongoose()

  // Block deletion while the partner is still referenced by an initiative.
  const referencingCount = await Initiative.countDocuments({
    $or: [{ 'partners.partnerId': id }, { 'inflows.partnerId': id }],
  })
  if (referencingCount > 0) {
    return NextResponse.json(
      {
        error: 'partner_in_use',
        message: `Този партньор се използва в ${referencingCount} инициатив${
          referencingCount === 1 ? 'а' : 'и'
        }. Премахнете го от тях преди изтриване.`,
      },
      { status: 409 },
    )
  }

  const partner = await Partner.findById(id)
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const imageKey = partner.image?.key ?? null
  await partner.deleteOne()
  if (imageKey) await deleteUploads([imageKey])

  await writeAudit({
    actorAdminId: admin._id.toString(),
    actorDisplayName: admin.displayName,
    action: 'partner.delete',
    entityType: 'partner',
    entityId: id,
    before: { nameBg: partner.nameBg },
    ipAddress: getIp(req),
  })

  return NextResponse.json({ ok: true })
}
