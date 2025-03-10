import { ValueObject } from '@/core/entities/value-object'

interface Permissions {
  id: string
  name: string
  description: string | null
}

interface UserWithRoleAndPermissionsProps {
  id: string
  role: string
  permissions: Permissions[]
  email: string
  name: string
  password: string
  emailVerified: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class UserWithRoleAndPermissions extends ValueObject<UserWithRoleAndPermissionsProps> {
  static create(
    props: UserWithRoleAndPermissionsProps
  ): UserWithRoleAndPermissions {
    return new UserWithRoleAndPermissions(props)
  }

  get id(): string {
    return this.props.id
  }

  get role(): string {
    return this.props.role
  }

  get permissions(): Permissions[] {
    return this.props.permissions
  }

  get email(): string {
    return this.props.email
  }

  get name(): string {
    return this.props.name
  }
  get password(): string {
    return this.props.password
  }

  get emailVerified(): boolean {
    return this.props.emailVerified
  }

  set emailVerified(value: boolean) {
    this.props.emailVerified = value
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
