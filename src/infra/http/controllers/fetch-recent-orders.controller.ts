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

const queryParamSchema = z.string().optional()

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type QueryParamSchema = z.infer<typeof queryParamSchema>

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Orders')
@Controller('/orders')
export class FetchOrdersController {
  constructor(private readonly fetchOrders: FetchOrdersUseCase) {}

  @Get()
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
  @ApiResponse({
    status: 200,
    description: 'Orders fetched successfully',
    type: FetchOrdersResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  async handle(
    @Query('page', pageValidationPipe) page: PageQueryParamSchema,
    @Query('query', queryValidationPipe) query: QueryParamSchema
  ) {
    const result = await this.fetchOrders.execute({ page, query })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return {
      orders: orders.map(OrderWithCustomerPresenter.toHTTP),
    }
  }
}
