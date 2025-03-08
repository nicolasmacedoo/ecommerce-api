import type { Product } from '../../enterprise/entities/product'
import { BaseRepository } from './base-repository'

export abstract class ProductsRepository extends BaseRepository<Product> {
  abstract findManyByIds(ids: string[]): Promise<Product[]>
}
