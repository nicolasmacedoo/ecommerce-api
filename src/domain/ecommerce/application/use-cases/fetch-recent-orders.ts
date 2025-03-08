import { right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import type { OrderWithCustomer } from '../../enterprise/entities/value-objects/order-with-customer'

interface FetchRecentOrdersUseCaseRequest {
  page: number
  query?: string
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
  }: FetchRecentOrdersUseCaseRequest): Promise<FetchRecentOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyRecentWithCustomer({
      page,
      query,
    })

    return right({
      orders,
    })
  }
}
