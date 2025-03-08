import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CustomersRepository } from '../repositories/customers-repository'

interface DeleteCustomerUseCaseRequest {
  id: string
}

type DeleteCustomerUseCaseResponse = Either<ResourceNotFoundError, void>

@Injectable()
export class DeleteCustomerUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute({ id }: DeleteCustomerUseCaseRequest) {
    const customer = await this.customersRepository.findById(id)

    if (!customer) {
      return left(new ResourceNotFoundError(`Customer ${id}`))
    }

    await this.customersRepository.delete(customer)

    return right(null)
  }
}
