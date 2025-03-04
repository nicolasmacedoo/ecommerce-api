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
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreateProductUseCase,
    GetProductByIdUseCase,
    FetchProductsUseCase,
    EditProductUseCase,
    DeleteProductUseCase,
  ],
})
export class HttpModule {}
