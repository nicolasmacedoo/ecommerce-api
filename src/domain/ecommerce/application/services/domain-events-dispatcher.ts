import { Injectable, OnModuleInit } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class DomainEventsDispatcher implements OnModuleInit {
  onModuleInit() {
    console.log('Domain events dispatcher initialized')
  }

  public dispatchEventsForAggregate(id: UniqueEntityID) {
    DomainEvents.dispatchEventsForAggregate(id)
  }
}
