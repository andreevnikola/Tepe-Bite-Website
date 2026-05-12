import type { CourierProvider, PickupPointQuery, PickupPointResult } from './provider.interface'

/**
 * Speedy API provider — stub.
 * Full implementation requires SPEEDY_API_CLIENT_ID + SPEEDY_API_SECRET.
 * Throws a configuration error if credentials are absent.
 */
export class SpeedyApiCourierProvider implements CourierProvider {
  constructor() {
    if (!process.env.SPEEDY_API_CLIENT_ID || !process.env.SPEEDY_API_SECRET) {
      throw new Error(
        'SpeedyApiCourierProvider requires SPEEDY_API_CLIENT_ID and SPEEDY_API_SECRET env vars',
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPickupPoints(_: PickupPointQuery): Promise<PickupPointResult> {
    throw new Error('SpeedyApiCourierProvider is not yet implemented')
  }
}
