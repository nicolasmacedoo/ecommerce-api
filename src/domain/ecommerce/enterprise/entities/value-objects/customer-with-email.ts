import { ValueObject } from '@/core/entities/value-object'

interface CustomerWithEmailProps {
  id: string
  userId: string
  email: string
  fullName: string
  contact: string
  address: string
  status: boolean
  createdAt: Date
  updatedAt: Date
}

export class CustomerWithEmail extends ValueObject<CustomerWithEmailProps> {
  static create(props: CustomerWithEmailProps): CustomerWithEmail {
    return new CustomerWithEmail(props)
  }

  get id(): string {
    return this.props.id
  }

  get userId(): string {
    return this.props.userId
  }

  get email(): string {
    return this.props.email
  }
  get fullName(): string {
    return this.props.fullName
  }
  get contact(): string {
    return this.props.contact
  }
  get address(): string {
    return this.props.address
  }
  get status(): boolean {
    return this.props.status
  }
  get createdAt(): Date {
    return this.props.createdAt
  }
  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
