import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/ecommerce/enterprise/entities/product'
import type { Product as PrismaProduct, Prisma } from '@prisma/client'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return new Product(
      {
        name: raw.name,
        description: raw.description,
        price: Number(raw.price),
        stockQuantity: raw.stockQuantity,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence(entity: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: entity.id.toString(),
      name: entity.name,
      description: entity.description,
      price: entity.price,
      stockQuantity: entity.stockQuantity,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
    }
  }
}
