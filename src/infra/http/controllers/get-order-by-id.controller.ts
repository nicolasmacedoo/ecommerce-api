import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger'
import { OrderDto } from './dtos/order.dto'
import { GetOrderByIdUseCase } from '@/domain/ecommerce/application/use-cases/get-order-by-id'
import { OrderPresenter } from '../presenters/order-presenter'

@ApiTags('Orders')
@Controller('/orders/:id')
export class GetOrderByIdController {
  constructor(private readonly getOrderById: GetOrderByIdUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order fetched successfully',
    type: OrderDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  async handle(@Param('id') id: string) {
    const result = await this.getOrderById.execute({
      orderId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new NotFoundException(error.message)
    }

    const { order } = result.value

    return {
      order: OrderPresenter.toHttp(order),
    }
  }
}
