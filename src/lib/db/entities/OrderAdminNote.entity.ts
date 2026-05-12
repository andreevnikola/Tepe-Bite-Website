import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AdminUser } from './AdminUser.entity'
import { Order } from './Order.entity'

@Entity('order_admin_notes')
export class OrderAdminNote {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'uuid' })
  orderId!: string

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  order!: Order

  @Column({ type: 'uuid' })
  adminUserId!: string

  @ManyToOne(() => AdminUser, { onDelete: 'RESTRICT' })
  adminUser!: AdminUser

  @Column({ type: 'varchar', length: 128 })
  adminDisplayNameSnapshot!: string

  @Column({ type: 'text' })
  note!: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
