import { logSystem, LogSeverity } from '@/lib/admin/system-log'
import { getDataSource } from '@/lib/db'
import { DeliveryStatus, EmailLog } from '@/lib/db/entities/EmailLog.entity'
import { Order } from '@/lib/db/entities/Order.entity'
import { OrderItem } from '@/lib/db/entities/OrderItem.entity'
import { sendEmail } from '@/lib/email/client'
import { buildConfirmationEmail } from '@/lib/email/templates/confirmation-email'
import { rateLimiter } from '@/lib/rate-limit'
import { generateConfirmationToken, generateEmailRetryToken, hashToken } from '@/lib/tokens'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getIp(req)

  // 1. Rate limit
  const rl = await rateLimiter.check(`resend_confirmation:${ip}`, 3, 3600)
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

  const emailRetryToken =
    body && typeof body === 'object' && 'emailRetryToken' in body
      ? (body as Record<string, unknown>).emailRetryToken
      : undefined

  if (!emailRetryToken || typeof emailRetryToken !== 'string' || emailRetryToken.trim() === '') {
    return NextResponse.json({ error: 'Missing emailRetryToken' }, { status: 400 })
  }

  // 3. Hash and find order
  const tokenHash = hashToken(emailRetryToken.trim())
  const ds = await getDataSource()
  const orderRepo = ds.getRepository(Order)

  const order = await orderRepo.findOne({ where: { emailRetryTokenHash: tokenHash } })

  if (!order) {
    return NextResponse.json({ error: 'Invalid or expired retry token.' }, { status: 404 })
  }

  // 4. Verify not expired
  if (!order.emailRetryTokenExpiresAt || order.emailRetryTokenExpiresAt < new Date()) {
    return NextResponse.json(
      {
        error: 'retry_token_expired',
        message:
          order.language === 'bg'
            ? 'Времето за повторно изпращане изтече. Свържете се с нас на tepe@mail.bg.'
            : 'The retry window has expired. Please contact us at tepe@mail.bg.',
      },
      { status: 410 },
    )
  }

  // 5. Load order items for email
  const itemRepo = ds.getRepository(OrderItem)
  const orderItems = await itemRepo.find({ where: { orderId: order.id } })

  const appBaseUrl = process.env.APP_BASE_URL ?? 'http://localhost:3000'

  // 6. Generate fresh confirmation token
  const { rawToken: newConfirmRaw, hash: newConfirmHash, expiresAt: newConfirmExpiry } =
    generateConfirmationToken()

  // 7. Build and attempt to send email
  const emailData = buildConfirmationEmail({
    language: (order.language as 'bg' | 'en') ?? 'bg',
    confirmationToken: newConfirmRaw,
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
    subtotalCents: order.subtotalCents,
    deliveryBaseChargedCents: order.deliveryBaseChargedCents,
    deliverySurchargeCents: order.deliverySurchargeCents,
    freeDeliveryApplied: order.freeDeliveryApplied,
    totalCents: order.totalCents,
    delivery: {
      method: order.deliveryMethod as 'speedy_locker' | 'speedy_office' | 'address',
      details: order.deliveryDetails,
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
    // 8a. Email succeeded — store new confirmation token, clear retry token
    await orderRepo.update(order.id, {
      confirmationTokenHash: newConfirmHash,
      confirmationTokenExpiresAt: newConfirmExpiry,
      emailRetryTokenHash: null,
      emailRetryTokenExpiresAt: null,
    })

    await emailLogRepo.save(
      emailLogRepo.create({
        orderId: order.id,
        toEmail: order.customerEmail,
        template: 'order_confirmation_retry',
        subject: emailData.subject,
        status: DeliveryStatus.SENT,
        providerMessageId: emailResult.messageId || null,
        error: null,
      }),
    )

    return NextResponse.json({ status: 'email_sent' })
  } else {
    // 8b. Email failed again — keep retry token valid (or issue a new one)
    const { rawToken: newRetryRaw, hash: newRetryHash, expiresAt: newRetryExpiry } =
      generateEmailRetryToken()

    await orderRepo.update(order.id, {
      emailRetryTokenHash: newRetryHash,
      emailRetryTokenExpiresAt: newRetryExpiry,
    })

    await emailLogRepo.save(
      emailLogRepo.create({
        orderId: order.id,
        toEmail: order.customerEmail,
        template: 'order_confirmation_retry',
        subject: emailData.subject,
        status: DeliveryStatus.FAILED,
        providerMessageId: null,
        error: emailResult.error,
      }),
    )

    await logSystem(
      LogSeverity.DANGER,
      'order.email_failed',
      `Retry confirmation email also failed for order ${order.publicOrderNumber}`,
      {
        relatedOrderId: order.id,
        metadata: { error: emailResult.error },
        ipAddress: ip,
      },
    )

    return NextResponse.json({
      status: 'email_failed_again',
      emailRetryToken: newRetryRaw,
      message:
        order.language === 'bg'
          ? 'Изпращането на имейла отново не успя. Свържете се с нас на tepe@mail.bg.'
          : 'Email sending failed again. Please contact us at tepe@mail.bg.',
    })
  }
}
