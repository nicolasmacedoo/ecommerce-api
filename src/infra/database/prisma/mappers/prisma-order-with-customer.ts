import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item'
import { OrderWithCustomer } from '@/domain/ecommerce/enterprise/entities/value-objects/order-with-customer'
import {
  Order as PrismaOrder,
  Customer as PrismaCustomer,
  OrderItem as PrismaOrderItem,
} from '@prisma/client'

type PrismaOrderWithCustomer = PrismaOrder & {
  customer: PrismaCustomer
  orderItems: PrismaOrderItem[]
}

export class PrismaOrderWithCustomerMapper {
  public static toDomain(raw: PrismaOrderWithCustomer): OrderWithCustomer {
    return OrderWithCustomer.create({
      orderId: raw.id,
      customerId: raw.customerId,
      customerName: raw.customer.fullName,
      customerContact: raw.customer.contact,
      customerAddress: raw.customer.address,
      orderTotalAmount: Number(raw.totalAmount),
      orderStatus: raw.status,
      orderDate: raw.date,
      items: raw.orderItems.map(item =>
        OrderItem.create({
          orderId: new UniqueEntityID(item.orderId),
          productId: new UniqueEntityID(item.productId),
          quantity: item.quantity,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        })
      ),
    })
  }
}
