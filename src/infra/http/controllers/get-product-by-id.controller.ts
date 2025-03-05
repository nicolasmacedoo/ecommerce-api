import { GetProductByIdUseCase } from '@/domain/ecommerce/application/use-cases/get-product-by-id'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ProductPresenter } from '../presenters/product-presenter'
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { ProductDTO } from './dtos/product.dto'

@ApiTags('Products')
@Controller('/products/:id')
export class GetProductByIdController {
  constructor(private readonly getProductByIdUseCase: GetProductByIdUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product found successfully',
    type: ProductDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid product ID or product not found',
  })
  async handle(@Param('id') id: string) {
    const result = await this.getProductByIdUseCase.execute({ id })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { product: ProductPresenter.toHTTP(result.value.product) }
  }
}
