import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Order } from '@/domain/ecommerce/enterprise/entities/order'
import { OrdersRepository } from '@/domain/ecommerce/application/repositories/orders-repository'
import { PrismaService } from '../prisma.service'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { OrderItemsRepository } from '@/domain/ecommerce/application/repositories/order-items-repository'
import { Injectable } from '@nestjs/common'
import type { OrderWithCustomer } from '@/domain/ecommerce/enterprise/entities/value-objects/order-with-customer'
import { PrismaOrderWithCustomerMapper } from '../mappers/prisma-order-with-customer'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderItemsRepository: OrderItemsRepository
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItems: true,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findMany({ page }: PaginationParams): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        date: 'desc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyRecentWithCustomer({
    page,
    query,
  }: PaginationParams): Promise<OrderWithCustomer[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        customer: {
          fullName: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        customer: true,
        orderItems: true,
      },
      skip: (page - 1) * 10,
      take: 10,
    })

    return orders.map(PrismaOrderWithCustomerMapper.toDomain)
  }

  async create(entity: Order): Promise<void> {
    const data = PrismaOrderMapper.toPersistence(entity)

    await this.prisma.order.create({
      data,
    })

    await this.orderItemsRepository.createMany(entity.items.getItems())
  }

  async save(entity: Order): Promise<void> {
    const data = PrismaOrderMapper.toPersistence(entity)

    await Promise.all([
      this.prisma.order.update({
        where: {
          id: entity.id.toString(),
        },
        data,
      }),

      this.orderItemsRepository.deleteMany(entity.items.getRemovedItems()),
      this.orderItemsRepository.createMany(entity.items.getItems()),
    ])
  }

  async delete(entity: Order): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: entity.id.toString(),
      },
    })

    await this.orderItemsRepository.deleteManyByOrderId(entity.id.toString())
  }
}
