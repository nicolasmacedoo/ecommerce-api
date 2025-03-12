import { StorageClient } from '@/domain/ecommerce/application/storage/storage-client'
import { Module } from '@nestjs/common'
import { FileSystemStorage } from './file-system-storage'

@Module({
  imports: [],
  providers: [
    {
      provide: StorageClient,
      useClass: FileSystemStorage,
    },
  ],
  exports: [StorageClient],
})
export class StorageModule {}
