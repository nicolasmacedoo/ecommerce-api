import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { GetProductByIdUseCase } from "./get-product-by-id";
import { makeProduct } from "test/factories/make-product";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: GetProductByIdUseCase;

describe('Get Product By ID', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new GetProductByIdUseCase(inMemoryProductsRepository);
  });

  it('should be able to get a product by id', async () => {
    // Create a product with a specific ID
    const productId = new UniqueEntityID('product-1');
    const product = makeProduct({}, productId);
    
    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      id: productId.toString(),
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be able to get a non-existing product', async () => {
    const result = await sut.execute({
      id: 'non-existing-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
