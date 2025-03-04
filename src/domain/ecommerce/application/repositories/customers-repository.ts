import type { Customer } from '../../enterprise/entities/customer'

export abstract class CustomersRepository {
  abstract findByUserId(userId: string): Promise<Customer | null>
  abstract create(customer: Customer): Promise<void>
}
