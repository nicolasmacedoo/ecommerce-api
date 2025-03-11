import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'
import { MailModule } from './mail/mail.module'
import { ApplicationModule } from '@/infra/http/clients/application.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    MailModule,
    ApplicationModule,
  ],
})
export class AppModule {}
