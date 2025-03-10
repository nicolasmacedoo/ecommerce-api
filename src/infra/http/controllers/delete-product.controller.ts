import { DeleteProductUseCase } from '@/domain/ecommerce/application/use-cases/delete-product'
import { Role } from '@/domain/ecommerce/enterprise/entities/user'
import { RequirePermissions } from '@/infra/auth/permissions.decorator'
import { Roles } from '@/infra/auth/role.decorator'
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

@ApiTags('Products')
@Controller('/products/:id')
export class DeleteProductController {
  constructor(private readonly deleteProduct: DeleteProductUseCase) {}

  @Delete()
  @Roles(Role.ADMIN)
  @RequirePermissions('product:delete')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Product deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async handle(@Param('id') id: string) {
    const result = await this.deleteProduct.execute({ id })

    if (result.isLeft()) {
      throw new NotFoundException()
    }
  }
}
