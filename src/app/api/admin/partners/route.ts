import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getMongoose } from '@/lib/mongo'
import { Partner } from '@/lib/mongo/models/Partner'
import { translateFields } from '@/lib/translate'
import { serializePartner } from '@/lib/dashboard/serialize'
import { uniquePartnerSlug } from '@/lib/dashboard/partner-slug'
import { writeAudit } from '@/lib/dashboard/audit'
import { getIp } from '@/lib/dashboard/http'
import { PartnerCreateSchema } from '@/lib/dashboard/validation'

export const runtime = 'nodejs'

export async function GET(): Promise<NextResponse> {
  const { admin, response } = await requireAdmin()
  if (!admin) return response

  await getMongoose()
  const partners = await Partner.find({}).sort({ nameBg: 1 }).lean()
  return NextResponse.json({ partners: partners.map(serializePartner) })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { admin, response } = await requireAdmin()
  if (!admin) return response

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = PartnerCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }
  const data = parsed.data

  // Auto-translate only the fields without a manual EN override.
  const toTranslate: Record<string, string> = {}
  if (!data.nameEn?.trim()) toTranslate.nameEn = data.nameBg
  if (!data.descriptionEn?.trim()) toTranslate.descriptionEn = data.descriptionBg ?? ''
  const { result, ok } = await translateFields(toTranslate)

  const nameEn = data.nameEn?.trim() || result.nameEn || data.nameBg
  const descriptionEn = data.descriptionEn?.trim() || result.descriptionEn || ''

  await getMongoose()
  const slug = await uniquePartnerSlug(nameEn)
  const created = await Partner.create({
    nameBg: data.nameBg,
    nameEn,
    slug,
    descriptionBg: data.descriptionBg ?? '',
    descriptionEn,
    isStarPartner: data.isStarPartner,
    image: data.image ?? null,
    links: data.links ?? {},
    needsTranslationReview: !ok,
  })

  await writeAudit({
    actorAdminId: admin._id.toString(),
    actorDisplayName: admin.displayName,
    action: 'partner.create',
    entityType: 'partner',
    entityId: created._id.toString(),
    after: { nameBg: created.nameBg },
    ipAddress: getIp(req),
  })

  return NextResponse.json({ partner: serializePartner(created.toObject()) }, { status: 201 })
}
