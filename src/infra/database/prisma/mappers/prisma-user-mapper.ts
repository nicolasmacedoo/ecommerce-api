import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/ecommerce/enterprise/entities/user'
import type {
  User as PrismaUser,
  Role as PrismaRole,
  Prisma,
} from '@prisma/client'

type PrismaUserRole = PrismaUser & {
  role: PrismaRole
}

export class PrismaUserMapper {
  static toDomain(raw: PrismaUserRole): User {
    return User.create(
      {
        roleId: new UniqueEntityID(raw.role.id),
        name: raw.name,
        email: raw.email,
        password: raw.password,
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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? undefined,
    }
  }
}
