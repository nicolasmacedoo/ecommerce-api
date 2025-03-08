import { DeleteOrderUseCase } from '@/domain/ecommerce/application/use-cases/delete-order'
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

@ApiTags('Orders')
@Controller('/orders/:id')
export class DeleteOrderController {
  constructor(private readonly deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a order and all its items' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Order deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  async handle(@Param('id') id: string) {
    const result = await this.deleteOrder.execute({ orderId: id })

    if (result.isLeft()) {
      const error = result.value

      throw new NotFoundException(error.message)
    }
  }
}
