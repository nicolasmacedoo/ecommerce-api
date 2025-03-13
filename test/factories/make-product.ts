import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Product,
  type ProductProps,
} from '@/domain/ecommerce/enterprise/entities/product'
import { faker } from '@faker-js/faker'

export function makeProduct(
  overrides: Partial<ProductProps> = {},
  id?: UniqueEntityID
) {
  const product = Product.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number.parseFloat(faker.commerce.price()),
      stockQuantity: faker.number.int({ min: 1, max: 100 }),
      ...overrides,
    },
    id
  )
  return product
}
