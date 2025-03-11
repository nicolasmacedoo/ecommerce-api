import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'
import type { Order } from '../entities/order'

export class OrderCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order

  constructor(order: Order) {
    this.ocurredAt = new Date()
    this.order = order
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}
