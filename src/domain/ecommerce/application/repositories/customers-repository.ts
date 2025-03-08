import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Customer } from '../../enterprise/entities/customer'
import type { CustomerWithEmail } from '../../enterprise/entities/value-objects/customer-with-email'
import { BaseRepository } from './base-repository'

export abstract class CustomersRepository extends BaseRepository<Customer> {
  abstract findByIdWithEmail(id: string): Promise<CustomerWithEmail | null>

  abstract findManyWithEmail(
    params: PaginationParams
  ): Promise<CustomerWithEmail[]>
}
