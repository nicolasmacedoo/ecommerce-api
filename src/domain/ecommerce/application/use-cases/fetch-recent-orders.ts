import { right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import type { OrderWithCustomer } from '../../enterprise/entities/value-objects/order-with-customer'

interface FetchRecentOrdersUseCaseRequest {
  page: number
  query?: string
  startDate?: Date
  endDate?: Date
}

type FetchRecentOrdersUseCaseResponse = Either<
  null,
  {
    orders: OrderWithCustomer[]
  }
>

@Injectable()
export class FetchOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    page,
    query,
    startDate,
    endDate,
  }: FetchRecentOrdersUseCaseRequest): Promise<FetchRecentOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyRecentWithCustomer({
      page,
      query,
      startDate,
      endDate,
    })

    return right({
      orders,
    })
  }
}
