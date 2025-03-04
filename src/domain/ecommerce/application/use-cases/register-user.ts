import { left, right, type Either } from 'src/core/either'
import { Customer } from '../../enterprise/entities/customer'
import { User, type UserRole } from '../../enterprise/entities/user'
import { CustomersRepository } from '../repositories/customers-repository'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { HashGenerator } from '../criptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { MissingRequiredFieldsError } from './errors/missing-required-fields-error'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
  role: UserRole
  fullName?: string
  contact?: string
  address?: string
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError | MissingRequiredFieldsError,
  {
    user: User
  }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly hashGenerator: HashGenerator,
    private readonly usersRepository: UsersRepository,
    private readonly customersRepository: CustomersRepository
  ) {}

  async execute({
    name,
    email,
    password,
    role,
    address,
    contact,
    fullName,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)
    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError(email))
    }

    if (role === 'CUSTOMER') {
      if (!fullName || !contact || !address) {
        return left(
          new MissingRequiredFieldsError(['fullName', 'contact', 'address'])
        )
      }
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    await this.usersRepository.create(user)

    if (role === 'CUSTOMER' && fullName && contact && address) {
      const customer = Customer.create({
        userId: user.id,
        fullName,
        contact,
        address,
      })

      await this.customersRepository.create(customer)
    }

    return right({
      user,
    })
  }
}
