import { Injectable } from '@nestjs/common'
import { StorageClient } from '@/domain/ecommerce/application/storage/storage-client'
import * as fs from 'node:fs'
import * as path from 'node:path'

@Injectable()
export class FileSystemStorage implements StorageClient {
  private readonly baseDir: string = path.join(process.cwd(), '@/sales-report')

  constructor() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true })
    }
  }

  async upload(params: {
    fileName: string
    fileContent: string
    contentType: string
  }): Promise<{ url: string; path: string }> {
    const filePath = path.join(this.baseDir, params.fileName)

    await fs.promises.writeFile(filePath, params.fileContent, 'utf-8')

    return {
      url: `file://${filePath}`,
      path: filePath,
    }
  }
}
