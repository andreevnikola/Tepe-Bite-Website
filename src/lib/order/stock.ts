import { InventoryBatch } from '@/lib/db/entities/InventoryBatch.entity'
import {
  InventoryMovement,
  InventoryMovementType,
} from '@/lib/db/entities/InventoryMovement.entity'
import { OrderInventoryAllocation } from '@/lib/db/entities/OrderInventoryAllocation.entity'
import type { EntityManager } from 'typeorm'

export class InsufficientStockError extends Error {
  constructor(public readonly slug: string, public readonly required: number, public readonly available: number) {
    super(`Insufficient stock for "${slug}": required ${required} units, available ${available}`)
    this.name = 'InsufficientStockError'
  }
}

export type StockOrderItem = {
  id: string
  orderId: string
  productPlanSlug: string
  packSizeSnapshot: number
  quantity: number
}

/**
 * Reserve stock for order items.
 * FEFO/FIFO: earliest bestBeforeDate first (nulls last), then oldest createdAt.
 * Uses pessimistic row-level locks to prevent overselling.
 */
export async function reserveStock(
  manager: EntityManager,
  items: StockOrderItem[],
): Promise<OrderInventoryAllocation[]> {
  const allAllocations: OrderInventoryAllocation[] = []

  for (const item of items) {
    const unitsRequired = item.quantity * item.packSizeSnapshot

    // Load active batches with lock, FEFO then FIFO
    const batches = await manager
      .createQueryBuilder(InventoryBatch, 'b')
      .where('b.isActive = true')
      .andWhere(
        `(b.totalQuantity - b.reservedQuantity - b.fulfilledQuantity - b.removedQuantity) > 0`,
      )
      .orderBy('b.bestBeforeDate', 'ASC', 'NULLS LAST')
      .addOrderBy('b.createdAt', 'ASC')
      .setLock('pessimistic_write')
      .getMany()

    // Check total available
    const totalAvailable = batches.reduce(
      (sum, b) => sum + b.totalQuantity - b.reservedQuantity - b.fulfilledQuantity - b.removedQuantity,
      0,
    )

    if (totalAvailable < unitsRequired) {
      throw new InsufficientStockError(item.productPlanSlug, unitsRequired, totalAvailable)
    }

    let remaining = unitsRequired

    for (const batch of batches) {
      if (remaining <= 0) break

      const available =
        batch.totalQuantity - batch.reservedQuantity - batch.fulfilledQuantity - batch.removedQuantity
      if (available <= 0) continue

      const allocQty = Math.min(available, remaining)

      // Create allocation row
      const allocation = manager.create(OrderInventoryAllocation, {
        orderId: item.orderId,
        orderItemId: item.id,
        inventoryBatchId: batch.id,
        batchNameSnapshot: batch.name,
        batchLocationSnapshot: batch.location,
        batchResponsiblePersonSnapshot: batch.responsiblePerson,
        batchNumberSnapshot: batch.batchNumber,
        bestBeforeDateSnapshot: batch.bestBeforeDate,
        quantityReservedUnits: allocQty,
        quantityFulfilledUnits: 0,
        releasedAt: null,
        fulfilledAt: null,
        releaseReason: null,
        selectedByAdminId: null,
        selectedByAdminDisplayName: null,
      })
      await manager.save(allocation)
      allAllocations.push(allocation)

      // Update batch reserved quantity
      batch.reservedQuantity += allocQty
      await manager.save(batch)

      // Create inventory movement
      const movement = manager.create(InventoryMovement, {
        inventoryBatchId: batch.id,
        orderId: item.orderId,
        orderItemId: item.id,
        type: InventoryMovementType.STOCK_RESERVED,
        quantity: allocQty,
        note: null,
        createdByAdminUserId: null,
        createdByAdminDisplayName: null,
      })
      await manager.save(movement)

      remaining -= allocQty
    }
  }

  return allAllocations
}

/**
 * Release reserved stock back to available.
 * Called on order cancellation, expiry, or rollback.
 */
export async function releaseStock(
  manager: EntityManager,
  allocations: OrderInventoryAllocation[],
  reason: string,
): Promise<void> {
  const now = new Date()

  for (const alloc of allocations) {
    if (alloc.releasedAt !== null) continue // already released

    const batch = await manager
      .createQueryBuilder(InventoryBatch, 'b')
      .where('b.id = :id', { id: alloc.inventoryBatchId })
      .setLock('pessimistic_write')
      .getOne()

    if (batch) {
      batch.reservedQuantity = Math.max(0, batch.reservedQuantity - alloc.quantityReservedUnits)
      await manager.save(batch)
    }

    alloc.releasedAt = now
    alloc.releaseReason = reason
    await manager.save(alloc)

    if (batch) {
      const movement = manager.create(InventoryMovement, {
        inventoryBatchId: alloc.inventoryBatchId,
        orderId: alloc.orderId,
        orderItemId: alloc.orderItemId,
        type: InventoryMovementType.STOCK_RELEASED,
        quantity: alloc.quantityReservedUnits,
        note: reason,
        createdByAdminUserId: null,
        createdByAdminDisplayName: null,
      })
      await manager.save(movement)
    }
  }
}
