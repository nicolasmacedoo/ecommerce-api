import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CustomersRepository } from '../repositories/customers-repository'
import type { CustomerWithEmail } from '../../enterprise/entities/value-objects/customer-with-email'

interface GetCustomerByIdUseCaseRequest {
  id: string
}

type GetCustomerByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    customer: CustomerWithEmail
  }
>

@Injectable()
export class GetCustomerByIdUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute({
    id,
  }: GetCustomerByIdUseCaseRequest): Promise<GetCustomerByIdUseCaseResponse> {
    const customer = await this.customersRepository.findByIdWithEmail(id)

    if (!customer) {
      return left(new ResourceNotFoundError(`Customer ${id}`))
    }

    return right({
      customer,
    })
  }
}
