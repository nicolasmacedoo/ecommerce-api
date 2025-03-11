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
import { InativeCustomerError } from './errors/inative-customer-error'
import { OrderItemsRepository } from '../repositories/order-items-repository'

interface OrderItemRequest {
  id: string
  quantity: number
}

interface EditOrderUseCaseRequest {
  orderId: string
  customerId: string
  items: OrderItemRequest[]
}

type EditOrderUseCaseResponse = Either<
  | ResourceNotFoundError
  | InsuficientItemQuantityError
  | InativeCustomerError
  | MissingRequiredFieldsError,
  { order: Order }
>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly productRepository: ProductsRepository,
    private readonly customerRepository: CustomersRepository,
    private readonly orderItemsRepository: OrderItemsRepository
  ) {}

  async execute({
    orderId,
    customerId,
    items,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    if (!orderId) {
      return left(new MissingRequiredFieldsError(['orderId']))
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError(`Order ${orderId}`))
    }

    if (!customerId) {
      return left(new MissingRequiredFieldsError(['customerId']))
    }

    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      return left(new ResourceNotFoundError(`Customer ${customerId}`))
    }

    if (!customer.status) {
      return left(new InativeCustomerError(customer.fullName))
    }

    if (!items || items.length === 0) {
      return left(new MissingRequiredFieldsError(['items']))
    }

    const currentOrderItems =
      await this.orderItemsRepository.findManyByOrderId(orderId)

    const orderItemsList = new OrderItemsList(currentOrderItems)

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

    const orderItems: OrderItem[] = []

    for (const item of items) {
      const product = products.find(
        product => product.id.toString() === item.id
      )

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

      orderItems.push(orderItem)

      // product.decreaseStock(item.quantity)

      // await this.productRepository.save(product)
    }

    orderItemsList.update(orderItems)
    order.items = orderItemsList
    order.customerId = new UniqueEntityID(customerId)
    order.calculateTotalAmount()

    await this.orderRepository.save(order)

    return right({
      order,
    })

    //TODO: try cath surround caso algo de error nao subtrair quantidade produto?
  }
}
