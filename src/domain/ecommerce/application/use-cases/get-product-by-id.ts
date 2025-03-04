import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Product } from '../../enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'

interface GetProductByIdUseCaseRequest {
  id: string
}

type GetProductByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product
  }
>

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    id,
  }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      return left(new ResourceNotFoundError('Product'))
    }

    return right({
      product,
    })
  }
}
