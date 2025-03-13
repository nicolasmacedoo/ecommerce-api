import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, type UserProps } from "@/domain/ecommerce/enterprise/entities/user";
import {faker} from '@faker-js/faker'

export function makeUser(overrides: Partial<UserProps> = {}, id?:UniqueEntityID) {
  const user = User.create({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: new UniqueEntityID(),
    ...overrides,
  }, id)
  return user
}
 