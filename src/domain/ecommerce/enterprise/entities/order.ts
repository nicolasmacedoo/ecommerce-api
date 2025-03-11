import { Entity } from 'src/core/entities/entity'
import type { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import type { Optional } from 'src/core/types/optional'
import type { OrderItem } from './order-item'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { OrderItemsList } from './order-items-list'
import { OrderCreatedEvent } from '../events/order-created-event'

export type OrderStatus =
  | 'RECEIVED'
  | 'IN_PREPARATION'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED'

export interface OrderProps {
  customerId: UniqueEntityID
  status: OrderStatus
  date: Date
  totalAmount: number
  items: OrderItemsList
}

export class Order extends AggregateRoot<OrderProps> {
  static create(
    props: Optional<OrderProps, 'date' | 'status' | 'totalAmount'>,
    id?: UniqueEntityID
  ): Order {
    const order = new Order(
      {
        ...props,
        date: props.date ?? new Date(),
        status: props.status ?? 'RECEIVED',
        totalAmount: props.totalAmount ?? 0,
      },
      id
    )

    const isNewOrder = !id

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreatedEvent(order))
    }

    return order
  }

  get customerId(): UniqueEntityID {
    return this.props.customerId
  }

  set customerId(customerId: UniqueEntityID) {
    this.props.customerId = customerId
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

  get items(): OrderItemsList {
    return this.props.items
  }

  set items(items: OrderItemsList) {
    this.props.items = items
  }

  addItem(item: OrderItem): void {
    if (this.status !== 'RECEIVED') {
      throw new Error('Cannot add item to order that is not RECEVEID')
    }

    if (item.quantity <= 0) {
      throw new Error('Item quantity must be greater than zero')
    }

    const existingItem = this.items.currentItems.find(existingItem =>
      existingItem.productId.equals(item.productId)
    )
    if (existingItem) {
      existingItem.quantity += item.quantity
    }
    this.items.add(item)
    this.calculateTotalAmount()
  }

  removeItem(item: OrderItem): void {
    if (this.status !== 'RECEIVED') {
      throw new Error('Cannot remove item from order that is not RECEVEID')
    }
    const existingItem = this.items.currentItems.find(existingItem =>
      existingItem.productId.equals(item.productId)
    )

    if (!existingItem) {
      throw new Error('Item not found in order')
    }

    this.items.remove(item)
    this.calculateTotalAmount()
  }

  changeStatus(status: OrderStatus): void {
    this.props.status = status
  }

  calculateTotalAmount(): void {
    this.props.totalAmount = this.items.currentItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
  }
}
