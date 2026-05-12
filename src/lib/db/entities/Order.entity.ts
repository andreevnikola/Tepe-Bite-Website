import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum OrderStatus {
  PENDING_EMAIL_CONFIRMATION = 'pending_email_confirmation',
  EMAIL_CONFIRMATION_EXPIRED = 'email_confirmation_expired',
  CONFIRMED_AWAITING_PROCESSING = 'confirmed_awaiting_processing',
  PROCESSING = 'processing',
  READY_FOR_COURIER = 'ready_for_courier',
  HANDED_TO_COURIER = 'handed_to_courier',
  DELIVERED = 'delivered',
  CANCELLED_BEFORE_HANDOFF = 'cancelled_before_handoff',
  UNCOLLECTED_RETURN_PENDING = 'uncollected_return_pending',
  RETURNED = 'returned',
  FAILED = 'failed',
}

export enum DeliveryMethod {
  SPEEDY_LOCKER = 'speedy_locker',
  SPEEDY_OFFICE = 'speedy_office',
  ADDRESS = 'address',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 32 })
  publicOrderNumber!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  publicTrackingId!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 128 })
  clientCheckoutId!: string

  @Column({ type: 'timestamp', nullable: true })
  clientCheckoutCreatedAt!: Date | null

  @Column({ type: 'varchar', length: 64 })
  checkoutPayloadHash!: string

  @Index()
  @Column({ type: 'enum', enum: OrderStatus })
  status!: OrderStatus

  @Column({ type: 'varchar', length: 8 })
  language!: string

  @Column({ type: 'varchar', length: 128 })
  customerFirstName!: string

  @Column({ type: 'varchar', length: 128 })
  customerLastName!: string

  @Index()
  @Column({ type: 'varchar', length: 255 })
  customerEmail!: string

  @Column({ type: 'varchar', length: 32 })
  customerPhone!: string

  @Column({ type: 'enum', enum: DeliveryMethod })
  deliveryMethod!: DeliveryMethod

  @Column({ type: 'jsonb' })
  deliveryDetails!: Record<string, unknown>

  @Column({ type: 'int' })
  subtotalCents!: number

  @Column({ type: 'int' })
  deliveryBaseOriginalCents!: number

  @Column({ type: 'int' })
  deliveryBaseChargedCents!: number

  @Column({ type: 'int' })
  deliverySurchargeCents!: number

  @Column({ type: 'int', default: 0 })
  discountCents!: number

  @Column({ type: 'int' })
  totalCents!: number

  @Column({ type: 'varchar', length: 3 })
  currency!: string

  @Column({ type: 'boolean', default: false })
  freeDeliveryApplied!: boolean

  @Column({ type: 'varchar', length: 32 })
  paymentMethod!: string

  @Column({ type: 'timestamp' })
  legalTermsAcceptedAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  privacyAcknowledgedAt!: Date | null

  @Column({ type: 'boolean', default: false })
  newsletterOptIn!: boolean

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true })
  confirmationTokenHash!: string | null

  @Column({ type: 'timestamp', nullable: true })
  confirmationTokenExpiresAt!: Date | null

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true })
  emailRetryTokenHash!: string | null

  @Column({ type: 'timestamp', nullable: true })
  emailRetryTokenExpiresAt!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  trackingEmailSentAt!: Date | null

  @Column({ type: 'varchar', length: 64, nullable: true })
  speedyTrackingNumber!: string | null

  @Column({ type: 'varchar', length: 512, nullable: true })
  speedyTrackingUrl!: string | null

  @Column({ type: 'timestamp', nullable: true })
  handedToCourierAt!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt!: Date | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
