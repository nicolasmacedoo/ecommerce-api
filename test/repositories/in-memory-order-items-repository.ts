import type { OrderItemsRepository } from "@/domain/ecommerce/application/repositories/order-items-repository";
import type { OrderItem } from "@/domain/ecommerce/enterprise/entities/order-item";

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  public items: OrderItem[] = [];

  async createMany(orderItems: OrderItem[]): Promise<void> {
    this.items.push(...orderItems);
  }

  async deleteMany(orderItems: OrderItem[]): Promise<void> {
    const orderItemsToDelete = new Set(orderItems.map(item => item.id));

    this.items = this.items.filter(item => !orderItemsToDelete.has(item.id));
  }

  async findManyByOrderId(orderId: string): Promise<OrderItem[]> {
    const orderItems = this.items.filter(item => item.orderId.toString() === orderId);

    if (!orderItems.length) {
      return [];
    }

    return orderItems;
  }

  async findManyByProductId(productId: string): Promise<OrderItem[]> {
    const orderItems = this.items.filter(item => item.productId.toString() === productId);

    if (!orderItems.length) {
      return [];
    }

    return orderItems;
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    const orderItemsToDelete = new Set(this.items.filter(item => item.orderId.toString() === orderId).map(item => item.id));

    this.items = this.items.filter(item => !orderItemsToDelete.has(item.id));
  }
}