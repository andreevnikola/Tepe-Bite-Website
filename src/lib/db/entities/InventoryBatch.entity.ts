import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('inventory_batches')
export class InventoryBatch {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 128 })
  name!: string

  @Column({ type: 'varchar', length: 255 })
  location!: string

  @Column({ type: 'varchar', length: 128 })
  responsiblePerson!: string

  @Column({ type: 'varchar', length: 64, nullable: true })
  batchNumber!: string | null

  @Column({ type: 'date', nullable: true })
  bestBeforeDate!: Date | null

  @Column({ type: 'text', nullable: true })
  notes!: string | null

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @Column({ type: 'int', default: 0 })
  totalQuantity!: number

  @Column({ type: 'int', default: 0 })
  reservedQuantity!: number

  @Column({ type: 'int', default: 0 })
  fulfilledQuantity!: number

  @Column({ type: 'int', default: 0 })
  removedQuantity!: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
