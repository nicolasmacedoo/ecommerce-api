import type { User } from '../../enterprise/entities/user'
import type { UserWithRoleAndPermissions } from '../../enterprise/entities/value-objects/user-with-role-and-permissions'

export abstract class UsersRepository {
  abstract findByEmail(
    email: string
  ): Promise<UserWithRoleAndPermissions | null>
  abstract create(user: User): Promise<void>
}
