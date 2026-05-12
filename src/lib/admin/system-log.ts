import { LogSeverity, SystemLog } from '@/lib/db/entities/SystemLog.entity'
import { sanitizeForLog } from '@/lib/sanitize'

export type SystemLogOptions = {
  metadata?: Record<string, unknown>
  relatedOrderId?: string
  ipAddress?: string
  userAgent?: string
  requestId?: string
}

export async function logSystem(
  severity: LogSeverity,
  type: string,
  message: string,
  opts?: SystemLogOptions,
): Promise<void> {
  try {
    const { getDataSource } = await import('@/lib/db')
    const ds = await getDataSource()
    const repo = ds.getRepository(SystemLog)
    const entry = repo.create({
      severity,
      type,
      message,
      metadata: opts?.metadata
        ? (sanitizeForLog(opts.metadata) as Record<string, unknown>)
        : null,
      relatedOrderId: opts?.relatedOrderId ?? null,
      ipAddress: opts?.ipAddress ?? null,
      userAgent: opts?.userAgent ?? null,
      requestId: opts?.requestId ?? null,
      relatedAdminUserId: null,
    })
    await repo.save(entry)
  } catch {
    // Never throw from log helpers
  }
}

export { LogSeverity }
