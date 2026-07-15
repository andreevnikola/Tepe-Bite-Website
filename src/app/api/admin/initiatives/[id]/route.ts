import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getMongoose } from '@/lib/mongo'
import { Initiative } from '@/lib/mongo/models/Initiative'
import { serializeInitiative } from '@/lib/dashboard/serialize'
import { composeInitiativeFields } from '@/lib/dashboard/initiative-writer'
import { writeAudit } from '@/lib/dashboard/audit'
import { deleteUploads } from '@/lib/uploadthing/server'
import { getIp } from '@/lib/dashboard/http'
import { InitiativeCreateSchema } from '@/lib/dashboard/validation'

export const runtime = 'nodejs'

function isValidId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function imageKeys(doc: any): string[] {
  const keys: string[] = []
  if (doc?.coverImage?.key) keys.push(doc.coverImage.key)
  for (const g of doc?.gallery ?? []) if (g?.key) keys.push(g.key)
  return keys
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
  const doc = await Initiative.findById(id).lean()
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ initiative: serializeInitiative(doc) })
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

  const parsed = InitiativeCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  await getMongoose()
  const doc = await Initiative.findById(id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const oldKeys = new Set(imageKeys(doc))

  const { fields } = await composeInitiativeFields(parsed.data)
  // Slug and ownership are preserved across edits.
  Object.assign(doc, fields)
  doc.updatedByAdminId = admin._id
  await doc.save()

  // Only one initiative may be the site-wide spotlight ("На фокус").
  if (doc.isFeatured) {
    await Initiative.updateMany(
      { _id: { $ne: doc._id }, isFeatured: true },
      { $set: { isFeatured: false } },
    )
  }

  // Delete blobs that are no longer referenced.
  const newKeys = new Set(imageKeys(doc))
  const removed = [...oldKeys].filter((k) => !newKeys.has(k))
  if (removed.length) await deleteUploads(removed)

  await writeAudit({
    actorAdminId: admin._id.toString(),
    actorDisplayName: admin.displayName,
    action: 'initiative.update',
    entityType: 'initiative',
    entityId: id,
    ipAddress: getIp(req),
  })

  return NextResponse.json({ initiative: serializeInitiative(doc.toObject()) })
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
  const doc = await Initiative.findById(id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const keys = imageKeys(doc)
  await doc.deleteOne()
  if (keys.length) await deleteUploads(keys)

  await writeAudit({
    actorAdminId: admin._id.toString(),
    actorDisplayName: admin.displayName,
    action: 'initiative.delete',
    entityType: 'initiative',
    entityId: id,
    before: { titleBg: doc.titleBg },
    ipAddress: getIp(req),
  })

  return NextResponse.json({ ok: true })
}
