import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

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
        updatedAt: props.updatedAt ?? null,
      },
      id
    )
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name

    this.touch()
  }

  get description(): string {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description

    this.touch()
  }

  get price(): number {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price

    this.touch()
  }

  get stockQuantity(): number {
    return this.props.stockQuantity
  }

  set stockQuantity(stockQuantity: number) {
    this.props.stockQuantity = stockQuantity

    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero')
    }

    this.stockQuantity -= quantity
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero')
    }

    this.stockQuantity += quantity
  }
}
