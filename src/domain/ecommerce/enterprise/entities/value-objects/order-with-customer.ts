import { ValueObject } from '@/core/entities/value-object'
import type { OrderItem } from '../order-item'

interface OrderWithCustomerProps {
  orderId: string
  customerId: string
  customerName: string
  customerContact: string
  customerAddress: string
  orderTotalAmount: number
  orderDate: Date
  orderStatus: string
  items: OrderItem[]
}

export class OrderWithCustomer extends ValueObject<OrderWithCustomerProps> {
  static create(props: OrderWithCustomerProps): OrderWithCustomer {
    return new OrderWithCustomer(props)
  }

  get orderId(): string {
    return this.props.orderId
  }

  get customerId(): string {
    return this.props.customerId
  }

  get customerName(): string {
    return this.props.customerName
  }

  get customerContact(): string {
    return this.props.customerContact
  }

  get customerAddress(): string {
    return this.props.customerAddress
  }

  get orderTotalAmount(): number {
    return this.props.orderTotalAmount
  }

  get orderDate(): Date {
    return this.props.orderDate
  }

  get orderStatus(): string {
    return this.props.orderStatus
  }

  get items(): OrderItem[] {
    return this.props.items
  }
}
