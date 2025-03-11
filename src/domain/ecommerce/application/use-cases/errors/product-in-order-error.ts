import type { UseCaseError } from '@/core/errors/use-case-error'

export class ProductInOrderError extends Error implements UseCaseError {
  constructor(productId: string) {
    super(
      `Is not possible to delete product ${productId} because it is in an order`
    )
    this.name = 'ProductInOrderError'
  }
}
