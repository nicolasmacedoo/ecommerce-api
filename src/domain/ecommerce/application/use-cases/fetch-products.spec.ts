import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { FetchProductsUseCase } from "./fetch-products";
import { makeProduct } from "test/factories/make-product";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: FetchProductsUseCase;

describe('Fetch Products', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new FetchProductsUseCase(inMemoryProductsRepository);
  });

  it('should be able to fetch products with pagination', async () => {
    // Create 3 products
    for (let i = 0; i < 3; i++) {
      await inMemoryProductsRepository.create(makeProduct({
        name: `Product ${i+1}`,
      }));
    }

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products).toHaveLength(3);
  });

  it('should be able to filter products by name', async () => {
    // Create products with different names
    await inMemoryProductsRepository.create(makeProduct({
      name: 'Smartphone',
    }));
    
    await inMemoryProductsRepository.create(makeProduct({
      name: 'Laptop',
    }));
    
    await inMemoryProductsRepository.create(makeProduct({
      name: 'Smart TV',
    }));

    const result = await sut.execute({
      page: 1,
      query: 'Smart',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products).toHaveLength(2);
    expect(result.value?.products[0].name).toContain('Smart');
    expect(result.value?.products[1].name).toContain('Smart');
  });

  it('should return empty array when no products match the query', async () => {
    await inMemoryProductsRepository.create(makeProduct({
      name: 'Smartphone',
    }));

    const result = await sut.execute({
      page: 1,
      query: 'Nonexistent',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products).toHaveLength(0);
  });
});
