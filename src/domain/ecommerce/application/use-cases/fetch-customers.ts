import { right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CustomersRepository } from '../repositories/customers-repository'
import type { Customer } from '../../enterprise/entities/customer'
import type { CustomerWithEmail } from '../../enterprise/entities/value-objects/customer-with-email'

interface FetchCustomersUseCaseRequest {
  page: number
  query?: string
}

type FetchCustomersUseCaseResponse = Either<
  null,
  {
    customers: CustomerWithEmail[]
  }
>

@Injectable()
export class FetchCustomersUseCase {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async execute({
    page,
    query,
  }: FetchCustomersUseCaseRequest): Promise<FetchCustomersUseCaseResponse> {
    const customers = await this.customersRepository.findManyWithEmail({
      page,
      query,
    })

    return right({
      customers,
    })
  }
}
