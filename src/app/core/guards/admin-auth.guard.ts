import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';
import { NotificationService } from '../services/notification.service';
import { AdminPermission } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdminAccess(route, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdminAccess(childRoute, state);
  }

  private checkAdminAccess(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.adminAuthService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          // Não está autenticado - redirecionar para login administrativo
          this.notificationService.showWarning(
            'Você precisa fazer login como administrador'
          );
          this.router.navigate(['/admin/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }

        // Verificar permissões específicas da rota
        const requiredPermissions = route.data[
          'permissions'
        ] as AdminPermission[];
        if (requiredPermissions && requiredPermissions.length > 0) {
          const hasPermission =
            this.adminAuthService.hasPermissions(requiredPermissions);

          if (!hasPermission) {
            this.notificationService.showError(
              'Você não tem permissão para acessar esta área'
            );
            this.router.navigate(['/admin/dashboard']);
            return false;
          }
        }

        // Verificar se é super admin para certas rotas
        const requiresSuperAdmin = route.data['requiresSuperAdmin'] as boolean;
        if (requiresSuperAdmin && !this.adminAuthService.isSuperAdmin()) {
          this.notificationService.showError(
            'Esta área é restrita apenas para super administradores'
          );
          this.router.navigate(['/admin/dashboard']);
          return false;
        }

        return true;
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdminLoginGuard implements CanActivate {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.adminAuthService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Já está autenticado - redirecionar para dashboard admin
          this.router.navigate(['/admin/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}
