import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { FetchProductsUseCase } from '@/domain/ecommerce/application/use-cases/fetch-products'
import { ProductPresenter } from '../presenters/product-presenter'
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { FetchProductsDTO } from './dtos/product.dto'

const queryParamSchema = z.string().optional()

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type QueryParamSchema = z.infer<typeof queryParamSchema>

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Products')
@Controller('/products')
export class FetchProductsController {
  constructor(private readonly fetchProducts: FetchProductsUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch list of products with pagination and optional query',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starts at 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Query string to search for product name',
    type: String,
    example: 'Laptop',
  })
  @ApiResponse({
    status: 200,
    description: 'Products fetched successfully',
    type: FetchProductsDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  async handle(
    @Query('page', pageValidationPipe) page: PageQueryParamSchema,
    @Query('query', queryValidationPipe) query: QueryParamSchema
  ) {
    const result = await this.fetchProducts.execute({ page, query })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { products } = result.value

    return {
      products: products.map(ProductPresenter.toHTTP),
    }
  }
}
