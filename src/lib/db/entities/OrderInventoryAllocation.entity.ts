import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { InventoryBatch } from './InventoryBatch.entity'
import { Order } from './Order.entity'
import { OrderItem } from './OrderItem.entity'

@Entity('order_inventory_allocations')
export class OrderInventoryAllocation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'uuid' })
  orderId!: string

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  order!: Order

  @Index()
  @Column({ type: 'uuid' })
  orderItemId!: string

  @ManyToOne(() => OrderItem, { onDelete: 'RESTRICT' })
  orderItem!: OrderItem

  /** Non-nullable: batches are archived, never hard-deleted. */
  @Index()
  @Column({ type: 'uuid' })
  inventoryBatchId!: string

  @ManyToOne(() => InventoryBatch, { onDelete: 'RESTRICT' })
  inventoryBatch!: InventoryBatch

  @Column({ type: 'varchar', length: 128 })
  batchNameSnapshot!: string

  @Column({ type: 'varchar', length: 255 })
  batchLocationSnapshot!: string

  @Column({ type: 'varchar', length: 128 })
  batchResponsiblePersonSnapshot!: string

  @Column({ type: 'varchar', length: 64, nullable: true })
  batchNumberSnapshot!: string | null

  @Column({ type: 'date', nullable: true })
  bestBeforeDateSnapshot!: Date | null

  @Column({ type: 'int' })
  quantityReservedUnits!: number

  @Column({ type: 'int', default: 0 })
  quantityFulfilledUnits!: number

  @Column({ type: 'timestamp', nullable: true })
  releasedAt!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  fulfilledAt!: Date | null

  @Column({ type: 'varchar', length: 64, nullable: true })
  releaseReason!: string | null

  @Column({ type: 'uuid', nullable: true })
  selectedByAdminId!: string | null

  @Column({ type: 'varchar', length: 128, nullable: true })
  selectedByAdminDisplayName!: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
