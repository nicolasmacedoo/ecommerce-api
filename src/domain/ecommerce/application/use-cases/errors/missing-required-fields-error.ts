import type { UseCaseError } from '@/core/errors/use-case-error'

export class MissingRequiredFieldsError extends Error implements UseCaseError {
  constructor(fields: string[]) {
    super(`Missing required fields: ${fields.join(', ')}`)
  }
}
