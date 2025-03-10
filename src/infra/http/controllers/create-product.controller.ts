import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateProductUseCase } from '@/domain/ecommerce/application/use-cases/create-product'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { Roles } from '@/infra/auth/role.decorator'
import { Role } from '@/domain/ecommerce/enterprise/entities/user'
import { RequirePermissions } from '@/infra/auth/permissions.decorator'

const createProductBodySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters long' }),
  price: z.number(),
  description: z.string(),
  stockQuantity: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)

export class CreateProductDTO extends createZodDto(createProductBodySchema) {}

@ApiTags('Products')
@Controller('/products')
export class CreateProductController {
  constructor(private readonly createProduct: CreateProductUseCase) {}

  @Post()
  @Roles(Role.ADMIN)
  @RequirePermissions('product:create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid product data' })
  async handle(@Body(bodyValidationPipe) body: CreateProductDTO) {
    const { name, description, price, stockQuantity } = body

    const result = await this.createProduct.execute({
      name,
      description,
      price,
      stockQuantity,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
