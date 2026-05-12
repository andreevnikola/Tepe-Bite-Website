import "reflect-metadata";
import { DataSource } from "typeorm";
import { AdminAuditLog } from "./entities/AdminAuditLog.entity";
import { AdminInviteToken } from "./entities/AdminInviteToken.entity";
import { AdminUser } from "./entities/AdminUser.entity";
import { EmailLog } from "./entities/EmailLog.entity";
import { InventoryBatch } from "./entities/InventoryBatch.entity";
import { InventoryMovement } from "./entities/InventoryMovement.entity";
import { NewsletterSubscriber } from "./entities/NewsletterSubscriber.entity";
import { Order } from "./entities/Order.entity";
import { OrderAdminNote } from "./entities/OrderAdminNote.entity";
import { OrderInventoryAllocation } from "./entities/OrderInventoryAllocation.entity";
import { OrderItem } from "./entities/OrderItem.entity";
import { OrderStatusHistory } from "./entities/OrderStatusHistory.entity";
import { ProductPlan } from "./entities/ProductPlan.entity";
import { SystemLog } from "./entities/SystemLog.entity";
import { TelegramNotificationLog } from "./entities/TelegramNotificationLog.entity";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const ENTITIES = [
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
] as const;

const globalForDb = globalThis as unknown as { _dataSource?: DataSource };

function buildDataSource(): DataSource {
  return new DataSource({
    type: "postgres",
    url: process.env.POSTGRESQL_URL,
    entities: [...ENTITIES],
    synchronize: false,
    ssl:
      process.env.POSTGRES_SSL === "true"
        ? {
            rejectUnauthorized:
              process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== "false",
          }
        : false,
    poolSize: parseInt(process.env.DB_POOL_SIZE ?? "5", 10),
  });
}

export async function getDataSource(): Promise<DataSource> {
  if (globalForDb._dataSource?.isInitialized) {
    // In dev, Turbopack HMR can cause entity class identity mismatch.
    // Detect by probing metadata on a known entity.
    if (process.env.NODE_ENV !== "production") {
      try {
        globalForDb._dataSource.getMetadata(ProductPlan);
      } catch {
        // Stale singleton — destroy and reinitialize with fresh entity refs.
        await globalForDb._dataSource.destroy().catch(() => {});
        globalForDb._dataSource = undefined;
      }
    } else {
      return globalForDb._dataSource;
    }
  }

  if (globalForDb._dataSource?.isInitialized) {
    return globalForDb._dataSource;
  }

  const ds = buildDataSource();
  await ds.initialize();
  globalForDb._dataSource = ds;
  return ds;
}
