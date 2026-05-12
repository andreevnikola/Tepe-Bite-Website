import { getCourierProvider } from '@/lib/courier/factory'
import type { PickupPointType } from '@/lib/courier/types'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const VALID_TYPES: PickupPointType[] = ['locker', 'office']

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl

  const city = searchParams.get('city')?.trim()
  const type = searchParams.get('type')?.trim() as PickupPointType | undefined

  if (!city) {
    return NextResponse.json({ error: 'Missing required query param: city' }, { status: 400 })
  }
  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `Missing or invalid query param: type. Allowed values: ${VALID_TYPES.join(', ')}` },
      { status: 400 },
    )
  }

  const isProduction = process.env.NODE_ENV === 'production'

  try {
    const provider = getCourierProvider()
    const result = await provider.getPickupPoints({
      city,
      type,
      verifiedOnly: isProduction,
    })

    return NextResponse.json({
      points: result.points,
      city,
      type,
      supportedCities: result.supportedCities,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    const isConfig = message.includes('not allowed') || message.includes('requires')

    if (isConfig) {
      return NextResponse.json({ error: 'Courier provider configuration error' }, { status: 503 })
    }

    return NextResponse.json({ error: 'Failed to load pickup points' }, { status: 500 })
  }
}
