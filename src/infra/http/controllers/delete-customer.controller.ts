import { DeleteCustomerUseCase } from '@/domain/ecommerce/application/use-cases/delete-customer'
import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger'

@ApiTags('Customers')
@Controller('/customers/:id')
export class DeleteCustomerController {
  constructor(private readonly deleteCustomer: DeleteCustomerUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Customer deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  async handle(@Param('id') id: string) {
    const result = await this.deleteCustomer.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException()
    }
  }
}
