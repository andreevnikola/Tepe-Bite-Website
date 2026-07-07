import 'server-only'
import { UTApi } from 'uploadthing/server'

export const utapi = new UTApi()

/** Best-effort deletion of UploadThing blobs by key. Never throws. */
export async function deleteUploads(keys: (string | null | undefined)[]): Promise<void> {
  const valid = keys.filter((k): k is string => Boolean(k))
  if (valid.length === 0) return
  try {
    await utapi.deleteFiles(valid)
  } catch {
    // Non-fatal: an orphaned blob is preferable to a failed CRUD operation.
  }
}
