import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  OPERATOR = 'operator',
}

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 64, unique: true })
  username!: string

  @Column({ type: 'varchar', length: 128 })
  displayName!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null

  @Column({ type: 'varchar', length: 256 })
  passwordHash!: string

  @Column({ type: 'enum', enum: AdminRole })
  role!: AdminRole

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt!: Date | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date
}
