import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Order } from './Order.entity'
import { ProductPlan } from './ProductPlan.entity'

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'uuid' })
  orderId!: string

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  order!: Order

  @Column({ type: 'uuid', nullable: true })
  productPlanId!: string | null

  @ManyToOne(() => ProductPlan, { nullable: true, onDelete: 'SET NULL' })
  productPlan!: ProductPlan | null

  @Column({ type: 'varchar', length: 128 })
  productNameSnapshotBg!: string

  @Column({ type: 'varchar', length: 128 })
  productNameSnapshotEn!: string

  @Column({ type: 'int' })
  packSizeSnapshot!: number

  @Column({ type: 'int' })
  quantity!: number

  @Column({ type: 'int' })
  unitPriceSnapshotCents!: number

  @Column({ type: 'int' })
  lineTotalCents!: number

  @Column({ type: 'varchar', length: 3 })
  currency!: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
