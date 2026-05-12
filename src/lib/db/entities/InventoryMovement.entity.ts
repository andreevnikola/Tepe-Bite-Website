import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { InventoryBatch } from './InventoryBatch.entity'

export enum InventoryMovementType {
  STOCK_ADDED = 'stock_added',
  STOCK_RESERVED = 'stock_reserved',
  STOCK_RELEASED = 'stock_released',
  STOCK_FULFILLED = 'stock_fulfilled',
  STOCK_REMOVED = 'stock_removed',
  STOCK_ADJUSTED = 'stock_adjusted',
}

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  /** Non-nullable: batches are archived, never hard-deleted. */
  @Index()
  @Column({ type: 'uuid' })
  inventoryBatchId!: string

  @ManyToOne(() => InventoryBatch, { onDelete: 'RESTRICT' })
  inventoryBatch!: InventoryBatch

  @Index()
  @Column({ type: 'uuid', nullable: true })
  orderId!: string | null

  @Column({ type: 'uuid', nullable: true })
  orderItemId!: string | null

  @Column({ type: 'enum', enum: InventoryMovementType })
  type!: InventoryMovementType

  @Column({ type: 'int' })
  quantity!: number

  @Column({ type: 'text', nullable: true })
  note!: string | null

  @Column({ type: 'uuid', nullable: true })
  createdByAdminUserId!: string | null

  @Column({ type: 'varchar', length: 128, nullable: true })
  createdByAdminDisplayName!: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
