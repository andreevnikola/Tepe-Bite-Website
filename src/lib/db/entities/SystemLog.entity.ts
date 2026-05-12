import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum LogSeverity {
  INFORMATIONAL = 'informational',
  WARNING = 'warning',
  DANGER = 'danger',
}

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'enum', enum: LogSeverity })
  severity!: LogSeverity

  @Index()
  @Column({ type: 'varchar', length: 128 })
  type!: string

  @Column({ type: 'text' })
  message!: string

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null

  @Index()
  @Column({ type: 'uuid', nullable: true })
  relatedOrderId!: string | null

  @Column({ type: 'uuid', nullable: true })
  relatedAdminUserId!: string | null

  @Column({ type: 'varchar', length: 64, nullable: true })
  requestId!: string | null

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress!: string | null

  @Column({ type: 'varchar', length: 512, nullable: true })
  userAgent!: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date
}
