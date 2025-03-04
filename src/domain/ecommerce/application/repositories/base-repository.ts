import type { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class BaseRepository<T> {
  abstract create(entity: T): Promise<void>
  abstract findById(id: string): Promise<T | null>
  abstract findMany(params: PaginationParams): Promise<T[]>
  abstract save(entity: T): Promise<void>
  abstract delete(entity: T): Promise<void>
}
