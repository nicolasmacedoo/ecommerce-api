import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateProductUseCase } from '@/domain/ecommerce/application/use-cases/create-product'

const createProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  stockQuantity: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
export class CreateProductController {
  constructor(private readonly createProduct: CreateProductUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateProductBodySchema) {
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
