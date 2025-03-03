import type { Customer } from '../../enterprise/entities/customer'

export interface CustomersRepository {
  findByUserId(userId: string): Promise<Customer | null>
  create(customer: Customer): Promise<void>
}
