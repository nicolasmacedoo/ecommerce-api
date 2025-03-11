import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'
import { OrderItemsRepository } from '../repositories/order-items-repository'
import { ProductInOrderError } from './errors/product-in-order-error'

interface DeleteProductUseCaseRequest {
  id: string
}

type DeleteProductUseCaseResponse = Either<
  ResourceNotFoundError | ProductInOrderError,
  null
>

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly orderItemsRepository: OrderItemsRepository
  ) {}

  async execute({
    id,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      return left(new ResourceNotFoundError('Product'))
    }

    const orderItems = await this.orderItemsRepository.findManyByProductId(id)

    if (orderItems.length > 0) {
      return left(new ProductInOrderError(id))
    }

    await this.productsRepository.delete(product)

    return right(null)
  }
}
