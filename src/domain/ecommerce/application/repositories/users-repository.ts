import type { User } from '../../enterprise/entities/user'
import type { UserWithRoleAndPermissions } from '../../enterprise/entities/value-objects/user-with-role-and-permissions'

export abstract class UsersRepository {
  abstract findByEmailWithRoleAndPermissions(
    email: string
  ): Promise<UserWithRoleAndPermissions | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
}
