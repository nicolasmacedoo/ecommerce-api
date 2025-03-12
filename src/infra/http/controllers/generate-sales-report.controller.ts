import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger'
import { GenerateSalesReportUseCase } from '@/domain/ecommerce/application/use-cases/generate-sales-report'
import {
  GenerateSalesReportRequestDTO,
  GenerateSalesReportResponseDTO,
} from './dtos/sales-report.dto'
import { Roles } from '@/infra/auth/role.decorator'
import { Role } from '@/domain/ecommerce/enterprise/entities/user'
import { RequirePermissions } from '@/infra/auth/permissions.decorator'

const startDateQueryParamSchema = z.string().transform(value => new Date(value))

const endDateQueryParamSchema = z.string().transform(value => new Date(value))

const startDateValidationPipe = new ZodValidationPipe(startDateQueryParamSchema)
const endDateValidationPipe = new ZodValidationPipe(endDateQueryParamSchema)

type StartDateQueryParamSchema = z.infer<typeof startDateQueryParamSchema>
type EndDateQueryParamSchema = z.infer<typeof endDateQueryParamSchema>

@ApiTags('Reports')
@Controller('/reports/sales')
export class GenerateSalesReportController {
  constructor(private generateSalesReport: GenerateSalesReportUseCase) {}

  @Post()
  @Roles(Role.ADMIN)
  @RequirePermissions('report:generate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a sales report' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Format: YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Format: YYYY-MM-DD',
  })
  @ApiResponse({
    status: 201,
    description: 'Report generated successfully',
    type: GenerateSalesReportResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  async handle(
    @Query('startDate', startDateValidationPipe)
    startDate: StartDateQueryParamSchema,
    @Query('endDate', endDateValidationPipe)
    endDate: EndDateQueryParamSchema
  ) {
    const result = await this.generateSalesReport.execute({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    if (result.isLeft()) {
      throw new BadRequestException('Could not generate sales report')
    }

    return result.value
  }
}
