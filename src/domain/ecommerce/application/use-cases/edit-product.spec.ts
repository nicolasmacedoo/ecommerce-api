import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { EditProductUseCase } from "./edit-product";
import { makeProduct } from "test/factories/make-product";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

let inMemoryProductsRepository: InMemoryProductsRepository;
let sut: EditProductUseCase;

describe('Edit Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new EditProductUseCase(inMemoryProductsRepository);
  });

  it('should be able to edit a product', async () => {
    // Create a product first
    const product = makeProduct();
    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      id: product.id.toString(),
      name: 'Updated Product Name',
      description: 'Updated Product Description',
      price: 150,
      stockQuantity: 20,
    });

    expect(result.isRight()).toBe(true);
    
    if (result.isRight()) {
      expect(result.value.product.name).toEqual('Updated Product Name');
      expect(result.value.product.description).toEqual('Updated Product Description');
      expect(result.value.product.price).toEqual(150);
      expect(result.value.product.stockQuantity).toEqual(20);
    }
  });

  it('should not be able to edit a non-existing product', async () => {
    const result = await sut.execute({
      id: 'non-existing-id',
      name: 'Updated Product Name',
      description: 'Updated Product Description',
      price: 150,
      stockQuantity: 20,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
