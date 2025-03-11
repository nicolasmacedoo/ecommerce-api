import { Module } from '@nestjs/common'
import { HttpModule } from '@/infra/http/http.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { OrderProcessor } from '@/domain/ecommerce/application/services/order-processor'
import { OnOrderCreated } from '@/domain/ecommerce/application/subscribers/on-order-created'

@Module({
  imports: [HttpModule, DatabaseModule],
  providers: [OrderProcessor, OnOrderCreated],
  exports: [],
})
export class ApplicationModule {}
