import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UsersRepository } from '../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface VerifyUserEmailUseCaseRequest {
  id: string
}

type VerifyUserEmailUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class VerifyUserEmailUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    id,
  }: VerifyUserEmailUseCaseRequest): Promise<VerifyUserEmailUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      return left(new ResourceNotFoundError(`User with id ${id}`))
    }

    user.emailVerified = true

    await this.usersRepository.save(user)

    return right(null)
  }
}
