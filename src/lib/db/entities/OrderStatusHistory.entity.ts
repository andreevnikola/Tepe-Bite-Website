import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Order, OrderStatus } from './Order.entity'

export enum ChangedByType {
  SYSTEM = 'system',
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'uuid' })
  orderId!: string

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  order!: Order

  @Column({ type: 'enum', enum: OrderStatus, nullable: true })
  fromStatus!: OrderStatus | null

  @Column({ type: 'enum', enum: OrderStatus })
  toStatus!: OrderStatus

  @Column({ type: 'enum', enum: ChangedByType })
  changedByType!: ChangedByType

  @Column({ type: 'uuid', nullable: true })
  changedByAdminId!: string | null

  @Column({ type: 'varchar', length: 128, nullable: true })
  changedByAdminDisplayName!: string | null

  @Column({ type: 'text', nullable: true })
  note!: string | null

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
