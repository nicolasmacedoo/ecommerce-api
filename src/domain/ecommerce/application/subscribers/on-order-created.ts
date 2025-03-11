import { DomainEvents } from '@/core/events/domain-events'
import { Injectable } from '@nestjs/common'
import { OrderCreatedEvent } from '../../enterprise/events/order-created-event'
import { OrderProcessor } from '../services/order-processor'
import { EventHandler } from '@/core/events/event-handler'

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(private orderProcessor: OrderProcessor) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.onOrderCreated.bind(this),
      OrderCreatedEvent.name
    )
  }

  private async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    console.log(
      `Order created event received for order ${event.order.id.toString()}`
    )
    try {
      await this.orderProcessor.process(event.order.id.toString())
      console.log(`Order ${event.order.id.toString()} processed successfully`)
    } catch (error) {
      console.error(
        `Error processing order ${event.order.id.toString()}:`,
        error
      )
    }
  }
}
