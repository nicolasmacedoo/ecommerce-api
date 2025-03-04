import { Encrypter } from '@/domain/ecommerce/application/criptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { HashComparer } from '@/domain/ecommerce/application/criptography/hash-comparer'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/ecommerce/application/criptography/hash-generator'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
