import { logSystem, LogSeverity } from '@/lib/admin/system-log'
import { validateEmailConfig } from '@/lib/config/validators/email.config'
import { getCourierProvider } from '@/lib/courier/factory'
import { isPickupPointVerified } from '@/lib/courier/types'
import { getDataSource } from '@/lib/db'
import { EmailLog, DeliveryStatus } from '@/lib/db/entities/EmailLog.entity'
import { NewsletterSubscriber } from '@/lib/db/entities/NewsletterSubscriber.entity'
import { ProductPlan } from '@/lib/db/entities/ProductPlan.entity'
import { sendEmail } from '@/lib/email/client'
import { buildConfirmationEmail } from '@/lib/email/templates/confirmation-email'
import { getPricingConfig } from '@/lib/config/pricing'
import { validateCheckoutConfig } from '@/lib/config/validators/checkout.config'
import { createOrder } from '@/lib/order/create'
import { InsufficientStockError } from '@/lib/order/stock'
import { rateLimiter } from '@/lib/rate-limit'
import { computePayloadHash, generateEmailRetryToken, hashToken } from '@/lib/tokens'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'

// ─── Zod schema ───────────────────────────────────────────────────────────────

const CartItemSchema = z.object({
  slug: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(99),
})

const DeliverySchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('speedy_locker'),
    lockerCode: z.string().min(1).max(32),
    lockerName: z.string().min(1).max(256),
    lockerAddress: z.string().min(1).max(512),
    lockerCity: z.string().min(1).max(128),
  }),
  z.object({
    method: z.literal('speedy_office'),
    officeCode: z.string().min(1).max(32),
    officeName: z.string().min(1).max(256),
    officeAddress: z.string().min(1).max(512),
    officeCity: z.string().min(1).max(128),
  }),
  z.object({
    method: z.literal('address'),
    city: z.string().min(1).max(128),
    postalCode: z.string().max(16).default(''),
    street: z.string().min(1).max(256),
    building: z.string().max(128).default(''),
    notes: z.string().max(512).default(''),
  }),
])

const OrderCreateSchema = z.object({
  website: z.string().optional(), // honeypot — any value allowed; checked explicitly below
  clientCheckoutId: z.string().min(1).max(128),
  clientCheckoutCreatedAt: z.string().datetime().optional(),
  language: z.enum(['bg', 'en']),
  firstName: z.string().min(1).max(128).transform((s) => s.trim()),
  lastName: z.string().min(1).max(128).transform((s) => s.trim()),
  email: z.email().max(255).transform((s) => s.trim().toLowerCase()),
  phone: z.string().min(5).max(32).transform((s) => s.trim()),
  cartItems: z.array(CartItemSchema).min(1).max(20),
  delivery: DeliverySchema,
  newsletterOptIn: z.boolean().default(false),
  legalAccepted: z.literal(true),
})

