import { right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { SalesReportsRepository } from '../repositories/sales-reports-repository'
import { StorageClient } from '../storage/storage-client'
import { SalesReport } from '../../enterprise/entities/sales-report'

interface GenerateSalesReportUseCaseRequest {
  startDate: Date
  endDate: Date
}

type GenerateSalesReportUseCaseResponse = Either<
  null,
  {
    reportId: string
    path: string
  }
>

@Injectable()
export class GenerateSalesReportUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private salesReportsRepository: SalesReportsRepository,
    private storageClient: StorageClient
  ) {}

  async execute({
    startDate,
    endDate,
  }: GenerateSalesReportUseCaseRequest): Promise<GenerateSalesReportUseCaseResponse> {
    const salesData = await this.ordersRepository.findSalesReportData({
      startDate,
      endDate,
    })

    const totalProductsSold = salesData.reduce(
      (acc, item) => acc + item.quantitySold,
      0
    )
    const totalSales = salesData.reduce((acc, item) => acc + item.totalValue, 0)

    const periodStart = startDate.toISOString().split('T')[0]
    const periodEnd = endDate.toISOString().split('T')[0]
    const period = `${periodStart}_to_${periodEnd}`

    const csvHeader = 'Product ID,Product Name,Quantity Sold,Total Value\n'
    const csvRows = salesData.map(
      item =>
        `${item.productId},${item.productName},${item.quantitySold},${item.totalValue}`
    )
    const csvSummary = `\nSummary,,${totalProductsSold},${totalSales}`
    const csvContent = csvHeader + csvRows.join('\n') + csvSummary

    const fileName = `sales_report_${period}_${new Date().getTime()}.csv`

    const { path } = await this.storageClient.upload({
      fileName,
      fileContent: csvContent,
      contentType: 'text/csv',
    })

    const salesReport = SalesReport.create({
      startDate,
      endDate,
      totalSales,
      totalProductsSold,
      path,
    })

    await this.salesReportsRepository.create(salesReport)

    return right({
      reportId: salesReport.id.toString(),
      path,
    })
  }
}
