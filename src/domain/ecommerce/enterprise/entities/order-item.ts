import type { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface OrderItemProps {
  orderId: UniqueEntityID
  productId: UniqueEntityID
  price: number
  quantity: number
  subtotal: number
}

export class OrderItem extends Entity<OrderItemProps> {
  static create(
    props: Optional<OrderItemProps, 'subtotal'>,
    id?: UniqueEntityID
  ) {
    return new OrderItem(
      {
        ...props,
        subtotal: props.price * props.quantity,
      },
      id
    )
  }

  get orderId(): UniqueEntityID {
    return this.props.orderId
  }

  get productId(): UniqueEntityID {
    return this.props.productId
  }

  get price(): number {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
  }

  get quantity(): number {
    return this.props.quantity
  }

  get subtotal(): number {
    return this.props.subtotal
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity
  }
}
