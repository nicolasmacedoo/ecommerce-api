import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/ecommerce/enterprise/entities/user'
import type { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        roleId: new UniqueEntityID(raw.roleId),
        name: raw.name,
        email: raw.email,
        password: raw.password,
        emailVerified: raw.emailVerified,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      roleId: user.roleId.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? undefined,
    }
  }
}
