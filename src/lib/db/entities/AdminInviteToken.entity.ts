import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AdminRole, AdminUser } from './AdminUser.entity'

@Entity('admin_invite_tokens')
export class AdminInviteToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 64 })
  tokenHash!: string

  @Column({ type: 'enum', enum: AdminRole })
  roleToCreate!: AdminRole

  @Column({ type: 'uuid' })
  createdByAdminUserId!: string

  @ManyToOne(() => AdminUser)
  createdByAdminUser!: AdminUser

  @Column({ type: 'timestamp' })
  expiresAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  usedAt!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  revokedAt!: Date | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
