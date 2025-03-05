import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { Public } from '@/infra/auth/public'
import { AuthenticateUserUseCase } from '@/domain/ecommerce/application/use-cases/authenticate-user'
import { InvalidCredentialsError } from '@/domain/ecommerce/application/use-cases/errors/invalid-credentials-error'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

class AuthTokenResponseDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string
}

const authenticateBodySchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6),
})

export class AuthenticateDTO extends createZodDto(authenticateBodySchema) {}

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

@ApiTags('Authentication')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private readonly authenticate: AuthenticateUserUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Authenticate a user',
    description: 'Returns a JWT token when authentication is successful',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: AuthTokenResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  async handle(@Body(bodyValidationPipe) body: AuthenticateDTO) {
    const { email, password } = body

    const result = await this.authenticate.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
