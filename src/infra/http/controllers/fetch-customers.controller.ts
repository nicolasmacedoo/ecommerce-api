import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger'
import { GetCustomerByIdUseCase } from '@/domain/ecommerce/application/use-cases/get-customer-by-id'
import { CustomerDTO, FetchCustomersResponseDto } from './dtos/customer.dto'
import { CustomerWithEmailPresenter } from '../presenters/customer-with-email-presenter'
import { FetchCustomersUseCase } from '@/domain/ecommerce/application/use-cases/fetch-customers'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { Roles } from '@/infra/auth/role.decorator'
import { Role } from '@/domain/ecommerce/enterprise/entities/user'
import { RequirePermissions } from '@/infra/auth/permissions.decorator'

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

@ApiTags('Customers')
@Controller('/customers')
export class FetchCustomersController {
  constructor(private readonly fetchCustomers: FetchCustomersUseCase) {}

  @Get()
  @Roles(Role.ADMIN)
  @RequirePermissions('customer:read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch customers' })
  @ApiResponse({
    status: 200,
    description: 'Customer found successfully',
    type: FetchCustomersResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  async handle(
    @Query('page', pageValidationPipe)
    page: PageQueryParamSchema,
    @Query('query', queryValidationPipe)
    query: QueryParamSchema
  ) {
    const result = await this.fetchCustomers.execute({ page, query })

    if (result.isLeft()) {
      throw new NotFoundException()
    }

    const { customers } = result.value

    return { customes: customers.map(CustomerWithEmailPresenter.toHTTP) }
  }
}
