import type { UsersRepository } from '@/domain/ecommerce/application/repositories/users-repository'
import type { User } from '@/domain/ecommerce/enterprise/entities/user'
import type { UserWithRoleAndPermissions } from '@/domain/ecommerce/enterprise/entities/value-objects/user-with-role-and-permissions'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []
  public itemsWithRoleAndPermissions: UserWithRoleAndPermissions[] = []

  async findByEmailWithRoleAndPermissions(
    email: string
  ): Promise<UserWithRoleAndPermissions | null> {
    const user = this.itemsWithRoleAndPermissions.find(item => item.email === email)

    if (user) {
      return user
    }

    // Se não encontrou no array itemsWithRoleAndPermissions, procura no array items
    const basicUser = this.items.find(item => item.email === email)
    
    if (basicUser) {
      // Converte o usuário básico para um formato compatível com UserWithRoleAndPermissions
      return {
        ...basicUser,
        role: 'user', // role padrão para o teste
        permissions: [] // array vazio de permissões
      } as unknown as UserWithRoleAndPermissions
    }

    return null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find(item => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const userIndex = this.items.findIndex(item => item.id === user.id)

    if (userIndex >= 0) {
      this.items[userIndex] = user
    } else {
      this.items.push(user)
    }
  }
}
