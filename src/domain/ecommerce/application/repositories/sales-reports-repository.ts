import { SalesReport } from '../../enterprise/entities/sales-report'

export abstract class SalesReportsRepository {
  abstract create(salesReport: SalesReport): Promise<void>
  abstract findMany(params: { page: number }): Promise<SalesReport[]>
  abstract findById(id: string): Promise<SalesReport | null>
}
