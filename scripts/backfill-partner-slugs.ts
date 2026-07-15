/**
 * One-time backfill: give every existing Partner a unique SEO slug so the
 * public partner pages (/initiatives/partners/[slug]) can resolve them.
 * New partners get a slug automatically on create; this covers legacy docs.
 *
 * Usage: npm run partners:backfill-slugs
 * Safe to re-run — partners that already have a slug are skipped.
 */
import mongoose from 'mongoose'
import { getMongoose } from '../src/lib/mongo'
import { Partner } from '../src/lib/mongo/models/Partner'

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'partner'
  )
}

async function uniqueSlug(baseName: string, excludeId: string): Promise<string> {
  const base = slugify(baseName)
  let slug = base
  let n = 1
  while (await Partner.exists({ slug, _id: { $ne: excludeId } })) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}

async function main() {
  await getMongoose()

  const partners = await Partner.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
  })

  if (partners.length === 0) {
    console.log('✓ All partners already have a slug — nothing to do.')
  } else {
    for (const p of partners) {
      p.slug = await uniqueSlug(p.nameEn || p.nameBg, p._id.toString())
      await p.save()
      console.log(`✓ ${p.nameBg} → ${p.slug}`)
    }
    console.log(`\nDone. Backfilled ${partners.length} partner(s).`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
