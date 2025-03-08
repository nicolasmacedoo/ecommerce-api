import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CustomersRepository } from '../repositories/customers-repository'
import type { Customer } from '../../enterprise/entities/customer'

interface EditCustomerUseCaseRequest {
  id: string
  fullName: string
  contact: string
  address: string
  status: boolean
}

type EditCustomerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    customer: Customer
  }
>

@Injectable()
export class EditCustomerUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute({
    id,
    fullName,
    address,
    contact,
    status,
  }: EditCustomerUseCaseRequest): Promise<EditCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(id)

    if (!customer) {
      return left(new ResourceNotFoundError(`Customer ${id}`))
    }

    customer.fullName = fullName
    customer.contact = contact
    customer.address = address
    customer.status = status

    await this.customersRepository.save(customer)

    return right({
      customer,
    })
  }
}
