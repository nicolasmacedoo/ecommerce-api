import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CustomersRepository } from '@/domain/ecommerce/application/repositories/customers-repository'
import type { Customer } from '@/domain/ecommerce/enterprise/entities/customer'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPersistence(customer)

    await this.prisma.customer.create({
      data,
    })
  }
}
