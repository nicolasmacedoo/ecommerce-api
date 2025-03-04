import { DeleteProductUseCase } from '@/domain/ecommerce/application/use-cases/delete-product'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/products/:id')
export class DeleteProductController {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.deleteProductUseCase.execute({ id })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
