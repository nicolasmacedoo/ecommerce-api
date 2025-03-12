import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SalesReport } from '@/domain/ecommerce/enterprise/entities/sales-report'
import { Prisma, SalesReport as PrismaSalesReport } from '@prisma/client'

export class PrismaSalesReportMapper {
  static toDomain(raw: PrismaSalesReport): SalesReport {
    return SalesReport.create(
      {
        startDate: raw.startDate,
        endDate: raw.endDate,
        totalSales: Number(raw.totalSales),
        totalProductsSold: raw.totalProductsSold,
        path: raw.path,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPersistence(
    salesReport: SalesReport
  ): Prisma.SalesReportUncheckedCreateInput {
    return {
      id: salesReport.id.toString(),
      startDate: salesReport.startDate,
      endDate: salesReport.endDate,
      totalSales: salesReport.totalSales,
      totalProductsSold: salesReport.totalProductsSold,
      path: salesReport.path,
      createdAt: salesReport.createdAt,
    }
  }
}
