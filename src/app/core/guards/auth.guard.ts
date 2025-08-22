import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { TokenService } from '../services/token.service';
import { MockAuthService } from '../services/mock-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private mockAuthService: MockAuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Primeiro tenta usar o token real
    if (this.tokenService.getToken()) {
      return true;
    }

    // Se não há token real, verifica se está em modo mock
    if (
      this.mockAuthService.isInMockMode() &&
      this.mockAuthService.isAuthenticated()
    ) {
      return true;
    }

    // Se não está autenticado de nenhuma forma, redireciona para login
    this.router.navigate(['/auth/login']);
    return false;
  }
}
