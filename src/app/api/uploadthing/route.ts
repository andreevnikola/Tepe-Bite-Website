import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from '@/lib/uploadthing/core'

export const runtime = 'nodejs'

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})
