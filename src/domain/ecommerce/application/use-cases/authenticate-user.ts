import { left, right, type Either } from '@/core/either'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { UsersRepository } from '../repositories/users-repository'
import { HashComparer } from '../criptography/hash-comparer'
import { Encrypter } from '../criptography/encrypter'
import { Injectable } from '@nestjs/common'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordCorrect = await this.hashComparer.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return left(new InvalidCredentialsError())
    }

    const permissions = user.permissions.map(permission => permission.name)

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role,
      permissions,
    })

    return right({
      accessToken,
    })
  }
}
