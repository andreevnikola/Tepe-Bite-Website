import { ALL_PLOVDIV_POINTS } from './data/manual-speedy-locations.plovdiv'
import type { CourierProvider, PickupPointQuery, PickupPointResult } from './provider.interface'
import { isPickupPointVerified } from './types'

const SUPPORTED_CITIES = ['Plovdiv']

export class ManualCourierProvider implements CourierProvider {
  async getPickupPoints(query: PickupPointQuery): Promise<PickupPointResult> {
    const cityNorm = query.city.trim().toLowerCase()
    const now = new Date()

    let points = ALL_PLOVDIV_POINTS.filter(
      (p) => p.city.toLowerCase() === cityNorm && p.type === query.type,
    )

    if (query.verifiedOnly) {
      points = points.filter((p) => isPickupPointVerified(p, now))
    }

    return { points, supportedCities: SUPPORTED_CITIES }
  }
}
