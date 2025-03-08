import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RegisterUserUseCase } from '@/domain/ecommerce/application/use-cases/register-user'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/ecommerce/application/use-cases/authenticate-user'
import { FetchProductsController } from './controllers/fetch-products.controller'
import { FetchProductsUseCase } from '@/domain/ecommerce/application/use-cases/fetch-products'
import { CreateProductController } from './controllers/create-product.controller'
import { GetProductByIdController } from './controllers/get-product-by-id.controller'
import { EditProductController } from './controllers/edit-product.controller'
import { DeleteProductController } from './controllers/delete-product.controller'
import { CreateProductUseCase } from '@/domain/ecommerce/application/use-cases/create-product'
import { GetProductByIdUseCase } from '@/domain/ecommerce/application/use-cases/get-product-by-id'
import { EditProductUseCase } from '@/domain/ecommerce/application/use-cases/edit-product'
import { DeleteProductUseCase } from '@/domain/ecommerce/application/use-cases/delete-product'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateOrderUseCase } from '@/domain/ecommerce/application/use-cases/create-order'
import { EditOrderController } from './controllers/edit-order.controller'
import { EditOrderUseCase } from '@/domain/ecommerce/application/use-cases/edit-order'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/ecommerce/application/use-cases/delete-order'
import { FetchOrdersController } from './controllers/fetch-recent-orders.controller'
import { FetchOrdersUseCase } from '@/domain/ecommerce/application/use-cases/fetch-recent-orders'
import { GetOrderByIdUseCase } from '@/domain/ecommerce/application/use-cases/get-order-by-id'
import { GetOrderByIdController } from './controllers/get-order-by-id.controller'
import { GetCustomerByIdController } from './controllers/get-customer-by-id.controller'
import { GetCustomerByIdUseCase } from '@/domain/ecommerce/application/use-cases/get-customer-by-id'
import { FetchCustomersController } from './controllers/fetch-customers.controller'
import { FetchCustomersUseCase } from '@/domain/ecommerce/application/use-cases/fetch-customers'
import { DeleteCustomerUseCase } from '@/domain/ecommerce/application/use-cases/delete-customer'
import { DeleteCustomerController } from './controllers/delete-customer.controller'
import { EditCustomerUseCase } from '@/domain/ecommerce/application/use-cases/edit-customer'
import { EditCustomerController } from './controllers/edit-customer.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateProductController,
    GetProductByIdController,
    FetchProductsController,
    EditProductController,
    DeleteProductController,
    CreateOrderController,
    EditOrderController,
    DeleteOrderController,
    FetchOrdersController,
    GetOrderByIdController,
    FetchCustomersController,
    GetCustomerByIdController,
    DeleteCustomerController,
    EditCustomerController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreateProductUseCase,
    GetProductByIdUseCase,
    FetchProductsUseCase,
    EditProductUseCase,
    DeleteProductUseCase,
    CreateOrderUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
    FetchOrdersUseCase,
    GetOrderByIdUseCase,
    FetchCustomersUseCase,
    GetCustomerByIdUseCase,
    DeleteCustomerUseCase,
    EditCustomerUseCase,
  ],
})
export class HttpModule {}
