import { OrderItemsRepository } from '@/domain/ecommerce/application/repositories/order-items-repository'
import type { OrderItem } from '@/domain/ecommerce/enterprise/entities/order-item'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderItemMapper } from '../mappers/prisma-order-item-mapper'

@Injectable()
export class PrismaOrderItemsRepository implements OrderItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(orderItems: OrderItem[]): Promise<void> {
    if (orderItems.length === 0) {
      return
    }

    // const data = orderItems.map(item => ({
    //   orderId: item.orderId.toString(),
    //   productId: item.productId.toString(),
    //   quantity: item.quantity,
    //   price: item.price,
    // }))

    const data = orderItems.map(PrismaOrderItemMapper.toPersistence)

    await this.prisma.orderItem.createMany({
      data,
    })
  }

  async deleteMany(orderItems: OrderItem[]): Promise<void> {
    if (orderItems.length === 0) {
      return
    }

    const orderIds = orderItems.map(item => item.orderId.toString())
    const productIds = orderItems.map(item => item.productId.toString())

    await this.prisma.orderItem.deleteMany({
      where: {
        orderId: {
          in: orderIds,
        },
        productId: {
          in: productIds,
        },
      },
    })
  }

  async findManyByOrderId(orderId: string): Promise<OrderItem[]> {
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        orderId,
      },
    })

    return orderItems.map(PrismaOrderItemMapper.toDomain)
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    await this.prisma.orderItem.deleteMany({
      where: {
        orderId,
      },
    })
  }
}
