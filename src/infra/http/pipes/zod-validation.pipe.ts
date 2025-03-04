import {
  BadRequestException,
  type ArgumentMetadata,
  type PipeTransform,
} from '@nestjs/common'
import { ZodError, type ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: error.flatten().fieldErrors,
          error: 'Validation failed',
          statusCode: 400,
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }
}
