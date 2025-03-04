import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { EditProductUseCase } from '@/domain/ecommerce/application/use-cases/edit-product'

const editProductBodySchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  stockQuantity: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(editProductBodySchema)

type EditProductBodySchema = z.infer<typeof editProductBodySchema>

@Controller('/products/:id')
export class EditProductController {
  constructor(private readonly editProduct: EditProductUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditProductBodySchema,
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
      throw new BadRequestException()
    }
  }
}
