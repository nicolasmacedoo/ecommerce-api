import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { EditProductUseCase } from '@/domain/ecommerce/application/use-cases/edit-product'
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
import { RolesGuard } from '@/infra/auth/role.guard'
import { PermissionsGuard } from '@/infra/auth/permissions.guard'
import { Roles } from '@/infra/auth/role.decorator'
import { RequirePermissions } from '@/infra/auth/permissions.decorator'
import { Role } from '@/domain/ecommerce/enterprise/entities/user'

const editProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  stockQuantity: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(editProductBodySchema)

class EditProductDTO extends createZodDto(editProductBodySchema) {}

@ApiTags('Products')
@Controller('/products/:id')
export class EditProductController {
  constructor(private readonly editProduct: EditProductUseCase) {}

  @Put()
  @HttpCode(204)
  @Roles(Role.ADMIN)
  @RequirePermissions('product:update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBadRequestResponse({ description: 'Invalid product data' })
  @ApiNoContentResponse({
    description: 'Product updated successfully',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  async handle(
    @Body(bodyValidationPipe) body: EditProductDTO,
    @Param('id') id: string
  ) {
    const { name, description, price, stockQuantity } = body

    const result = await this.editProduct.execute({
      id,
      name,
      description,
      price,
      stockQuantity,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }
  }
}
