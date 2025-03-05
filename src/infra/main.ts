import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const envService = app.get(EnvService)

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('REST API for a simplified e-commerce management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  patchNestJsSwagger()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory())

  app.setGlobalPrefix('api')

  const PORT = envService.get('PORT')

  await app.listen(PORT)
}
bootstrap()
