import  { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Customer, type CustomerProps } from "@/domain/ecommerce/enterprise/entities/customer"
import { faker } from "@faker-js/faker/."

export function makeCustomer(
  overrides: Partial<CustomerProps> = {},
  id?: UniqueEntityID
) {
  const customer = Customer.create(
    {
      userId: new UniqueEntityID(),
      fullName: faker.person.fullName(),
      address: faker.location.streetAddress(),
      contact: faker.phone.number(),
      ...overrides,
    },
    id
  )
  return customer
}