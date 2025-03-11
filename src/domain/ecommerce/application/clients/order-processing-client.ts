export abstract class OrderProcessingClient {
  abstract process(orderId: string, totalAmount: number): Promise<boolean>
}
