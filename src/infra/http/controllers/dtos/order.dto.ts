import type { OrderStatus } from '@/domain/ecommerce/enterprise/entities/order'
import { ApiProperty } from '@nestjs/swagger'

export class OrderItemDto {
  @ApiProperty({ description: 'Order ID that this item belongs to' })
  orderId: string

  @ApiProperty({ description: 'Product ID' })
  productId: string

  @ApiProperty({ description: 'Quantity of this product' })
  quantity: number

  @ApiProperty({ description: 'Price per unit', type: Number, example: 446.29 })
  price: number

  @ApiProperty({
    description: 'Subtotal (price * quantity)',
    type: Number,
    example: 2231.45,
  })
  subtotal: number
}

export class OrderWithCustomerDto {
  @ApiProperty({ description: 'Unique identifier for the order' })
  orderId: string

  @ApiProperty({ description: 'Customer ID associated with this order' })
  customerId: string

  @ApiProperty({ description: 'Full name of the customer' })
  customerName: string

  @ApiProperty({ description: 'Contact information of the customer' })
  customerContact: string

  @ApiProperty({ description: 'Customer address for delivery' })
  customerAddress: string

  @ApiProperty({
    description: 'Total amount of the order',
    type: Number,
    example: 2231.45,
  })
  orderTotalAmount: number

  @ApiProperty({ description: 'Current status of the order' })
  orderStatus: string

  @ApiProperty({ description: 'Date when the order was placed' })
  orderDate: Date

  @ApiProperty({
    description: 'List of items in this order',
    type: [OrderItemDto],
  })
  items: OrderItemDto[]
}

export class FetchOrdersResponseDto {
  @ApiProperty({ description: 'List of orders with customer details' })
  orders: OrderWithCustomerDto[]
}

export class OrderDto {
  @ApiProperty({ description: 'Unique identifier for the order' })
  id: string

  @ApiProperty({ description: 'Customer Id associated with this order' })
  customerId: string

  @ApiProperty({ description: 'Order status' })
  status: OrderStatus

  @ApiProperty({ description: 'Order date' })
  date: Date

  @ApiProperty({ description: 'Total amount of the order' })
  totalAmount: number

  @ApiProperty({ description: 'List of items in this order' })
  items: OrderItemDto[]
}
