import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './role.decorator'
import { Role } from '@/domain/ecommerce/enterprise/entities/user'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    console.log('requiredRoles', requiredRoles)

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    console.log('user', user)

    if (!user || !user.role) {
      return false
    }

    const hasRole = requiredRoles.some(role => user.role === role)

    return hasRole
  }
}
