import type { CourierPickupPoint, PickupPointType } from './types'

export type PickupPointQuery = {
  city: string
  type: PickupPointType
  /** If true, return only points that pass the 90-day verification check. */
  verifiedOnly: boolean
}

export type PickupPointResult = {
  points: CourierPickupPoint[]
  supportedCities: string[]
}

export interface CourierProvider {
  getPickupPoints(query: PickupPointQuery): Promise<PickupPointResult>
}
