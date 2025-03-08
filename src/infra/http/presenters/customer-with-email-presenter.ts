import type { CustomerWithEmail } from '@/domain/ecommerce/enterprise/entities/value-objects/customer-with-email'

export class CustomerWithEmailPresenter {
  static toHTTP(customer: CustomerWithEmail) {
    return {
      id: customer.id.toString(),
      userId: customer.userId.toString(),
      email: customer.email,
      fullName: customer.fullName,
      contact: customer.contact,
      address: customer.address,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }
  }
}
