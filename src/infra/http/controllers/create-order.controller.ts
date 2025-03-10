import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { createZodDto } from 'nestjs-zod'
import { CreateOrderUseCase } from '@/domain/ecommerce/application/use-cases/create-order'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InativeCustomerError } from '@/domain/ecommerce/application/use-cases/errors/inative-customer-error'
import { Roles } from '@/infra/auth/role.decorator'
import { Role } from '@/domain/ecommerce/enterprise/entities/user'
import { RequirePermissions } from '@/infra/auth/permissions.decorator'

const createOrderBodySchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().min(1),
    })
  ),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

export class CreateOrderDTO extends createZodDto(createOrderBodySchema) {}

@ApiTags('Orders')
@Controller('/orders')
export class CreateOrderController {
  constructor(private readonly createOrder: CreateOrderUseCase) {}

  @Post()
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @RequirePermissions('order:create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiCreatedResponse({ description: 'Order created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid order data' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async handle(@Body(bodyValidationPipe) body: CreateOrderDTO) {
    const { customerId, items } = body

    const result = await this.createOrder.execute({
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
