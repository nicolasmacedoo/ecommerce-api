import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { makeUser } from "test/factories/make-user";
import  { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import  { CreateProductUseCase } from "./create-product";

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()

    sut = new CreateProductUseCase(
      inMemoryProductsRepository
    )
  })
  
  it('should be able to create a product', async () => {
    const result = await sut.execute({
      name: 'Product Name',
      description: 'Product Description',
      price: 100,
      stockQuantity: 10,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items[0]).toEqual(result.value?.product)
  })
})