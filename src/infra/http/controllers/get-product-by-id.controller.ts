import { GetProductByIdUseCase } from '@/domain/ecommerce/application/use-cases/get-product-by-id'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ProductPresenter } from '../presenters/product-presenter'

@Controller('/products/:id')
export class GetProductByIdController {
  constructor(private readonly getProductByIdUseCase: GetProductByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getProductByIdUseCase.execute({ id })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { product: ProductPresenter.toHTTP(result.value.product) }
  }
}
