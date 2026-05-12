import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AdminUser } from './AdminUser.entity'

@Entity('admin_audit_logs')
export class AdminAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'uuid' })
  actorAdminId!: string

  @ManyToOne(() => AdminUser, { onDelete: 'RESTRICT' })
  actorAdmin!: AdminUser

  @Column({ type: 'varchar', length: 128 })
  actorAdminDisplayName!: string

  @Column({ type: 'varchar', length: 128 })
  action!: string

  @Column({ type: 'varchar', length: 64 })
  entityType!: string

  @Column({ type: 'varchar', length: 64 })
  entityId!: string

  @Column({ type: 'jsonb', nullable: true })
  before!: Record<string, unknown> | null

  @Column({ type: 'jsonb', nullable: true })
  after!: Record<string, unknown> | null

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress!: string | null

  @Column({ type: 'varchar', length: 512, nullable: true })
  userAgent!: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
