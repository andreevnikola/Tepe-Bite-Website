import 'server-only'
import { Partner } from '@/lib/mongo/models/Partner'
import { slugify } from './initiative-writer'

/** SEO slug from the (English) partner name, made unique across partners. */
export async function uniquePartnerSlug(baseName: string, excludeId?: string): Promise<string> {
  const base = slugify(baseName) || 'partner'
  let slug = base
  let n = 1
  // eslint-disable-next-line no-await-in-loop
  while (await Partner.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}
