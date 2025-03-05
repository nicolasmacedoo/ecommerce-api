import { RegisterUserUseCase } from '@/domain/ecommerce/application/use-cases/register-user'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { UserAlreadyExistsError } from '@/domain/ecommerce/application/use-cases/errors/user-already-exists-error'
import { MissingRequiredFieldsError } from '@/domain/ecommerce/application/use-cases/errors/missing-required-fields-error'
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createAccountBodySchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6),
  role: z.enum(['CUSTOMER', 'ADMIN']),
  fullName: z.string().optional(),
  contact: z.string().optional(),
  address: z.string().optional(),
})

export class CreateAccountDTO extends createZodDto(createAccountBodySchema) {}

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)

@ApiTags('Accounts')
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiCreatedResponse({
    description: 'Account created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Missing required fields or invalid input data',
  })
  @ApiConflictResponse({
    description: 'Email already in use',
  })
  async handle(@Body(bodyValidationPipe) body: CreateAccountDTO) {
    const { name, email, password, role, address, contact, fullName } = body

    const result = await this.registerUser.execute({
      name,
      email,
      password,
      role,
      fullName,
      contact,
      address,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        case MissingRequiredFieldsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
