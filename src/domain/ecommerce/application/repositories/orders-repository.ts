import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Order } from '../../enterprise/entities/order'
import { BaseRepository } from './base-repository'
import type { OrderWithCustomer } from '../../enterprise/entities/value-objects/order-with-customer'

export abstract class OrdersRepository extends BaseRepository<Order> {
  abstract findManyRecentWithCustomer(
    params: PaginationParams
  ): Promise<OrderWithCustomer[]>

  abstract findSalesReportData(params: {
    startDate: Date
    endDate: Date
  }): Promise<
    {
      productId: string
      productName: string
      quantitySold: number
      totalValue: number
    }[]
  >
}
