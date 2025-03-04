import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/ecommerce/enterprise/entities/customer'
import type { Customer as PrismaCustomer, Prisma } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    return Customer.create(
      {
        userId: new UniqueEntityID(raw.userId),
        fullName: raw.fullName,
        contact: raw.contact,
        address: raw.address,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence(
    customer: Customer
  ): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      userId: customer.userId.toString(),
      fullName: customer.fullName,
      contact: customer.contact,
      address: customer.address,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt ?? undefined,
    }
  }
}
