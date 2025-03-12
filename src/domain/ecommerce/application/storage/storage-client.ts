export abstract class StorageClient {
  abstract upload(params: {
    fileName: string
    fileContent: string
    contentType: string
  }): Promise<{ url: string; path: string }>
}
