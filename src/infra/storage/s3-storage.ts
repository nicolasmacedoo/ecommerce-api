import { Injectable } from '@nestjs/common'
// import { S3 } from 'aws-sdk'
import { StorageClient } from '@/domain/ecommerce/application/storage/storage-client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3Storage implements StorageClient {
  // private client: S3

  constructor(private configService: ConfigService) {
    // this.client = new S3({
    //   region: this.configService.get('AWS_REGION'),
    //   credentials: {
    //     accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    //     secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    //   },
    // })
  }

  async upload(params: {
    fileName: string
    fileContent: string
    contentType: string
  }): Promise<{ url: string; path: string }> {
    const bucket = this.configService.get('AWS_BUCKET_NAME')
    const key = `reports/${params.fileName}`

    // await this.client
    //   .putObject({
    //     Bucket: bucket,
    //     Key: key,
    //     Body: params.fileContent,
    //     ContentType: params.contentType,
    //   })
    //   .promise()

    return {
      url: `https://${bucket}.s3.amazonaws.com/${key}`,
      path: key,
    }
  }
}
