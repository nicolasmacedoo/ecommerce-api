import type { Order } from '@/domain/ecommerce/enterprise/entities/order'

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      id: order.id.toString(),
      customerId: order.customerId.toString(),
      totalAmount: Number(order.totalAmount),
      sStatus: order.status,
      date: order.date,
      items: order.items.currentItems.map(item => ({
        orderId: item.orderId.toString(),
        productId: item.productId.toString(),
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
    }
  }
}
