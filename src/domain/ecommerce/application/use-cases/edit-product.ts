import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Product } from '../../enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { ProductsRepository } from '../repositories/products-repository'

interface EditProductUseCaseRequest {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product
  }
>

@Injectable()
export class EditProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    id,
    name,
    description,
    price,
    stockQuantity,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      return left(new ResourceNotFoundError('Product'))
    }

    product.name = name
    product.description = description
    product.price = price
    product.stockQuantity = stockQuantity

    await this.productsRepository.save(product)

    return right({
      product,
    })
  }
}
