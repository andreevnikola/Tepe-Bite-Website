import { DeliveryMethod, Order, OrderStatus } from '@/lib/db/entities/Order.entity'
import { OrderInventoryAllocation } from '@/lib/db/entities/OrderInventoryAllocation.entity'
import { OrderItem } from '@/lib/db/entities/OrderItem.entity'
import { OrderStatusHistory } from '@/lib/db/entities/OrderStatusHistory.entity'
import { ChangedByType } from '@/lib/db/entities/OrderStatusHistory.entity'
import { ProductPlan } from '@/lib/db/entities/ProductPlan.entity'
import { generateConfirmationToken } from '@/lib/tokens'
import type { EntityManager } from 'typeorm'
import { reserveStock } from './stock'

export type CartItemInput = {
  slug: string
  quantity: number
}

export type DeliveryDetailsInput =
  | { method: 'speedy_locker'; lockerCode: string; lockerName: string; lockerAddress: string; lockerCity: string }
  | { method: 'speedy_office'; officeCode: string; officeName: string; officeAddress: string; officeCity: string }
  | { method: 'address'; city: string; postalCode: string; street: string; building: string; notes: string }

export type CreateOrderInput = {
  clientCheckoutId: string
  clientCheckoutCreatedAt: Date
  checkoutPayloadHash: string
  language: 'bg' | 'en'
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  cartItems: CartItemInput[]
  delivery: DeliveryDetailsInput
  newsletterOptIn: boolean
  legalTermsAcceptedAt: Date
  plans: ProductPlan[]
  deliveryBaseOriginalCents: number
  deliveryBaseChargedCents: number
  deliverySurchargeCents: number
  freeDeliveryApplied: boolean
  subtotalCents: number
  totalCents: number
}

export type CreateOrderResult = {
  order: Order
  orderItems: OrderItem[]
  allocations: OrderInventoryAllocation[]
  confirmationToken: string
}

export async function createOrder(
  manager: EntityManager,
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  // Generate order number using DB sequence
  const seqResult = await manager.query(`SELECT nextval('order_seq') AS seq`)
  const seq = seqResult[0].seq as number
  const publicOrderNumber = `TEPE-${seq}`
  const { randomUUID } = await import('crypto')
  const publicTrackingId = randomUUID()

  const { rawToken, hash, expiresAt } = generateConfirmationToken()

  // Determine delivery details jsonb
  let deliveryDetails: Record<string, unknown>
  let deliveryMethod: DeliveryMethod
  const d = input.delivery
  if (d.method === 'speedy_locker') {
    deliveryMethod = DeliveryMethod.SPEEDY_LOCKER
    deliveryDetails = {
      lockerCode: d.lockerCode,
      lockerName: d.lockerName,
      lockerAddress: d.lockerAddress,
      lockerCity: d.lockerCity,
    }
  } else if (d.method === 'speedy_office') {
    deliveryMethod = DeliveryMethod.SPEEDY_OFFICE
    deliveryDetails = {
      officeCode: d.officeCode,
      officeName: d.officeName,
      officeAddress: d.officeAddress,
      officeCity: d.officeCity,
    }
  } else {
    deliveryMethod = DeliveryMethod.ADDRESS
    deliveryDetails = {
      city: d.city,
      postalCode: d.postalCode,
      street: d.street,
      building: d.building,
      notes: d.notes,
    }
  }

  // Create order
  const order = manager.create(Order, {
    publicOrderNumber,
    publicTrackingId,
    clientCheckoutId: input.clientCheckoutId,
    clientCheckoutCreatedAt: input.clientCheckoutCreatedAt,
    checkoutPayloadHash: input.checkoutPayloadHash,
    status: OrderStatus.PENDING_EMAIL_CONFIRMATION,
    language: input.language,
    customerFirstName: input.customerFirstName,
    customerLastName: input.customerLastName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    deliveryMethod,
    deliveryDetails,
    subtotalCents: input.subtotalCents,
    deliveryBaseOriginalCents: input.deliveryBaseOriginalCents,
    deliveryBaseChargedCents: input.deliveryBaseChargedCents,
    deliverySurchargeCents: input.deliverySurchargeCents,
    discountCents: 0,
    totalCents: input.totalCents,
    currency: 'EUR',
    freeDeliveryApplied: input.freeDeliveryApplied,
    paymentMethod: 'cash_on_delivery',
    legalTermsAcceptedAt: input.legalTermsAcceptedAt,
    privacyAcknowledgedAt: input.legalTermsAcceptedAt,
    newsletterOptIn: input.newsletterOptIn,
    confirmationTokenHash: hash,
    confirmationTokenExpiresAt: expiresAt,
    emailRetryTokenHash: null,
    emailRetryTokenExpiresAt: null,
    confirmedAt: null,
    trackingEmailSentAt: null,
    speedyTrackingNumber: null,
    speedyTrackingUrl: null,
    handedToCourierAt: null,
    deliveredAt: null,
    cancelledAt: null,
  })
  await manager.save(order)

  // Create order items
  const orderItems: OrderItem[] = []
  const planMap = new Map(input.plans.map((p) => [p.slug, p]))

  for (const cartItem of input.cartItems) {
    const plan = planMap.get(cartItem.slug)!
    const lineTotalCents = plan.priceCents * cartItem.quantity

    const item = manager.create(OrderItem, {
      orderId: order.id,
      productPlanId: plan.id,
      productNameSnapshotBg: plan.titleBg,
      productNameSnapshotEn: plan.titleEn,
      packSizeSnapshot: plan.packSize,
      quantity: cartItem.quantity,
      unitPriceSnapshotCents: plan.priceCents,
      lineTotalCents,
      currency: 'EUR',
    })
    await manager.save(item)
    orderItems.push(item)
  }

  // Reserve stock
  const stockItems = orderItems.map((item) => ({
    id: item.id,
    orderId: order.id,
    productPlanSlug: planMap.get(
      input.cartItems[orderItems.indexOf(item)].slug,
    )?.slug ?? '',
    packSizeSnapshot: item.packSizeSnapshot,
    quantity: item.quantity,
  }))

  const allocations = await reserveStock(manager, stockItems)

  // Create status history entry
  const history = manager.create(OrderStatusHistory, {
    orderId: order.id,
    fromStatus: null,
    toStatus: OrderStatus.PENDING_EMAIL_CONFIRMATION,
    changedByType: ChangedByType.SYSTEM,
    changedByAdminId: null,
    changedByAdminDisplayName: null,
    note: null,
    metadata: null,
  })
  await manager.save(history)

  return { order, orderItems, allocations, confirmationToken: rawToken }
}
