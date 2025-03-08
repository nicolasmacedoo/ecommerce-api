import type { Customer } from '@/domain/ecommerce/enterprise/entities/customer'

export class CustomerPresenter {
  static toHTTP(customer: Customer) {
    return {
      id: customer.id.toString(),
      userId: customer.userId.toString(),
      fullName: customer.fullName,
      contact: customer.contact,
      address: customer.address,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }
  }
}
