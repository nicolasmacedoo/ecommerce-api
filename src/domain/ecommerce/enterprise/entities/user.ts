import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export interface UserProps {
  roleId: UniqueEntityID
  name: string
  email: string
  password: string
  emailVerified: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  static create(
    props: Optional<UserProps, 'createdAt' | 'updatedAt' | 'emailVerified'>,
    id?: UniqueEntityID
  ): User {
    return new User(
      {
        ...props,
        emailVerified: props.emailVerified ?? false,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id
    )
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  get roleId(): UniqueEntityID {
    return this.props.roleId
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
