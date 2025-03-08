import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/ecommerce/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { CustomersRepository } from '@/domain/ecommerce/application/repositories/customers-repository'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customer-repository'
import { ProductsRepository } from '@/domain/ecommerce/application/repositories/products-repository'
import { PrismaProductsRepository } from './prisma/repositories/prisma-products-repository'
import { OrdersRepository } from '@/domain/ecommerce/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { OrderItemsRepository } from '@/domain/ecommerce/application/repositories/order-items-repository'
import { PrismaOrderItemsRepository } from './prisma/repositories/prisma-order-items-repository'

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
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: OrderItemsRepository,
      useClass: PrismaOrderItemsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    CustomersRepository,
    ProductsRepository,
    OrdersRepository,
    OrderItemsRepository,
  ],
})
export class DatabaseModule {}
