import type { UseCaseError } from '@/core/errors/use-case-error'

export class InativeCustomerError extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Customer ${name} is inactive`)
    this.name = 'InativeCustomerError'
  }
}
