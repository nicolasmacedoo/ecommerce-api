import { ApiProperty } from '@nestjs/swagger'

export class ProductDTO {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the product',
  })
  id: string

  @ApiProperty({
    example: 'Smartphone XYZ',
    description: 'Product name',
  })
  name: string

  @ApiProperty({
    example: 'Latest smartphone with amazing features',
    description: 'Detailed product description',
  })
  description: string

  @ApiProperty({
    example: 899.99,
    description: 'Product price in USD',
  })
  price: number

  @ApiProperty({
    example: 50,
    description: 'Available quantity in stock',
  })
  stockQuantity: number

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date when the product was created',
  })
  createdAt: Date

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Date when the product was last updated',
  })
  updatedAt: Date
}

export class FetchProductsDTO {
  @ApiProperty({ type: [ProductDTO] })
  products: ProductDTO[]
}
