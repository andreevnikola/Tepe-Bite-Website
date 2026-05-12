import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('product_plans')
export class ProductPlan {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 64, unique: true })
  slug!: string

  @Column({ type: 'varchar', length: 128 })
  titleBg!: string

  @Column({ type: 'varchar', length: 128 })
  titleEn!: string

  @Column({ type: 'int' })
  packSize!: number

  @Column({ type: 'text' })
  descriptionBg!: string

  @Column({ type: 'text' })
  descriptionEn!: string

  /** EUR cents. If 0, plan is unavailable at runtime. */
  @Column({ type: 'int' })
  priceCents!: number

  @Column({ type: 'varchar', length: 3 })
  currency!: string

  @Column({ type: 'boolean', default: false })
  isActive!: boolean

  @Column({ type: 'int', default: 0 })
  sortOrder!: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
