import { right, type Either } from '@/core/either'
import { Product } from '../../enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'

export interface CreateProductUseCaseRequest {
  name: string
  description: string
  price: number
  stockQuantity: number
}

type CreateProductUseCaseResponse = Either<
  null,
  {
    product: Product
  }
>

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    name,
    description,
    price,
    stockQuantity,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      name,
      description,
      price,
      stockQuantity,
    })

    await this.productsRepository.create(product)

    return right({
      product,
    })
  }
}
