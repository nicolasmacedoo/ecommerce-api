import type { ProductsRepository } from '@/domain/ecommerce/application/repositories/products-repository'
import type { Product } from '@/domain/ecommerce/enterprise/entities/product'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'
import type { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(entity)

    await this.prisma.product.create({
      data,
    })
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return products.map(PrismaProductMapper.toDomain)
  }

  async save(entity: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(entity)

    await this.prisma.product.update({
      where: {
        id: entity.id.toString(),
      },
      data,
    })
  }

  async delete(entity: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(entity)

    await this.prisma.product.delete({
      where: {
        id: data.id,
      },
    })
  }
}
