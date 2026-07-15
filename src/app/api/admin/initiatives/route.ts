import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getMongoose } from '@/lib/mongo'
import { Initiative } from '@/lib/mongo/models/Initiative'
import { serializeInitiative } from '@/lib/dashboard/serialize'
import { composeInitiativeFields, slugify } from '@/lib/dashboard/initiative-writer'
import { writeAudit } from '@/lib/dashboard/audit'
import { getIp } from '@/lib/dashboard/http'
import { InitiativeCreateSchema } from '@/lib/dashboard/validation'

export const runtime = 'nodejs'

async function uniqueSlug(base: string): Promise<string> {
  let slug = base
  let n = 1
  while (await Initiative.exists({ slug })) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}

export async function GET(): Promise<NextResponse> {
  const { admin, response } = await requireAdmin()
  if (!admin) return response

  await getMongoose()
  const docs = await Initiative.find({}).sort({ updatedAt: -1 }).lean()
  return NextResponse.json({ initiatives: docs.map(serializeInitiative) })
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

  const parsed = InitiativeCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  await getMongoose()
  const { fields } = await composeInitiativeFields(parsed.data)
  const slug = await uniqueSlug(slugify(parsed.data.titleEn))

  const created = await Initiative.create({
    ...fields,
    slug,
    createdByAdminId: admin._id,
    updatedByAdminId: admin._id,
  })

  // Only one initiative may be the site-wide spotlight ("На фокус").
  if (created.isFeatured) {
    await Initiative.updateMany(
      { _id: { $ne: created._id }, isFeatured: true },
      { $set: { isFeatured: false } },
    )
  }

  await writeAudit({
    actorAdminId: admin._id.toString(),
    actorDisplayName: admin.displayName,
    action: 'initiative.create',
    entityType: 'initiative',
    entityId: created._id.toString(),
    after: { titleBg: created.titleBg, status: created.status },
    ipAddress: getIp(req),
  })

  return NextResponse.json({ initiative: serializeInitiative(created.toObject()) }, { status: 201 })
}
