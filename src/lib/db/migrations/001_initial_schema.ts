import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialSchema1747008000001 implements MigrationInterface {
  name = 'InitialSchema1747008000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enums
    await queryRunner.query(`
      CREATE TYPE "admin_role_enum" AS ENUM ('super_admin', 'admin', 'operator')
    `)
    await queryRunner.query(`
      CREATE TYPE "order_status_enum" AS ENUM (
        'pending_email_confirmation',
        'email_confirmation_expired',
        'confirmed_awaiting_processing',
        'processing',
        'ready_for_courier',
        'handed_to_courier',
        'delivered',
        'cancelled_before_handoff',
        'uncollected_return_pending',
        'returned',
        'failed'
      )
    `)
    await queryRunner.query(`
      CREATE TYPE "delivery_method_enum" AS ENUM ('speedy_locker', 'speedy_office', 'address')
    `)
    await queryRunner.query(`
      CREATE TYPE "changed_by_type_enum" AS ENUM ('system', 'customer', 'admin')
    `)
    await queryRunner.query(`
      CREATE TYPE "log_severity_enum" AS ENUM ('informational', 'warning', 'danger')
    `)
    await queryRunner.query(`
      CREATE TYPE "delivery_status_enum" AS ENUM ('sent', 'failed')
    `)
    await queryRunner.query(`
      CREATE TYPE "inventory_movement_type_enum" AS ENUM (
        'stock_added',
        'stock_reserved',
        'stock_released',
        'stock_fulfilled',
        'stock_removed',
        'stock_adjusted'
      )
    `)

    // Order sequence (starts at 1001)
    await queryRunner.query(`CREATE SEQUENCE "order_seq" START 1001 INCREMENT 1`)

    // admin_users
    await queryRunner.query(`
      CREATE TABLE "admin_users" (
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "username"      VARCHAR(64)  NOT NULL,
        "displayName"   VARCHAR(128) NOT NULL,
        "email"         VARCHAR(255),
        "passwordHash"  VARCHAR(256) NOT NULL,
        "role"          "admin_role_enum" NOT NULL,
        "isActive"      BOOLEAN NOT NULL DEFAULT TRUE,
        "lastLoginAt"   TIMESTAMP,
        "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "uq_admin_users_username" UNIQUE ("username")
      )
    `)

    // admin_invite_tokens
    await queryRunner.query(`
      CREATE TABLE "admin_invite_tokens" (
        "id"                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "tokenHash"             VARCHAR(64)  NOT NULL,
        "roleToCreate"          "admin_role_enum" NOT NULL,
        "createdByAdminUserId"  UUID NOT NULL REFERENCES "admin_users"("id") ON DELETE RESTRICT,
        "expiresAt"             TIMESTAMP NOT NULL,
        "usedAt"                TIMESTAMP,
        "revokedAt"             TIMESTAMP,
        "createdAt"             TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    // product_plans
    await queryRunner.query(`
      CREATE TABLE "product_plans" (
        "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "slug"            VARCHAR(64)  NOT NULL,
        "titleBg"         VARCHAR(128) NOT NULL,
        "titleEn"         VARCHAR(128) NOT NULL,
        "packSize"        INT          NOT NULL,
        "descriptionBg"   TEXT         NOT NULL,
        "descriptionEn"   TEXT         NOT NULL,
        "priceCents"      INT          NOT NULL,
        "currency"        VARCHAR(3)   NOT NULL,
        "isActive"        BOOLEAN      NOT NULL DEFAULT FALSE,
        "sortOrder"       INT          NOT NULL DEFAULT 0,
        "createdAt"       TIMESTAMP    NOT NULL DEFAULT NOW(),
        "updatedAt"       TIMESTAMP    NOT NULL DEFAULT NOW(),
        CONSTRAINT "uq_product_plans_slug" UNIQUE ("slug")
      )
    `)

    // inventory_batches
    await queryRunner.query(`
      CREATE TABLE "inventory_batches" (
        "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name"                VARCHAR(128) NOT NULL,
        "location"            VARCHAR(255) NOT NULL,
        "responsiblePerson"   VARCHAR(128) NOT NULL,
        "batchNumber"         VARCHAR(64),
        "bestBeforeDate"      DATE,
        "notes"               TEXT,
        "isActive"            BOOLEAN NOT NULL DEFAULT TRUE,
        "totalQuantity"       INT     NOT NULL DEFAULT 0,
        "reservedQuantity"    INT     NOT NULL DEFAULT 0,
        "fulfilledQuantity"   INT     NOT NULL DEFAULT 0,
        "removedQuantity"     INT     NOT NULL DEFAULT 0,
        "createdAt"           TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt"           TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    // orders
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id"                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "publicOrderNumber"           VARCHAR(32)  NOT NULL,
        "publicTrackingId"            VARCHAR(64)  NOT NULL,
        "clientCheckoutId"            VARCHAR(128) NOT NULL,
        "clientCheckoutCreatedAt"     TIMESTAMP,
        "checkoutPayloadHash"         VARCHAR(64)  NOT NULL,
        "status"                      "order_status_enum" NOT NULL,
        "language"                    VARCHAR(8)   NOT NULL,
        "customerFirstName"           VARCHAR(128) NOT NULL,
        "customerLastName"            VARCHAR(128) NOT NULL,
        "customerEmail"               VARCHAR(255) NOT NULL,
        "customerPhone"               VARCHAR(32)  NOT NULL,
        "deliveryMethod"              "delivery_method_enum" NOT NULL,
        "deliveryDetails"             JSONB        NOT NULL,
        "subtotalCents"               INT          NOT NULL,
        "deliveryBaseOriginalCents"   INT          NOT NULL,
        "deliveryBaseChargedCents"    INT          NOT NULL,
        "deliverySurchargeCents"      INT          NOT NULL,
        "discountCents"               INT          NOT NULL DEFAULT 0,
        "totalCents"                  INT          NOT NULL,
        "currency"                    VARCHAR(3)   NOT NULL,
        "freeDeliveryApplied"         BOOLEAN      NOT NULL DEFAULT FALSE,
        "paymentMethod"               VARCHAR(32)  NOT NULL,
        "legalTermsAcceptedAt"        TIMESTAMP    NOT NULL,
        "privacyAcknowledgedAt"       TIMESTAMP,
        "newsletterOptIn"             BOOLEAN      NOT NULL DEFAULT FALSE,
        "confirmationTokenHash"       VARCHAR(64),
        "confirmationTokenExpiresAt"  TIMESTAMP,
        "emailRetryTokenHash"         VARCHAR(64),
        "emailRetryTokenExpiresAt"    TIMESTAMP,
        "confirmedAt"                 TIMESTAMP,
        "trackingEmailSentAt"         TIMESTAMP,
        "speedyTrackingNumber"        VARCHAR(64),
        "speedyTrackingUrl"           VARCHAR(512),
        "handedToCourierAt"           TIMESTAMP,
        "deliveredAt"                 TIMESTAMP,
        "cancelledAt"                 TIMESTAMP,
        "createdAt"                   TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt"                   TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "uq_orders_publicOrderNumber"  UNIQUE ("publicOrderNumber"),
        CONSTRAINT "uq_orders_publicTrackingId"   UNIQUE ("publicTrackingId"),
        CONSTRAINT "uq_orders_clientCheckoutId"   UNIQUE ("clientCheckoutId")
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_orders_status"                ON "orders" ("status")`)
    await queryRunner.query(`CREATE INDEX "idx_orders_customerEmail"         ON "orders" ("customerEmail")`)
    await queryRunner.query(`CREATE INDEX "idx_orders_confirmationTokenHash" ON "orders" ("confirmationTokenHash") WHERE "confirmationTokenHash" IS NOT NULL`)
    await queryRunner.query(`CREATE INDEX "idx_orders_emailRetryTokenHash"   ON "orders" ("emailRetryTokenHash")   WHERE "emailRetryTokenHash" IS NOT NULL`)

    // order_items
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id"                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "orderId"                   UUID         NOT NULL REFERENCES "orders"("id") ON DELETE RESTRICT,
        "productPlanId"             UUID         REFERENCES "product_plans"("id") ON DELETE SET NULL,
        "productNameSnapshotBg"     VARCHAR(128) NOT NULL,
        "productNameSnapshotEn"     VARCHAR(128) NOT NULL,
        "packSizeSnapshot"          INT          NOT NULL,
        "quantity"                  INT          NOT NULL,
        "unitPriceSnapshotCents"    INT          NOT NULL,
        "lineTotalCents"            INT          NOT NULL,
        "currency"                  VARCHAR(3)   NOT NULL,
        "createdAt"                 TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_order_items_orderId" ON "order_items" ("orderId")`)

    // order_inventory_allocations
    await queryRunner.query(`
      CREATE TABLE "order_inventory_allocations" (
        "id"                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "orderId"                         UUID         NOT NULL REFERENCES "orders"("id") ON DELETE RESTRICT,
        "orderItemId"                     UUID         NOT NULL REFERENCES "order_items"("id") ON DELETE RESTRICT,
        "inventoryBatchId"                UUID         NOT NULL REFERENCES "inventory_batches"("id") ON DELETE RESTRICT,
        "batchNameSnapshot"               VARCHAR(128) NOT NULL,
        "batchLocationSnapshot"           VARCHAR(255) NOT NULL,
        "batchResponsiblePersonSnapshot"  VARCHAR(128) NOT NULL,
        "batchNumberSnapshot"             VARCHAR(64),
        "bestBeforeDateSnapshot"          DATE,
        "quantityReservedUnits"           INT          NOT NULL,
        "quantityFulfilledUnits"          INT          NOT NULL DEFAULT 0,
        "releasedAt"                      TIMESTAMP,
        "fulfilledAt"                     TIMESTAMP,
        "releaseReason"                   VARCHAR(64),
        "selectedByAdminId"               UUID,
        "selectedByAdminDisplayName"      VARCHAR(128),
        "createdAt"                       TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt"                       TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_oia_orderId"           ON "order_inventory_allocations" ("orderId")`)
    await queryRunner.query(`CREATE INDEX "idx_oia_orderItemId"       ON "order_inventory_allocations" ("orderItemId")`)
    await queryRunner.query(`CREATE INDEX "idx_oia_inventoryBatchId"  ON "order_inventory_allocations" ("inventoryBatchId")`)

    // inventory_movements
    await queryRunner.query(`
      CREATE TABLE "inventory_movements" (
        "id"                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "inventoryBatchId"          UUID         NOT NULL REFERENCES "inventory_batches"("id") ON DELETE RESTRICT,
        "orderId"                   UUID,
        "orderItemId"               UUID,
        "type"                      "inventory_movement_type_enum" NOT NULL,
        "quantity"                  INT          NOT NULL,
        "note"                      TEXT,
        "createdByAdminUserId"      UUID,
        "createdByAdminDisplayName" VARCHAR(128),
        "createdAt"                 TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_inventory_movements_batchId"  ON "inventory_movements" ("inventoryBatchId")`)
    await queryRunner.query(`CREATE INDEX "idx_inventory_movements_orderId"   ON "inventory_movements" ("orderId") WHERE "orderId" IS NOT NULL`)

    // order_status_history
    await queryRunner.query(`
      CREATE TABLE "order_status_history" (
        "id"                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "orderId"                   UUID         NOT NULL REFERENCES "orders"("id") ON DELETE RESTRICT,
        "fromStatus"                "order_status_enum",
        "toStatus"                  "order_status_enum" NOT NULL,
        "changedByType"             "changed_by_type_enum" NOT NULL,
        "changedByAdminId"          UUID,
        "changedByAdminDisplayName" VARCHAR(128),
        "note"                      TEXT,
        "metadata"                  JSONB,
        "createdAt"                 TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_order_status_history_orderId" ON "order_status_history" ("orderId")`)

    // order_admin_notes
    await queryRunner.query(`
      CREATE TABLE "order_admin_notes" (
        "id"                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "orderId"                 UUID         NOT NULL REFERENCES "orders"("id") ON DELETE RESTRICT,
        "adminUserId"             UUID         NOT NULL REFERENCES "admin_users"("id") ON DELETE RESTRICT,
        "adminDisplayNameSnapshot" VARCHAR(128) NOT NULL,
        "note"                    TEXT         NOT NULL,
        "createdAt"               TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_order_admin_notes_orderId" ON "order_admin_notes" ("orderId")`)

    // newsletter_subscribers
    await queryRunner.query(`
      CREATE TABLE "newsletter_subscribers" (
        "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email"               VARCHAR(255) NOT NULL,
        "firstName"           VARCHAR(128) NOT NULL,
        "lastName"            VARCHAR(128) NOT NULL,
        "phone"               VARCHAR(32),
        "source"              VARCHAR(32)  NOT NULL,
        "language"            VARCHAR(8)   NOT NULL,
        "consentTextSnapshot" TEXT         NOT NULL,
        "consentedAt"         TIMESTAMP    NOT NULL,
        "unsubscribedAt"      TIMESTAMP,
        "createdAt"           TIMESTAMP    NOT NULL DEFAULT NOW(),
        "updatedAt"           TIMESTAMP    NOT NULL DEFAULT NOW(),
        CONSTRAINT "uq_newsletter_subscribers_email" UNIQUE ("email")
      )
    `)

    // admin_audit_logs
    await queryRunner.query(`
      CREATE TABLE "admin_audit_logs" (
        "id"                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "actorAdminId"          UUID         NOT NULL REFERENCES "admin_users"("id") ON DELETE RESTRICT,
        "actorAdminDisplayName" VARCHAR(128) NOT NULL,
        "action"                VARCHAR(128) NOT NULL,
        "entityType"            VARCHAR(64)  NOT NULL,
        "entityId"              VARCHAR(64)  NOT NULL,
        "before"                JSONB,
        "after"                 JSONB,
        "ipAddress"             VARCHAR(45),
        "userAgent"             VARCHAR(512),
        "createdAt"             TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_admin_audit_logs_actorAdminId" ON "admin_audit_logs" ("actorAdminId")`)

    // email_logs
    await queryRunner.query(`
      CREATE TABLE "email_logs" (
        "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "orderId"           UUID,
        "toEmail"           VARCHAR(255) NOT NULL,
        "template"          VARCHAR(64)  NOT NULL,
        "subject"           VARCHAR(256) NOT NULL,
        "status"            "delivery_status_enum" NOT NULL,
        "providerMessageId" VARCHAR(255),
        "error"             TEXT,
        "createdAt"         TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_email_logs_orderId" ON "email_logs" ("orderId") WHERE "orderId" IS NOT NULL`)

    // telegram_notification_logs
    await queryRunner.query(`
      CREATE TABLE "telegram_notification_logs" (
        "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "orderId"     UUID,
        "systemLogId" UUID,
        "eventType"   VARCHAR(64) NOT NULL,
        "status"      "delivery_status_enum" NOT NULL,
        "error"       TEXT,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_telegram_logs_orderId" ON "telegram_notification_logs" ("orderId") WHERE "orderId" IS NOT NULL`)

    // system_logs
    await queryRunner.query(`
      CREATE TABLE "system_logs" (
        "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "severity"            "log_severity_enum" NOT NULL,
        "type"                VARCHAR(128) NOT NULL,
        "message"             TEXT         NOT NULL,
        "metadata"            JSONB,
        "relatedOrderId"      UUID,
        "relatedAdminUserId"  UUID,
        "requestId"           VARCHAR(64),
        "ipAddress"           VARCHAR(45),
        "userAgent"           VARCHAR(512),
        "createdAt"           TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    await queryRunner.query(`CREATE INDEX "idx_system_logs_severity"       ON "system_logs" ("severity")`)
    await queryRunner.query(`CREATE INDEX "idx_system_logs_type"           ON "system_logs" ("type")`)
    await queryRunner.query(`CREATE INDEX "idx_system_logs_relatedOrderId" ON "system_logs" ("relatedOrderId") WHERE "relatedOrderId" IS NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "system_logs"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "telegram_notification_logs"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "email_logs"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_audit_logs"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "newsletter_subscribers"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "order_admin_notes"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "order_status_history"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_movements"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "order_inventory_allocations"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "order_items"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_batches"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "product_plans"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_invite_tokens"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_users"`)
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "order_seq"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "inventory_movement_type_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "delivery_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "log_severity_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "changed_by_type_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "delivery_method_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "order_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "admin_role_enum"`)
  }
}
