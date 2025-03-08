import { CustomerWithEmail } from '@/domain/ecommerce/enterprise/entities/value-objects/customer-with-email'
import { Customer as PrismaCustomer, User as PrismaUser } from '@prisma/client'

type PrismaCustomerWithEmail = PrismaCustomer & {
  user: PrismaUser
}

export class PrismaCustomerWithEmailMapper {
  public static toDomain(raw: PrismaCustomerWithEmail): CustomerWithEmail {
    return CustomerWithEmail.create({
      id: raw.id,
      userId: raw.userId,
      email: raw.user.email,
      fullName: raw.fullName,
      contact: raw.contact,
      address: raw.address,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