// ─── IP helper ────────────────────────────────────────────────────────────────

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getIp(req)
  const ua = req.headers.get('user-agent') ?? undefined

  // 1. Rate limit
  const rl = await rateLimiter.check(`order_create:${ip}`, 3, 3600)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  // 2. Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // 3. Validate with Zod
  const parsed = OrderCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const data = parsed.data

  // 4. Honeypot check
  if (data.website && data.website.length > 0) {
    await logSystem(LogSeverity.DANGER, 'honeypot.triggered', 'Honeypot field was filled — suspected bot submission', {
      ipAddress: ip,
      userAgent: ua,
    })
    // Generic success-like response
    return NextResponse.json({ status: 'pending', message: 'Order received.' })
  }

  // 5. Validate checkout config
  const cfgResult = validateCheckoutConfig()
  if (!cfgResult.valid) {
    return NextResponse.json(
      { error: 'Checkout configuration is not ready. Please try again later.' },
      { status: 503 },
    )
  }

  let pricing: ReturnType<typeof getPricingConfig>
  try {
    pricing = getPricingConfig()
  } catch {
    return NextResponse.json(
      { error: 'Checkout configuration is not ready. Please try again later.' },
      { status: 503 },
    )
  }

  // 6. Load and validate ProductPlans
  const ds = await getDataSource()
  const planRepo = ds.getRepository(ProductPlan)

  const slugs = data.cartItems.map((i) => i.slug)
  const plans = await planRepo
    .createQueryBuilder('p')
    .where('p.slug IN (:...slugs)', { slugs })
    .getMany()

  const planMap = new Map(plans.map((p) => [p.slug, p]))

  for (const cartItem of data.cartItems) {
    const plan = planMap.get(cartItem.slug)
    if (!plan) {
      return NextResponse.json(
        { error: `Product not found: ${cartItem.slug}` },
        { status: 422 },
      )
    }
    if (!plan.isActive || plan.priceCents <= 0) {
      return NextResponse.json(
        { error: `Product "${cartItem.slug}" is currently unavailable.` },
        { status: 422 },
      )
    }
  }

  // 7. Server-side price recomputation
  const subtotalCents = data.cartItems.reduce((sum, ci) => {
    const plan = planMap.get(ci.slug)!
    return sum + plan.priceCents * ci.quantity
  }, 0)

  const freeDeliveryApplied = subtotalCents >= pricing.delivery.freeDeliveryThresholdCents

  let deliveryBaseChargedCents: number
  let deliverySurchargeCents: number
  const deliveryBaseOriginalCents = pricing.delivery.baseLockerCents

  if (data.delivery.method === 'speedy_locker') {
    deliveryBaseChargedCents = freeDeliveryApplied ? 0 : pricing.delivery.baseLockerCents
    deliverySurchargeCents = 0
  } else if (data.delivery.method === 'speedy_office') {
    deliveryBaseChargedCents = freeDeliveryApplied ? 0 : pricing.delivery.baseLockerCents
    deliverySurchargeCents = pricing.delivery.officeSurchargeCents
  } else {
    deliveryBaseChargedCents = freeDeliveryApplied ? 0 : pricing.delivery.baseLockerCents
    deliverySurchargeCents = pricing.delivery.addressSurchargeCents
  }

  const totalCents = subtotalCents + deliveryBaseChargedCents + deliverySurchargeCents

  // 8. Server-side delivery validation
  const deliveryValidation = await validateDelivery(data.delivery)
  if (!deliveryValidation.ok) {
    return NextResponse.json({ error: deliveryValidation.error }, { status: 422 })
  }

  // 9. Idempotency check
  const normalizedPayload = JSON.stringify({
    cartItems: [...data.cartItems].sort((a, b) => a.slug.localeCompare(b.slug)),
    delivery: normalizeDelivery(data.delivery),
    emailHash: hashToken(data.email),
  })
  const payloadHash = computePayloadHash(normalizedPayload)

  const existingOrder = await ds.getRepository('orders').findOne({
    where: { clientCheckoutId: data.clientCheckoutId },
  }) as { checkoutPayloadHash: string; status: string; publicOrderNumber: string; emailRetryTokenHash: string | null; emailRetryTokenExpiresAt: Date | null } | null

  if (existingOrder) {
    if (existingOrder.checkoutPayloadHash === payloadHash) {
      const hasRetryToken =
        existingOrder.emailRetryTokenHash &&
        existingOrder.emailRetryTokenExpiresAt &&
        new Date(existingOrder.emailRetryTokenExpiresAt) > new Date()
      return NextResponse.json({
        status: existingOrder.emailRetryTokenHash ? 'email_failed' : 'check_email',
        publicOrderNumber: existingOrder.publicOrderNumber,
        ...(hasRetryToken ? { emailRetryToken: null } : {}),
      })
    } else {
      return NextResponse.json(
        { error: 'checkout_changed', message: 'Cart or delivery changed. Please start checkout again.' },
        { status: 409 },
      )
    }
  }

  // 10. Validate email config before attempting to create order
  const emailCfg = validateEmailConfig()
  if (!emailCfg.valid) {
    await logSystem(LogSeverity.DANGER, 'order.email_config_missing', 'Email config invalid at order creation time', {
      metadata: { issues: emailCfg.issues },
      ipAddress: ip,
    })
    return NextResponse.json(
      { error: 'Order system is temporarily unavailable. Please try again later.' },
      { status: 503 },
    )
  }

  const appBaseUrl = process.env.APP_BASE_URL!

  // 11. Create order in transaction (reserve stock + create records)
  let orderResult: Awaited<ReturnType<typeof createOrder>> | null = null

  try {
    orderResult = await ds.transaction(async (manager) => {
      return createOrder(manager, {
        clientCheckoutId: data.clientCheckoutId,
        clientCheckoutCreatedAt: data.clientCheckoutCreatedAt
          ? new Date(data.clientCheckoutCreatedAt)
          : new Date(),
        checkoutPayloadHash: payloadHash,
        language: data.language,
        customerFirstName: data.firstName,
        customerLastName: data.lastName,
        customerEmail: data.email,
        customerPhone: data.phone,
        cartItems: data.cartItems,
        delivery: data.delivery as Parameters<typeof createOrder>[1]['delivery'],
        newsletterOptIn: data.newsletterOptIn,
        legalTermsAcceptedAt: new Date(),
        plans: plans,
        deliveryBaseOriginalCents,
        deliveryBaseChargedCents,
        deliverySurchargeCents,
        freeDeliveryApplied,
        subtotalCents,
        totalCents,
      })
    })
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      await logSystem(LogSeverity.WARNING, 'order.insufficient_stock', err.message, {
        metadata: { slug: err.slug, required: err.required, available: err.available },
        ipAddress: ip,
      })
      return NextResponse.json(
        {
          error: 'insufficient_stock',
          message:
            data.language === 'bg'
              ? 'За съжаление, в момента нямаме достатъчно наличност. Количката е запазена.'
              : 'Unfortunately, we do not have enough stock available. Your cart has been preserved.',
        },
        { status: 409 },
      )
    }

    await logSystem(LogSeverity.DANGER, 'order.create_failed', 'Order transaction failed', {
      metadata: { error: err instanceof Error ? err.message : String(err) },
      ipAddress: ip,
    })
    return NextResponse.json({ error: 'Order creation failed. Please try again.' }, { status: 500 })
  }

  const { order, orderItems } = orderResult

  await logSystem(LogSeverity.INFORMATIONAL, 'order.created', `Order ${order.publicOrderNumber} created`, {
    relatedOrderId: order.id,
    ipAddress: ip,
  })

  // 12. Handle newsletter opt-in
  if (data.newsletterOptIn) {
    const consentText =
      data.language === 'bg'
        ? 'Искам да получавам имейли за новини, инициативи и специални предложения от ТЕПЕ bite.'
        : 'I want to receive emails about news, initiatives, and special offers from ТЕПЕ bite.'
    try {
      const subRepo = ds.getRepository(NewsletterSubscriber)
      const existing = await subRepo.findOne({ where: { email: data.email } })
      if (existing) {
        if (existing.unsubscribedAt) {
          existing.unsubscribedAt = null
          existing.consentedAt = new Date()
          existing.consentTextSnapshot = consentText
          await subRepo.save(existing)
        }
      } else {
        await subRepo.save(
          subRepo.create({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            source: 'checkout',
            language: data.language,
            consentTextSnapshot: consentText,
            consentedAt: new Date(),
            unsubscribedAt: null,
          }),
        )
      }
    } catch {
      // Non-fatal
    }
  }

  // 13. Send confirmation email (outside transaction)
  const emailData = buildConfirmationEmail({
    language: data.language,
    confirmationToken: orderResult.confirmationToken,
    publicOrderNumber: order.publicOrderNumber,
    customerFirstName: order.customerFirstName,
    customerLastName: order.customerLastName,
    items: orderItems.map((oi) => ({
      productNameSnapshotBg: oi.productNameSnapshotBg,
      productNameSnapshotEn: oi.productNameSnapshotEn,
      quantity: oi.quantity,
      unitPriceSnapshotCents: oi.unitPriceSnapshotCents,
      lineTotalCents: oi.lineTotalCents,
    })),
    subtotalCents,
    deliveryBaseChargedCents,
    deliverySurchargeCents,
    freeDeliveryApplied,
    totalCents,
    delivery: {
      method: data.delivery.method as 'speedy_locker' | 'speedy_office' | 'address',
      details: normalizeDelivery(data.delivery) as Record<string, unknown>,
    },
    appBaseUrl,
  })

  const emailResult = await sendEmail({
    to: order.customerEmail,
    subject: emailData.subject,
    html: emailData.html,
  })

  const emailLogRepo = ds.getRepository(EmailLog)

  if (emailResult.ok) {
    // Log email sent
    await emailLogRepo.save(
      emailLogRepo.create({
        orderId: order.id,
        toEmail: order.customerEmail,
        template: 'order_confirmation',
        subject: emailData.subject,
        status: DeliveryStatus.SENT,
        providerMessageId: emailResult.messageId || null,
        error: null,
      }),
    )

    return NextResponse.json({
      status: 'check_email',
      publicOrderNumber: order.publicOrderNumber,
    })
  } else {
    // Email failed — generate retry token and persist
    await emailLogRepo.save(
      emailLogRepo.create({
        orderId: order.id,
        toEmail: order.customerEmail,
        template: 'order_confirmation',
        subject: emailData.subject,
        status: DeliveryStatus.FAILED,
        providerMessageId: null,
        error: emailResult.error,
      }),
    )

    const { rawToken: retryRaw, hash: retryHash, expiresAt: retryExpiry } = generateEmailRetryToken()

    const orderRepo = ds.getRepository('orders')
    await orderRepo.update(order.id, {
      emailRetryTokenHash: retryHash,
      emailRetryTokenExpiresAt: retryExpiry,
    })

    await logSystem(LogSeverity.DANGER, 'order.email_failed', `Confirmation email failed for order ${order.publicOrderNumber}`, {
      relatedOrderId: order.id,
      metadata: { error: emailResult.error },
      ipAddress: ip,
    })

    return NextResponse.json({
      status: 'email_failed',
      publicOrderNumber: order.publicOrderNumber,
      emailRetryToken: retryRaw,
    })
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeDelivery(delivery: z.infer<typeof DeliverySchema>): Record<string, unknown> {
  if (delivery.method === 'speedy_locker') {
    return {
      method: delivery.method,
      lockerCode: delivery.lockerCode,
      lockerName: delivery.lockerName,
      lockerAddress: delivery.lockerAddress,
      lockerCity: delivery.lockerCity,
    }
  }
  if (delivery.method === 'speedy_office') {
    return {
      method: delivery.method,
      officeCode: delivery.officeCode,
      officeName: delivery.officeName,
      officeAddress: delivery.officeAddress,
      officeCity: delivery.officeCity,
    }
  }
  return {
    method: delivery.method,
    city: delivery.city,
    postalCode: delivery.postalCode,
    street: delivery.street,
    building: delivery.building,
    notes: delivery.notes,
  }
}

async function validateDelivery(
  delivery: z.infer<typeof DeliverySchema>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const isProduction = process.env.NODE_ENV === 'production'

  if (delivery.method === 'speedy_locker' || delivery.method === 'speedy_office') {
    const city = delivery.method === 'speedy_locker' ? delivery.lockerCity : delivery.officeCity
    const code = delivery.method === 'speedy_locker' ? delivery.lockerCode : delivery.officeCode
    const type = delivery.method === 'speedy_locker' ? ('locker' as const) : ('office' as const)

    try {
      const provider = getCourierProvider()
      const result = await provider.getPickupPoints({ city, type, verifiedOnly: false })

      const point = result.points.find((p) => p.code === code)
      if (!point) {
        return {
          ok: false,
          error:
            delivery.method === 'speedy_locker'
              ? 'Selected locker could not be verified. Please choose a different pickup point.'
              : 'Selected office could not be verified. Please choose a different pickup point.',
        }
      }

      if (point.city.toLowerCase() !== city.toLowerCase()) {
        return { ok: false, error: 'Pickup point city does not match selected city.' }
      }

      if (isProduction && !isPickupPointVerified(point)) {
        return {
          ok: false,
          error: 'Selected pickup point data is outdated. Please select a different location.',
        }
      }
    } catch {
      return { ok: false, error: 'Could not verify delivery location. Please try again.' }
    }
  }

  if (delivery.method === 'address') {
    const city = delivery.city.trim().toLowerCase()
    if (city !== 'plovdiv' && city !== 'пловдив') {
      return {
        ok: false,
        error:
          'Address delivery is currently available only in Plovdiv. / В момента доставката до адрес е активна само за Пловдив.',
      }
    }
  }

  return { ok: true }
}
