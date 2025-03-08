import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item'
import type { OrderItem as PrismaOrderItem, Prisma } from '@prisma/client'

export class PrismaOrderItemMapper {
  public static toDomain(raw: PrismaOrderItem): OrderItem {
    return OrderItem.create({
      orderId: new UniqueEntityID(raw.orderId),
      productId: new UniqueEntityID(raw.productId),
      quantity: raw.quantity,
      price: Number(raw.price),
    })
  }

  public static toPersistence(
    orderItem: OrderItem
  ): Prisma.OrderItemUncheckedCreateInput {
    return {
      orderId: orderItem.orderId.toString(),
      productId: orderItem.productId.toString(),
      quantity: orderItem.quantity,
      price: orderItem.price,
      subtotal: orderItem.subtotal,
    }
  }
}
