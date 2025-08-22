import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MOCK_CONFIG } from '../config/mock.config';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
    expiresAt: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MockAuthService {
  private isMockMode = MOCK_CONFIG.ENABLE_MOCK_MODE;
  private mockUserSubject = new BehaviorSubject<MockUser | null>(
    this.loadMockUser()
  );
  public mockUser$ = this.mockUserSubject.asObservable();

  // Usuário único permitido no modo mock
  private readonly MOCK_CREDENTIALS = {
    email: 'appstonkz@gmail.com',
    password: 'Stonkz@1',
    name: 'App Stonkz',
    role: 'premium_user',
  };

  constructor() {
    // Se não há usuário mock, cria o usuário padrão
    if (!this.mockUserSubject.value) {
      this.createDefaultMockUser();
    }
  }

  private loadMockUser(): MockUser | null {
    const stored = localStorage.getItem('mockUser');
    return stored ? JSON.parse(stored) : null;
  }

  private saveMockUser(user: MockUser): void {
    localStorage.setItem('mockUser', JSON.stringify(user));
  }

  private createDefaultMockUser(): void {
    const defaultUser: MockUser = {
      id: 'stonkz-user-001',
      email: this.MOCK_CREDENTIALS.email,
      name: this.MOCK_CREDENTIALS.name,
      role: this.MOCK_CREDENTIALS.role,
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    };
    this.mockUserSubject.next(defaultUser);
    this.saveMockUser(defaultUser);
  }

  // Simula login - apenas aceita as credenciais específicas
  login(
    email: string,
    password: string
  ): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Verifica se as credenciais são as corretas
        if (
          email === this.MOCK_CREDENTIALS.email &&
          password === this.MOCK_CREDENTIALS.password
        ) {
          const mockUser: MockUser = {
            id: 'stonkz-user-' + Date.now(),
            email: this.MOCK_CREDENTIALS.email,
            name: this.MOCK_CREDENTIALS.name,
            role: this.MOCK_CREDENTIALS.role,
            subscription: {
              plan: 'premium',
              status: 'active',
              expiresAt: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          };

          this.mockUserSubject.next(mockUser);
          this.saveMockUser(mockUser);

          observer.next({
            success: true,
            message: 'Login realizado com sucesso! (Modo Mock)',
          });
        } else {
          observer.next({
            success: false,
            message:
              'Credenciais inválidas. Use: appstonkz@gmail.com / Stonkz@1',
          });
        }
        observer.complete();
      }, MOCK_CONFIG.NETWORK_DELAY.login);
    });
  }

  // Simula logout
  logout(): void {
    this.mockUserSubject.next(null);
    localStorage.removeItem('mockUser');
  }

  // Verifica se está autenticado
  isAuthenticated(): boolean {
    return !!this.mockUserSubject.value;
  }

  // Obtém usuário atual
  getCurrentUser(): MockUser | null {
    return this.mockUserSubject.value;
  }

  // Verifica se está em modo mock
  isInMockMode(): boolean {
    return this.isMockMode;
  }

  // Ativa/desativa modo mock
  setMockMode(enabled: boolean): void {
    this.isMockMode = enabled;
  }

  // Obtém informações da assinatura do usuário
  getUserSubscription(): MockUser['subscription'] | null {
    return this.mockUserSubject.value?.subscription || null;
  }

  // Verifica se o usuário tem assinatura ativa
  hasActiveSubscription(): boolean {
    const subscription = this.getUserSubscription();
    if (!subscription) return false;

    const expiresAt = new Date(subscription.expiresAt);
    return expiresAt > new Date() && subscription.status === 'active';
  }

  // Obtém as credenciais mock para referência
  getMockCredentials(): { email: string; password: string } {
    return {
      email: this.MOCK_CREDENTIALS.email,
      password: this.MOCK_CREDENTIALS.password,
    };
  }
}
