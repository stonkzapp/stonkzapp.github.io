import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  AdminUser,
  AdminLoginRequest,
  AdminAuthentication,
  AdminPermission,
} from '../models/models';
import { BaseService } from './base.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService extends BaseService {
  private readonly ADMIN_TOKEN_KEY = 'admin_access_token';
  private readonly ADMIN_REFRESH_TOKEN_KEY = 'admin_refresh_token';
  private readonly ADMIN_USER_KEY = 'admin_user';

  private currentAdminUserSubject = new BehaviorSubject<AdminUser | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentAdminUser$ = this.currentAdminUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private storageService: StorageService) {
    super();
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const adminUser = this.storageService.getLocalItem(this.ADMIN_USER_KEY);
    const token = this.storageService.getLocalItem(this.ADMIN_TOKEN_KEY);

    if (adminUser && token) {
      this.currentAdminUserSubject.next(JSON.parse(adminUser));
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Login administrativo
  login(credentials: AdminLoginRequest): Observable<AdminAuthentication> {
    // Mock para desenvolvimento - implementar com backend real
    return this.mockAdminLogin(credentials).pipe(
      tap(response => {
        this.setAdminAuth(response);
      }),
      catchError(error => {
        console.error('Erro no login administrativo:', error);
        return throwError(() => error);
      })
    );
  }

  // Mock de login administrativo (simula backend)
  private mockAdminLogin(
    credentials: AdminLoginRequest
  ): Observable<AdminAuthentication> {
    // Credenciais de administrador (apenas para desenvolvimento)
    const ADMIN_CREDENTIALS = {
      email: 'admin@stonkz.com',
      password: 'Stonkz@Admin2024!',
    };

    // Simular delay de rede
    return new Observable(observer => {
      setTimeout(() => {
        if (
          credentials.email === ADMIN_CREDENTIALS.email &&
          credentials.password === ADMIN_CREDENTIALS.password
        ) {
          const mockAdmin: AdminUser = {
            id: 'admin-001',
            email: 'admin@stonkz.com',
            name: 'Administrador Principal',
            role: 'super_admin',
            permissions: [
              'view_users',
              'manage_users',
              'view_metrics',
              'manage_pricing',
              'view_subscriptions',
              'manage_subscriptions',
              'view_transactions',
              'manage_transactions',
              'system_settings',
            ],
            lastLogin: new Date(),
            createdAt: new Date('2024-01-01'),
            isActive: true,
          };

          const response: AdminAuthentication = {
            accessToken: 'admin_mock_access_token_' + Date.now(),
            refreshToken: 'admin_mock_refresh_token_' + Date.now(),
            adminUser: mockAdmin,
            expiresIn: 3600,
            permissions: mockAdmin.permissions,
          };

          observer.next(response);
          observer.complete();
        } else {
          observer.error({
            status: 401,
            message: 'Credenciais inválidas',
          });
        }
      }, 1000); // Simula 1 segundo de delay
    });
  }

  // Definir autenticação administrativa
  private setAdminAuth(auth: AdminAuthentication): void {
    this.storageService.setLocalItem(this.ADMIN_TOKEN_KEY, auth.accessToken);
    this.storageService.setLocalItem(
      this.ADMIN_REFRESH_TOKEN_KEY,
      auth.refreshToken
    );
    this.storageService.setLocalItem(
      this.ADMIN_USER_KEY,
      JSON.stringify(auth.adminUser)
    );

    this.currentAdminUserSubject.next(auth.adminUser);
    this.isAuthenticatedSubject.next(true);
  }

  // Logout administrativo
  logout(): Observable<void> {
    return new Observable(observer => {
      // Limpar dados do storage
      this.storageService.removeLocalItem(this.ADMIN_TOKEN_KEY);
      this.storageService.removeLocalItem(this.ADMIN_REFRESH_TOKEN_KEY);
      this.storageService.removeLocalItem(this.ADMIN_USER_KEY);

      // Limpar subjects
      this.currentAdminUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);

      observer.next();
      observer.complete();
    });
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Obter usuário administrativo atual
  getCurrentAdminUser(): AdminUser | null {
    return this.currentAdminUserSubject.value;
  }

  // Obter token de acesso
  getAccessToken(): string | null {
    return this.storageService.getLocalItem(this.ADMIN_TOKEN_KEY);
  }

  // Verificar permissão
  hasPermission(permission: AdminPermission): boolean {
    const currentUser = this.getCurrentAdminUser();
    return currentUser?.permissions.includes(permission) || false;
  }

  // Verificar múltiplas permissões
  hasPermissions(permissions: AdminPermission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Verificar se é super admin
  isSuperAdmin(): boolean {
    const currentUser = this.getCurrentAdminUser();
    return currentUser?.role === 'super_admin' || false;
  }

  // Refresh token (para implementação futura)
  refreshToken(): Observable<AdminAuthentication> {
    const refreshToken = this.storageService.getLocalItem(
      this.ADMIN_REFRESH_TOKEN_KEY
    );

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não encontrado'));
    }

    // Mock para desenvolvimento
    return this.mockRefreshToken(refreshToken);
  }

  private mockRefreshToken(
    refreshToken: string
  ): Observable<AdminAuthentication> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.getCurrentAdminUser();
        if (currentUser) {
          const response: AdminAuthentication = {
            accessToken: 'admin_new_access_token_' + Date.now(),
            refreshToken: 'admin_new_refresh_token_' + Date.now(),
            adminUser: currentUser,
            expiresIn: 3600,
            permissions: currentUser.permissions,
          };

          this.setAdminAuth(response);
          observer.next(response);
          observer.complete();
        } else {
          observer.error({ message: 'Token inválido' });
        }
      }, 500);
    });
  }

  // Verificar se o token está expirado (implementação básica)
  isTokenExpired(): boolean {
    // Implementar lógica de verificação de expiração
    // Por enquanto, sempre retorna false para o mock
    return false;
  }

  // Validar acesso administrativo
  validateAdminAccess(): Observable<boolean> {
    const token = this.getAccessToken();
    const user = this.getCurrentAdminUser();

    if (!token || !user) {
      return of(false);
    }

    // Mock validation - implementar com backend real
    return of(true);
  }
}
