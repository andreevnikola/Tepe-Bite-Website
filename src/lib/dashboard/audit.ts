import 'server-only'
import { getMongoose } from '@/lib/mongo'
import { AdminAuditLog } from '@/lib/mongo/models/AdminAuditLog'

/** Write an audit-trail entry. Best-effort — never blocks the mutation. */
export async function writeAudit(input: {
  actorAdminId: string
  actorDisplayName: string
  action: string
  entityType: 'initiative' | 'partner'
  entityId: string
  before?: unknown
  after?: unknown
  ipAddress?: string | null
}): Promise<void> {
  try {
    await getMongoose()
    await AdminAuditLog.create({
      actorAdminId: input.actorAdminId,
      actorDisplayName: input.actorDisplayName,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      before: input.before ?? null,
      after: input.after ?? null,
      ipAddress: input.ipAddress ?? null,
    })
  } catch {
    // Non-fatal.
  }
}
