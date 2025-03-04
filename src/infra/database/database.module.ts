import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/ecommerce/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { CustomersRepository } from '@/domain/ecommerce/application/repositories/customers-repository'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customer-repository'
import { ProductsRepository } from '@/domain/ecommerce/application/repositories/products-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    CustomersRepository,
    ProductsRepository,
  ],
})
export class DatabaseModule {}
