import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'

import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { EditCustomerUseCase } from '@/domain/ecommerce/application/use-cases/edit-customer'

const editCustomerBodySchema = z.object({
  fullName: z.string(),
  contact: z.string(),
  address: z.string(),
  status: z.boolean(),
})

const bodyValidationPipe = new ZodValidationPipe(editCustomerBodySchema)

class EditCustomerDTO extends createZodDto(editCustomerBodySchema) {}

@ApiTags('Customers')
@Controller('/customers/:id')
export class EditCustomerController {
  constructor(private readonly editCustomer: EditCustomerUseCase) {}

  @Put()
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBadRequestResponse({ description: 'Invalid customer data' })
  @ApiNoContentResponse({
    description: 'Customer updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Customer not found',
  })
  async handle(
    @Body(bodyValidationPipe) body: EditCustomerDTO,
    @Param('id') id: string
  ) {
    const { fullName, contact, address, status } = body

    const result = await this.editCustomer.execute({
      id,
      fullName,
      contact,
      address,
      status,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }
  }
}
