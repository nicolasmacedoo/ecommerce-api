import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { createZodDto } from 'nestjs-zod'
import { EditOrderUseCase } from '@/domain/ecommerce/application/use-cases/edit-order'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InativeCustomerError } from '@/domain/ecommerce/application/use-cases/errors/inative-customer-error'

const editOrderBodySchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().min(1),
    })
  ),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

export class EditOrderDTO extends createZodDto(editOrderBodySchema) {}

@ApiTags('Orders')
@Controller('/orders/:id')
export class EditOrderController {
  constructor(private readonly editOrder: EditOrderUseCase) {}

  @Put()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit a new order' })
  @ApiNoContentResponse({ description: 'Order editd successfully' })
  @ApiBadRequestResponse({ description: 'Invalid order data' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async handle(
    @Body(bodyValidationPipe) body: EditOrderDTO,
    @Param('id') id: string
  ) {
    const { customerId, items } = body

    const result = await this.editOrder.execute({
      orderId: id,
      customerId,
      items,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InativeCustomerError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
