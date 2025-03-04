import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'

interface DeleteProductUseCaseRequest {
  id: string
}

type DeleteProductUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    id,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      return left(new ResourceNotFoundError('Product'))
    }

    await this.productsRepository.delete(product)

    return right(null)
  }
}
