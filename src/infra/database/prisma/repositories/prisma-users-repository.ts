import type { UsersRepository } from '@/domain/ecommerce/application/repositories/users-repository'
import type { User } from '@/domain/ecommerce/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import type { UserWithRoleAndPermissions } from '@/domain/ecommerce/enterprise/entities/value-objects/user-with-role-and-permissions'
import { PrismaUserWithRoleAndPermissionMapper } from '../mappers/prisma-user-with-role-and-permission-mapper'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserWithRoleAndPermissions | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserWithRoleAndPermissionMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistence(user)

    await this.prisma.user.create({
      data,
    })
  }
}
