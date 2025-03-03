import { left, right, type Either } from '@/core/either'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import type { UsersRepository } from '../repositories/users-repository'
import type { HashComparer } from '../criptography/hash-comparer'
import type { Encrypter } from '../criptography/encrypter'

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

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
