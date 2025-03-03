import { Entity } from 'src/core/entities/entity'
import type { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import type { Optional } from 'src/core/types/optional'

export interface ProductProps {
  name: string
  description: string
  price: number
  stockQuantity: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Product extends Entity<ProductProps> {
  static create(
    props: Optional<ProductProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ): Product {
    return new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: null,
      },
      id
    )
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get price(): number {
    return this.props.price
  }

  get stockQuantity(): number {
    return this.props.stockQuantity
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }
}
