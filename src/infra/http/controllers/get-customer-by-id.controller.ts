import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger'
import { GetCustomerByIdUseCase } from '@/domain/ecommerce/application/use-cases/get-customer-by-id'
import { CustomerDTO } from './dtos/customer.dto'
import { CustomerWithEmailPresenter } from '../presenters/customer-with-email-presenter'

@ApiTags('Customers')
@Controller('/customers/:id')
export class GetCustomerByIdController {
  constructor(private readonly getCustomerById: GetCustomerByIdUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer found successfully',
    type: CustomerDTO,
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  async handle(@Param('id') id: string) {
    const result = await this.getCustomerById.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException()
    }

    const { customer } = result.value

    return { customer: CustomerWithEmailPresenter.toHTTP(customer) }
  }
}
