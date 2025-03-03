import { Entity } from 'src/core/entities/entity'
import type { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export interface OrderItemProps {
  orderId: UniqueEntityID
  productId: UniqueEntityID
  price: number
  quantity: number
}

export class OrderItem extends Entity<OrderItemProps> {
  static create(props: OrderItemProps, id?: UniqueEntityID) {
    return new OrderItem(props, id)
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

  set quantity(quantity: number) {
    this.props.quantity = quantity
  }
}
