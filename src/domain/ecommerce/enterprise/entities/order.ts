import { Entity } from 'src/core/entities/entity'
import type { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import type { Optional } from 'src/core/types/optional'
import type { OrderItem } from './order-item'

export type OrderStatus =
  | 'RECEVEID'
  | 'IN PREPARATION'
  | 'DISPATCHED'
  | 'DELIVERED'

export interface OrderProps {
  customerId: string
  status: OrderStatus
  date: Date
  totalAmount: number
  orderItems: OrderItem[]
}

export class Order extends Entity<OrderProps> {
  static create(
    props: Optional<OrderProps, 'date'>,
    id?: UniqueEntityID
  ): Order {
    return new Order(
      {
        ...props,
        date: props.date ?? new Date(),
      },
      id
    )
  }

  get customerId(): string {
    return this.props.customerId
  }

  get status(): OrderStatus {
    return this.props.status
  }

  get date(): Date {
    return this.props.date
  }

  get totalAmount(): number {
    return this.props.totalAmount
  }
}
