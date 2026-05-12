import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DeliveryStatus } from './EmailLog.entity'

@Entity('telegram_notification_logs')
export class TelegramNotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'uuid', nullable: true })
  orderId!: string | null

  @Column({ type: 'uuid', nullable: true })
  systemLogId!: string | null

  @Column({ type: 'varchar', length: 64 })
  eventType!: string

  @Column({ type: 'enum', enum: DeliveryStatus })
  status!: DeliveryStatus

  @Column({ type: 'text', nullable: true })
  error!: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
