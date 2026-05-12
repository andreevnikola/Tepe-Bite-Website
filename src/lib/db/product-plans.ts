// Server-only — never import this in client components. No TypeORM in client code.
import { ProductPlan } from './entities/ProductPlan.entity'

export type SafeProductPlan = {
  id: string
  slug: string
  titleBg: string
  titleEn: string
  packSize: number
  descriptionBg: string
  descriptionEn: string
  priceCents: number
  currency: string
  isActive: boolean
  sortOrder: number
}

function toSafe(p: ProductPlan): SafeProductPlan {
  return {
    id: p.id,
    slug: p.slug,
    titleBg: p.titleBg,
    titleEn: p.titleEn,
    packSize: p.packSize,
    descriptionBg: p.descriptionBg,
    descriptionEn: p.descriptionEn,
    priceCents: p.priceCents,
    currency: p.currency,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
  }
}

export async function getAllProductPlans(): Promise<SafeProductPlan[]> {
  try {
    const { getDataSource } = await import('@/lib/db')
    const ds = await getDataSource()
    const repo = ds.getRepository(ProductPlan)
    const plans = await repo.find({ order: { sortOrder: 'ASC' } })
    return plans.map(toSafe)
  } catch {
    return []
  }
}

export async function getProductPlanBySlug(slug: string): Promise<SafeProductPlan | null> {
  try {
    const { getDataSource } = await import('@/lib/db')
    const ds = await getDataSource()
    const repo = ds.getRepository(ProductPlan)
    const plan = await repo.findOne({ where: { slug } })
    return plan ? toSafe(plan) : null
  } catch {
    return null
  }
}
