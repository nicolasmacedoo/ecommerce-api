import { Entity } from 'src/core/entities/entity'
import type { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import type { Optional } from 'src/core/types/optional'

export interface SalesReportProps {
  period: string
  totalSales: number
  totalProductsSold: number
  path: string
  createdAt: Date
}

export class SalesReport extends Entity<SalesReportProps> {
  static create(
    props: Optional<SalesReportProps, 'createdAt'>,
    id?: UniqueEntityID
  ): SalesReport {
    return new SalesReport(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }

  get period(): string {
    return this.props.period
  }

  get totalSales(): number {
    return this.props.totalSales
  }

  get totalProductsSold(): number {
    return this.props.totalProductsSold
  }

  get path(): string {
    return this.props.path
  }

  get createdAt(): Date {
    return this.props.createdAt
  }
}
