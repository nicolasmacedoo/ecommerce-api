import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { DeleteProductUseCase } from "./delete-product";
import { makeProduct } from "test/factories/make-product";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import  { InMemoryOrderItemsRepository } from "test/repositories/in-memory-order-items-repository";
import { ProductInOrderError } from "./errors/product-in-order-error";
import { OrderItem } from "../../enterprise/entities/order-item";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository;
let sut: DeleteProductUseCase;

describe('Delete Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository();
    sut = new DeleteProductUseCase(
      inMemoryProductsRepository,
      inMemoryOrderItemsRepository
    );
  });

  it('should be able to delete a product', async () => {
    // Create a product
    const product = makeProduct();
    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      id: product.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a non-existing product', async () => {
    const result = await sut.execute({
      id: 'non-existing-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete a product that is in an order', async () => {
    // Create a product
    const product = makeProduct();
    await inMemoryProductsRepository.create(product);

    // Create an order item with this product
    const orderItem = OrderItem.create({
      orderId: new UniqueEntityID('order-1'),
      productId: product.id,
      price: 100,
      quantity: 1,
    });

    inMemoryOrderItemsRepository.items.push(orderItem);

    const result = await sut.execute({
      id: product.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductInOrderError);
    expect(inMemoryProductsRepository.items).toHaveLength(1);
  });
});
