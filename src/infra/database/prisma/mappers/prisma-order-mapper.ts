import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/ecommerce/enterprise/entities/order'
import { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item'
import { OrderItemsList } from '@/domain/ecommerce/enterprise/entities/order-items-list'
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Prisma,
} from '@prisma/client'

type PrismaOrderWithItems = PrismaOrder & {
  orderItems: PrismaOrderItem[]
}

export class PrismaOrderMapper {
  public static toDomain(raw: PrismaOrderWithItems): Order {
    return Order.create(
      {
        customerId: new UniqueEntityID(raw.customerId),
        status: raw.status,
        date: raw.date,
        totalAmount: Number(raw.totalAmount),
        items: new OrderItemsList(
          raw.orderItems.map(item =>
            OrderItem.create({
              orderId: new UniqueEntityID(item.orderId),
              productId: new UniqueEntityID(item.productId),
              quantity: item.quantity,
              price: Number(item.price),
              subtotal: Number(item.subtotal),
            })
          )
        ),
      },
      new UniqueEntityID(raw.id)
    )
  }

  // public static toDomain(raw: PrismaOrder): Order {
  //   return Order.create(
  //     {
  //       customerId: new UniqueEntityID(raw.customerId),
  //       status: raw.status,
  //       date: raw.date,
  //       totalAmount: Number(raw.totalAmount),
  //       items: new OrderItemsList(),
  //     },
  //     new UniqueEntityID(raw.id)
  //   )
  // }

  public static toPersistence(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      customerId: order.customerId.toString(),
      status: order.status,
      date: order.date,
      totalAmount: order.totalAmount,
    }
  }
}
