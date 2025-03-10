import { UserWithRoleAndPermissions } from '@/domain/ecommerce/enterprise/entities/value-objects/user-with-role-and-permissions'
import {
  User as PrismaUser,
  Role as PrismaRole,
  Permission as PrismaPermissions,
} from '@prisma/client'

type PrismaUserWithRoleAndPermissions = PrismaUser & {
  role: PrismaRole & {
    permissions: PrismaPermissions[]
  }
}

export class PrismaUserWithRoleAndPermissionMapper {
  static toDomain(
    raw: PrismaUserWithRoleAndPermissions
  ): UserWithRoleAndPermissions {
    return UserWithRoleAndPermissions.create({
      id: raw.id,
      role: raw.role.name,
      permissions: raw.role.permissions.map(permission => ({
        id: permission.id,
        name: permission.name,
        description: permission.description,
      })),
      email: raw.email,
      name: raw.name,
      password: raw.password,
      emailVerified: raw.emailVerified,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
