import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('newsletter_subscribers')
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 128 })
  firstName!: string

  @Column({ type: 'varchar', length: 128 })
  lastName!: string

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone!: string | null

  @Column({ type: 'varchar', length: 32 })
  source!: string

  @Column({ type: 'varchar', length: 8 })
  language!: string

  @Column({ type: 'text' })
  consentTextSnapshot!: string

  @Column({ type: 'timestamp' })
  consentedAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  unsubscribedAt!: Date | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
