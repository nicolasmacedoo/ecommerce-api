import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { OrderProcessingClient } from '../clients/order-processing-client'
import { ProductsRepository } from '../repositories/products-repository'

@Injectable()
export class OrderProcessor {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderProcessingClient: OrderProcessingClient,
    private readonly productsRepository: ProductsRepository
  ) {}

  async process(orderId: string): Promise<void> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      throw new Error(`Order ${orderId} not found`)
    }

    const isApproved = await this.orderProcessingClient.process(
      orderId,
      order.totalAmount
    )

    if (isApproved) {
      order.changeStatus('IN_PREPARATION')

      for (const item of order.items.currentItems) {
        const product = await this.productsRepository.findById(
          item.productId.toString()
        )

        if (product) {
          product.decreaseStock(item.quantity)
          await this.productsRepository.save(product)
        }
      }
    } else {
      order.changeStatus('CANCELLED')
    }

    await this.ordersRepository.save(order)
  }
}
