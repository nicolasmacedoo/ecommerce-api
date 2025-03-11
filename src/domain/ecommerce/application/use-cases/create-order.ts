import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '../../enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { ProductsRepository } from '../repositories/products-repository'
import { CustomersRepository } from '../repositories/customers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItemsList } from '../../enterprise/entities/order-items-list'
import { OrderItem } from '../../enterprise/entities/order-item'
import { InsuficientItemQuantityError } from './errors/insuficient-item-quantity-error'
import { MissingRequiredFieldsError } from './errors/missing-required-fields-error'
import type { Product } from '../../enterprise/entities/product'
import { InativeCustomerError } from './errors/inative-customer-error'

interface OrderItemRequest {
  id: string
  quantity: number
}

interface CreateOrderUseCaseRequest {
  customerId: string
  items: OrderItemRequest[]
}

type CreateOrderUseCaseResponse = Either<
  | ResourceNotFoundError
  | InsuficientItemQuantityError
  | InativeCustomerError
  | MissingRequiredFieldsError,
  { order: Order }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly productRepository: ProductsRepository,
    private readonly customerRepository: CustomersRepository
  ) {}

  async execute({
    customerId,
    items,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (!customerId) {
      return left(new MissingRequiredFieldsError(['customerId']))
    }

    if (!items || items.length === 0) {
      return left(new MissingRequiredFieldsError(['items']))
    }

    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError(`Customer ${customerId}`))
    }

    if (!customer.status) {
      return left(new InativeCustomerError(customer.fullName))
    }

    const productIds = items.map(item => item.id)
    const products = await this.productRepository.findManyByIds(productIds)

    if (products.length !== productIds.length) {
      const foundProductIds = products.map(product => product.id.toString())
      const notFoundProductIds = productIds.filter(
        productId => !foundProductIds.includes(productId)
      )

      return left(
        new ResourceNotFoundError(`Products: ${notFoundProductIds.join(', ')}`)
      )
    }

    const productsMap = new Map<string, Product>()
    for (const product of products) {
      productsMap.set(product.id.toString(), product)
    }

    const order = Order.create({
      customerId: new UniqueEntityID(customerId),
      items: new OrderItemsList(),
    })

    for (const item of items) {
      const product = productsMap.get(item.id)

      if (!product) {
        return left(new ResourceNotFoundError(`Product ${item.id}`))
      }

      if (item.quantity > product.stockQuantity) {
        return left(
          new InsuficientItemQuantityError(
            `Stock insuficient for ${product.name}`
          )
        )
      }

      const orderItem = OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })

      order.addItem(orderItem)

      // product.decreaseStock(item.quantity)

      // await this.productRepository.save(product)
    }

    await this.orderRepository.create(order)

    return right({
      order,
    })

    //TODO: try cath surround caso algo de error nao subtrair quantidade produto?
  }
}
