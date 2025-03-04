import type { HashComparer } from '@/domain/ecommerce/application/criptography/hash-comparer'
import type { HashGenerator } from '@/domain/ecommerce/application/criptography/hash-generator'
import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly HASH_SALT_ROUNDS = 8

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_ROUNDS)
  }

  compare(plain: string, hashedValue: string): Promise<boolean> {
    return compare(plain, hashedValue)
  }
}
