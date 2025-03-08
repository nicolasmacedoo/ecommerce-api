import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CustomersRepository } from '@/domain/ecommerce/application/repositories/customers-repository'
import type { Customer } from '@/domain/ecommerce/enterprise/entities/customer'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaCustomerWithEmailMapper } from '../mappers/prisma-customer-with-email'
import type { CustomerWithEmail } from '@/domain/ecommerce/enterprise/entities/value-objects/customer-with-email'

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: PaginationParams): Promise<Customer[]> {
    const { page, query } = params

    const customers = await this.prisma.customer.findMany({
      where: {
        fullName: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return customers.map(PrismaCustomerMapper.toDomain)
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findByIdWithEmail(id: string): Promise<CustomerWithEmail | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerWithEmailMapper.toDomain(customer)
  }

  async findManyWithEmail({
    page,
    query,
  }: PaginationParams): Promise<CustomerWithEmail[]> {
    const customers = await this.prisma.customer.findMany({
      where: {
        user: {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return customers.map(PrismaCustomerWithEmailMapper.toDomain)
  }

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(customer)

    await this.prisma.customer.create({
      data,
    })
  }

  async save(entity: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(entity)

    await this.prisma.customer.update({
      where: {
        id: entity.id.toString(),
      },
      data,
    })
  }

  async delete(entity: Customer): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.customer.delete({
        where: {
          id: entity.id.toString(),
        },
      }),
      this.prisma.user.delete({
        where: {
          id: entity.userId.toString(),
        },
      }),
    ])
  }
}
