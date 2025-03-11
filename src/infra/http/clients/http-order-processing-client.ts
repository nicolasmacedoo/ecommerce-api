import { Injectable } from '@nestjs/common'
import { OrderProcessingClient } from '@/domain/ecommerce/application/clients/order-processing-client'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class HttpOrderProcessingClient implements OrderProcessingClient {
  constructor(private readonly httpService: HttpService) {}

  async process(orderId: string, totalAmount: number): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 20000))

      const response = await firstValueFrom(
        this.httpService.post(
          'https://67cf6b49823da0212a826295.mockapi.io/api/v1/payment'
        )
      )

      return response.data.paymentStatus
    } catch (error) {
      console.error('Error processing order payment:', error)
      return false
    }
  }
}
