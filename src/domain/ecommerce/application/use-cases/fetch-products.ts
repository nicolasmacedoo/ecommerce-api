import { right, type Either } from '@/core/either'
import type { Product } from '../../enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'

interface FetchProductsUseCaseRequest {
  page: number
}

type FetchProductsUseCaseResponse = Either<
  null,
  {
    products: Product[]
  }
>

@Injectable()
export class FetchProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    page,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productsRepository.findMany({ page })

    return right({
      products,
    })
  }
}
