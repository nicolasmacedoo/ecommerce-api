import { Entity } from 'src/core/entities/entity'
import type { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import type { Optional } from 'src/core/types/optional'

export interface CustomerProps {
  userId: UniqueEntityID
  fullName: string
  contact: string
  address: string
  status: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class Customer extends Entity<CustomerProps> {
  static create(
    props: Optional<CustomerProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ): Customer {
    return new Customer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: null,
      },
      id
    )
  }

  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get fullName(): string {
    return this.props.fullName
  }

  get contact(): string {
    return this.props.contact
  }

  get address(): string {
    return this.props.address
  }

  get status(): boolean {
    return this.props.status
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }
}
