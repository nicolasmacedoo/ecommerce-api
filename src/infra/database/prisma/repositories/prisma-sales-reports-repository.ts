import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { SalesReportsRepository } from '@/domain/ecommerce/application/repositories/sales-reports-repository'
import { SalesReport } from '@/domain/ecommerce/enterprise/entities/sales-report'
import { PrismaSalesReportMapper } from '../mappers/prisma-sales-report-mapper'

@Injectable()
export class PrismaSalesReportsRepository implements SalesReportsRepository {
  constructor(private prisma: PrismaService) {}

  async create(salesReport: SalesReport): Promise<void> {
    const data = PrismaSalesReportMapper.toPersistence(salesReport)

    await this.prisma.salesReport.create({
      data,
    })
  }

  async findMany({ page }: { page: number }): Promise<SalesReport[]> {
    const salesReports = await this.prisma.salesReport.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return salesReports.map(PrismaSalesReportMapper.toDomain)
  }

  async findById(id: string): Promise<SalesReport | null> {
    const salesReport = await this.prisma.salesReport.findUnique({
      where: {
        id,
      },
    })

    if (!salesReport) {
      return null
    }

    return PrismaSalesReportMapper.toDomain(salesReport)
  }
}
