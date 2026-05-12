import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum DeliveryStatus {
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity('email_logs')
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'uuid', nullable: true })
  orderId!: string | null

  @Column({ type: 'varchar', length: 255 })
  toEmail!: string

  @Column({ type: 'varchar', length: 64 })
  template!: string

  @Column({ type: 'varchar', length: 256 })
  subject!: string

  @Column({ type: 'enum', enum: DeliveryStatus })
  status!: DeliveryStatus

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerMessageId!: string | null

  @Column({ type: 'text', nullable: true })
  error!: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
