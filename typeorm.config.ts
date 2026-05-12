import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { AdminAuditLog } from './src/lib/db/entities/AdminAuditLog.entity'
import { AdminInviteToken } from './src/lib/db/entities/AdminInviteToken.entity'
import { AdminUser } from './src/lib/db/entities/AdminUser.entity'
import { EmailLog } from './src/lib/db/entities/EmailLog.entity'
import { InventoryBatch } from './src/lib/db/entities/InventoryBatch.entity'
import { InventoryMovement } from './src/lib/db/entities/InventoryMovement.entity'
import { NewsletterSubscriber } from './src/lib/db/entities/NewsletterSubscriber.entity'
import { Order } from './src/lib/db/entities/Order.entity'
import { OrderAdminNote } from './src/lib/db/entities/OrderAdminNote.entity'
import { OrderInventoryAllocation } from './src/lib/db/entities/OrderInventoryAllocation.entity'
import { OrderItem } from './src/lib/db/entities/OrderItem.entity'
import { OrderStatusHistory } from './src/lib/db/entities/OrderStatusHistory.entity'
import { ProductPlan } from './src/lib/db/entities/ProductPlan.entity'
import { SystemLog } from './src/lib/db/entities/SystemLog.entity'
import { TelegramNotificationLog } from './src/lib/db/entities/TelegramNotificationLog.entity'
import { InitialSchema1747008000001 } from './src/lib/db/migrations/001_initial_schema'
import { SeedProductPlans1747008000002 } from './src/lib/db/migrations/002_seed_product_plans'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRESQL_URL,
  entities: [
    AdminUser,
    AdminInviteToken,
    ProductPlan,
    Order,
    OrderItem,
    OrderStatusHistory,
    OrderAdminNote,
    OrderInventoryAllocation,
    InventoryBatch,
    InventoryMovement,
    NewsletterSubscriber,
    AdminAuditLog,
    EmailLog,
    TelegramNotificationLog,
    SystemLog,
  ],
  migrations: [InitialSchema1747008000001, SeedProductPlans1747008000002],
  synchronize: false,
  ssl:
    process.env.POSTGRES_SSL === 'true'
      ? {
          rejectUnauthorized:
            process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== 'false',
        }
      : false,
  poolSize: parseInt(process.env.DB_POOL_SIZE ?? '5', 10),
})

export default dataSource
