import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { FetchOrdersUseCase } from '@/domain/ecommerce/application/use-cases/fetch-recent-orders'
import { OrderWithCustomerPresenter } from '../presenters/order-with-customer-presenter'
import { FetchOrdersResponseDto } from './dtos/order.dto'
import { Roles } from '@/infra/auth/role.decorator'
import { Role } from '@/domain/ecommerce/enterprise/entities/user'
import { RequirePermissions } from '@/infra/auth/permissions.decorator'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryParamSchema = z.string().optional()

const startDateQueryParamSchema = z
  .string()
  .optional()
  .transform(value => (value ? new Date(value) : undefined))

const endDateQueryParamSchema = z
  .string()
  .optional()
  .transform(value => (value ? new Date(value) : undefined))

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)
const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
const startDateValidationPipe = new ZodValidationPipe(startDateQueryParamSchema)
const endDateValidationPipe = new ZodValidationPipe(endDateQueryParamSchema)

type QueryParamSchema = z.infer<typeof queryParamSchema>
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type StartDateQueryParamSchema = z.infer<typeof startDateQueryParamSchema>
type EndDateQueryParamSchema = z.infer<typeof endDateQueryParamSchema>

@ApiTags('Orders')
@Controller('/orders')
export class FetchOrdersController {
  constructor(private readonly fetchOrders: FetchOrdersUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  @RequirePermissions('order:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch list of orders with pagination and query' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starts at 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query string to search for customer name',
    type: String,
    example: 'John Doe',
  })
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
    status: 200,
    description: 'Orders fetched successfully',
    type: FetchOrdersResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  async handle(
    @Query('page', pageValidationPipe) page: PageQueryParamSchema,
    @Query('query', queryValidationPipe) query: QueryParamSchema,
    @Query('startDate', startDateValidationPipe)
    startDate?: StartDateQueryParamSchema,
    @Query('endDate', endDateValidationPipe)
    endDate?: EndDateQueryParamSchema
  ) {
    const result = await this.fetchOrders.execute({
      page,
      query,
      startDate,
      endDate,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return {
      orders: orders.map(OrderWithCustomerPresenter.toHTTP),
    }
  }
}
