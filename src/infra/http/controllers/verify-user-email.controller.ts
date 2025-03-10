import { VerifyUserEmailUseCase } from '@/domain/ecommerce/application/use-cases/verify-user-email'
import { Public } from '@/infra/auth/public'
import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Accounts')
@Controller('/accounts')
@Public()
export class VerifyUserEmailController {
  constructor(private readonly verifyUserEmail: VerifyUserEmailUseCase) {}

  @Get('/:userId/verify-email')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Email verified successfully',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async handle(@Param('userId') userId: string) {
    const result = await this.verifyUserEmail.execute({ id: userId })

    if (result.isLeft()) {
      const error = result.value
      throw new NotFoundException(error.message)
    }

    return {
      message: 'Email verified successfully',
    }
  }
}
