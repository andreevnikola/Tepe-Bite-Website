import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { getCurrentAdmin } from '@/lib/auth/session'

const f = createUploadthing()

/**
 * Single image route used for partner avatars, initiative covers and gallery
 * photos. Auth-gated: only a logged-in admin can upload.
 */
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '8MB', maxFileCount: 12 } })
    .middleware(async () => {
      const admin = await getCurrentAdmin()
      if (!admin) throw new UploadThingError('Unauthorized')
      return { adminId: admin._id.toString() }
    })
    .onUploadComplete(async ({ file }) => {
      // Returned to the client's onClientUploadComplete callback.
      return { url: file.ufsUrl, key: file.key }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
