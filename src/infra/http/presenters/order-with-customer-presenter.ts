import type { OrderWithCustomer } from '@/domain/ecommerce/enterprise/entities/value-objects/order-with-customer'

export class OrderWithCustomerPresenter {
  public static toHTTP(orderWithCustomer: OrderWithCustomer) {
    return {
      id: orderWithCustomer.orderId.toString(),
      customerId: orderWithCustomer.customerId.toString(),
      customerName: orderWithCustomer.customerName,
      status: orderWithCustomer.orderStatus,
      date: orderWithCustomer.orderDate,
      totalAmount: orderWithCustomer.orderTotalAmount,
      items: orderWithCustomer.items.map(item => ({
        productId: item.productId.toString(),
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
    }
  }
}
