import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from './permissions.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!requiredPermissions) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    if (!user || !user.permissions) {
      return false
    }

    const hasPermissions = requiredPermissions.every(permission =>
      user.permissions?.includes(permission)
    )

    return hasPermissions
  }
}
