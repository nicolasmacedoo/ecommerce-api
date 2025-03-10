import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { RolesGuard } from './role.guard'
import { PermissionsGuard } from './permissions.guard'
import { JwtStrategy } from './jwt.strategy'
import { EnvModule } from '@/infra/env/env.module'
import { EnvService } from '@/infra/env/env.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory: async (env: EnvService) => ({
        secret: env.get('JWT_SECRET'),
        signOptions: { expiresIn: '1 day', algorithm: 'HS256' },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    JwtStrategy,
    EnvService,
  ],
})
export class AuthModule {}
