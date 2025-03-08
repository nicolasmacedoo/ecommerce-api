import { ApiProperty } from '@nestjs/swagger'

export class CustomerDTO {
  @ApiProperty({
    description: 'Unique identifier for the customer',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'User ID associated with the customer',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string

  @ApiProperty({
    description: 'Full name of the customer',
    example: 'John Doe',
  })
  name: string

  @ApiProperty({
    description: 'Contact information of the customer',
    example: '(11) 98765-4321',
  })
  contact: string

  @ApiProperty({
    description: 'Address of the customer',
    example: 'Av Paulista, 1000, São Paulo, SP',
  })
  address: string

  @ApiProperty({
    description: 'Status of the customer',
    example: true,
  })
  status: boolean

  @ApiProperty({
    description: 'Date when the customer was created',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Date when the customer was last updated',
    example: '2023-10-01T12:00:00Z',
  })
  updatedAt: Date
}

export class FetchCustomersResponseDto {
  @ApiProperty({
    description: 'List of customers',
    type: [CustomerDTO],
  })
  customers: CustomerDTO[]
}
