import { left, right, type Either } from '@/core/either'
import { Customer } from '../../enterprise/entities/customer'
import { Role, User } from '../../enterprise/entities/user'
import { CustomersRepository } from '../repositories/customers-repository'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { HashGenerator } from '../criptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { MissingRequiredFieldsError } from './errors/missing-required-fields-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MailService } from '@/infra/mail/mail.service'
import { getTestMessageUrl } from 'nodemailer'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
  role: Role
  roleId: string
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
    private readonly customersRepository: CustomersRepository,
    private readonly mailService: MailService
  ) {}

  async execute({
    name,
    email,
    password,
    role,
    roleId,
    address,
    contact,
    fullName,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)
    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError(email))
    }

    if (role === Role.CUSTOMER) {
      if (!fullName || !contact || !address) {
        return left(
          new MissingRequiredFieldsError(['fullName', 'contact', 'address'])
        )
      }
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      roleId: new UniqueEntityID(roleId),
      name,
      email,
      password: hashedPassword,
    })

    await this.usersRepository.create(user)

    if (role === Role.CUSTOMER && fullName && contact && address) {
      const customer = Customer.create({
        userId: user.id,
        fullName,
        contact,
        address,
      })

      await this.customersRepository.create(customer)
    }

    try {
      const confirmationLink = `http://localhost:3333/api/accounts/${user.id}/verify-email`

      const message = await this.mailService.sendAccountConfirmationEmail({
        to: {
          name: user.name,
          address: user.email,
        },
        from: {
          name: 'Team ecommerce',
          address: 'hello@ecommerce.com',
        },
        link: confirmationLink,
      })

      console.log('Confirmation email sent:', getTestMessageUrl(message))
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
    }

    return right({
      user,
    })
  }
}
