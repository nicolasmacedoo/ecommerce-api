import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

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
    props: Optional<CustomerProps, 'createdAt' | 'updatedAt' | 'status'>,
    id?: UniqueEntityID
  ): Customer {
    return new Customer(
      {
        ...props,
        status: props.status ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
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

  set fullName(fullName: string) {
    this.props.fullName = fullName
    this.touch()
  }

  get contact(): string {
    return this.props.contact
  }

  set contact(contact: string) {
    this.props.contact = contact
    this.touch()
  }

  get address(): string {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
    this.touch()
  }

  get status(): boolean {
    return this.props.status
  }

  set status(status: boolean) {
    this.props.status = status
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
