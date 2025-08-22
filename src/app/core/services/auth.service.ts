import { Injectable, signal } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  Authentication,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  SocialLoginRequest,
  BiometricLoginRequest,
  SSOLoginRequest,
  BiometricCapabilities,
  AuthProvider,
  AuthSession,
} from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private tokenSignal = signal<string | null>(null);
  private currentProviderSubject = new BehaviorSubject<AuthProvider>('email');
  private biometricCapabilitiesSubject =
    new BehaviorSubject<BiometricCapabilities | null>(null);

  currentProvider$ = this.currentProviderSubject.asObservable();
  biometricCapabilities$ = this.biometricCapabilitiesSubject.asObservable();

  isAuthenticated = () => !!this.tokenSignal();

  // Login tradicional com email/senha
  login(credentials: LoginRequest): Observable<Authentication> {
    return this.http.post<Authentication>(
      `${this.baseUrl}/auth/login`,
      credentials
    );
  }

  // Login social (Google, Apple, etc)
  socialLogin(request: SocialLoginRequest): Observable<Authentication> {
    return this.http.post<Authentication>(
      `${this.baseUrl}/auth/social/login`,
      request
    );
  }

  // Login biométrico
  biometricLogin(request: BiometricLoginRequest): Observable<Authentication> {
    return this.http.post<Authentication>(
      `${this.baseUrl}/auth/biometric/login`,
      request
    );
  }

  // Login SSO (Android/iOS)
  ssoLogin(request: SSOLoginRequest): Observable<Authentication> {
    return this.http.post<Authentication>(
      `${this.baseUrl}/auth/sso/login`,
      request
    );
  }

  // Integração com Keycloak
  keycloakLogin(realm: string, clientId: string): Observable<string> {
    return this.http.get<string>(
      `${this.baseUrl}/auth/keycloak/login-url/${realm}/${clientId}`
    );
  }

  keycloakCallback(code: string, state: string): Observable<Authentication> {
    return this.http.post<Authentication>(
      `${this.baseUrl}/auth/keycloak/callback`,
      { code, state }
    );
  }

  // Capacidades biométricas
  getBiometricCapabilities(): Observable<BiometricCapabilities> {
    return this.http.get<BiometricCapabilities>(
      `${this.baseUrl}/auth/biometric/capabilities`
    );
  }

  enrollBiometric(
    biometricType: string
  ): Observable<{ success: boolean; publicKey?: string }> {
    return this.http.post<{ success: boolean; publicKey?: string }>(
      `${this.baseUrl}/auth/biometric/enroll`,
      { biometricType }
    );
  }

  // Gerenciamento de sessões
  getActiveSessions(): Observable<AuthSession[]> {
    return this.http.get<AuthSession[]>(`${this.baseUrl}/auth/sessions`);
  }

  revokeSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/auth/sessions/${sessionId}`);
  }

  revokeAllSessions(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/auth/sessions/all`);
  }

  // Token refresh
  refreshToken(data: RefreshTokenRequest): Observable<Authentication> {
    return this.http.post<Authentication>(
      `${this.baseUrl}/auth/refresh-token`,
      data
    );
  }

  // Logout
  logout(data: LogoutRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, data);
  }

  // URLs dos provedores sociais
  getGoogleLoginUrl(): string {
    return `${this.baseUrl}/auth/google/login`;
  }

  getAppleLoginUrl(): string {
    return `${this.baseUrl}/auth/apple/login`;
  }

  getFacebookLoginUrl(): string {
    return `${this.baseUrl}/auth/facebook/login`;
  }

  getMicrosoftLoginUrl(): string {
    return `${this.baseUrl}/auth/microsoft/login`;
  }

  getGithubLoginUrl(): string {
    return `${this.baseUrl}/auth/github/login`;
  }

  // Métodos auxiliares
  setCurrentProvider(provider: AuthProvider): void {
    this.currentProviderSubject.next(provider);
  }

  getCurrentProvider(): AuthProvider {
    return this.currentProviderSubject.value;
  }

  setBiometricCapabilities(capabilities: BiometricCapabilities): void {
    this.biometricCapabilitiesSubject.next(capabilities);
  }
}

// import { Injectable, signal } from '@angular/core';
// import { BaseService } from './base.service';
// import { Observable } from 'rxjs';
// import {
//   Authentication,
//   LoginRequest,
//   LogoutRequest,
//   RefreshTokenRequest,
// } from '../models/models';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService extends BaseService {
//   private tokenSignal = signal<string | null>(null);

//   isAuthenticated = () => !!this.tokenSignal();

//   login(credentials: LoginRequest): Observable<Authentication> {
//     return this.http.post<Authentication>(`${this.baseUrl}/login`, credentials);
//   }

//   refreshToken(data: RefreshTokenRequest): Observable<Authentication> {
//     return this.http.post<Authentication>(
//       `${this.baseUrl}/refresh-token`,
//       data
//     );
//   }

//   logout(data: LogoutRequest): Observable<void> {
//     return this.http.post<void>(`${this.baseUrl}/logout`, data);
//   }
// }
