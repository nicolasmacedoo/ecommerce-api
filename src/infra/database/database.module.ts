import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/ecommerce/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { CustomersRepository } from '@/domain/ecommerce/application/repositories/customers-repository'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customer-repository'

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
  ],
  exports: [PrismaService, UsersRepository, CustomersRepository],
})
export class DatabaseModule {}
