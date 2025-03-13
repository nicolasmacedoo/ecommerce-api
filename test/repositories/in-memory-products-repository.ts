import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { ProductsRepository } from "@/domain/ecommerce/application/repositories/products-repository";
import type { Product } from "@/domain/ecommerce/enterprise/entities/product";

export class InMemoryProductsRepository implements ProductsRepository{
  public items: Product[] = [];

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const products = this.items.filter((item) => ids.includes(item.id.toString()));

    return products;
  }

  async create(entity: Product): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async findMany(params: PaginationParams): Promise<Product[]> {
    const { page, query } = params;

    const start = (page - 1) * 10;
    const end = start + 10;

    if (!query) {
      return this.items.slice(start, end);
    }
    const filteredProducts = this.items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice(start, end);
    return paginatedProducts;
  }

  async save(entity: Product): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === entity.id);

    if (productIndex >= 0) {
      this.items[productIndex] = entity;
    }
  }

  async delete(entity: Product): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id === entity.id);

    if (productIndex >= 0) {
      this.items.splice(productIndex, 1);
    }
  }
}