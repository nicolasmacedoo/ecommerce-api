import { ApiProperty } from '@nestjs/swagger'

export class GenerateSalesReportRequestDTO {
  @ApiProperty({
    description: 'Start date for the report period (YYYY-MM-DD)',
    example: '2023-01-01',
  })
  startDate: string

  @ApiProperty({
    description: 'End date for the report period (YYYY-MM-DD)',
    example: '2023-12-31',
  })
  endDate: string
}

export class GenerateSalesReportResponseDTO {
  @ApiProperty({
    description: 'ID of the generated report',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  reportId: string

  @ApiProperty({
    description: 'Path to the generated CSV report',
    example: 'reports/sales_report_2023-01-01_to_2023-12-31_1622547600000.csv',
  })
  path: string
}

export class SalesReportDTO {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    example: '2023-01-01 to 2023-12-31',
  })
  period: string

  @ApiProperty({
    example: 10500.75,
  })
  totalSales: number

  @ApiProperty({
    example: 48,
  })
  totalProductsSold: number

  @ApiProperty({
    example: 'reports/sales_report_2023-01-01_to_2023-12-31_1622547600000.csv',
  })
  path: string

  @ApiProperty()
  createdAt: Date
}

export class FetchSalesReportsResponseDTO {
  @ApiProperty({
    type: [SalesReportDTO],
  })
  reports: SalesReportDTO[]
}
