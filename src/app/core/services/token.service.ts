import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly EXPIRES_IN_KEY = 'expiresIn';

  private tokenSubject = new BehaviorSubject<string | null>(this.loadToken());
  public token$ = this.tokenSubject.asObservable();

  private jwtHelper = new JwtHelperService();

  constructor(private storageService: StorageService) {}

  // Carrega o token de acesso
  private loadToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // Salva o token de acesso, refresh token e tempo de expiração
  setToken(token: string, refreshToken: string, expiresIn: number): void {
    this.tokenSubject.next(token);

    // Salva no sessionStorage
    this.storageService.setSessionItem(this.TOKEN_KEY, token); // Token de acesso
    this.storageService.setSessionItem(this.REFRESH_TOKEN_KEY, refreshToken); // Refresh token
    this.storageService.setSessionItem(
      this.EXPIRES_IN_KEY,
      expiresIn.toString()
    ); // ExpiresIn
  }

  // Obtém o token de acesso
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  // Obtém o refresh token
  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Obtém o tempo de expiração
  getExpiresIn(): number {
    const expiresIn = sessionStorage.getItem(this.EXPIRES_IN_KEY);
    return expiresIn ? parseInt(expiresIn, 10) : 0;
  }

  // Remove o token de acesso, refresh token e tempo de expiração
  removeToken(): void {
    this.tokenSubject.next(null);
    this.removeRefreshToken();
    this.removeExpiresIn();
  }

  // Remove o refresh token
  removeRefreshToken(): void {
    this.storageService.removeSessionItem(this.REFRESH_TOKEN_KEY);
  }

  // Remove o tempo de expiração
  removeExpiresIn(): void {
    this.storageService.removeSessionItem(this.EXPIRES_IN_KEY);
  }

  // Obtém as informações do usuário a partir do token de acesso
  getUserInfo(): any {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  // Verifica se o token é válido (não expirado)
  isAuthenticated(): boolean {
    const user = this.getUserInfo();
    return !!user && this.isTokenValid(user);
  }

  // Decodifica o token JWT para obter as informações
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Verifica se o token é válido, comparando com a data de expiração
  private isTokenValid(user: any): boolean {
    if (!user || !user.exp) return false;
    return user.exp * 1000 > Date.now();
  }

  // Método que verifica se o token já expirou
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true; // Se não tem token, consideramos expirado
    return this.jwtHelper.isTokenExpired(token);
  }

  // Função para verificar se o token está prestes a expirar
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.jwtHelper.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) return false;

    const expirationTime = decodedToken.exp * 1000; // Convertendo para milissegundos
    const now = Date.now();
    const timeRemaining = expirationTime - now;

    console.log(
      `Tempo restante do token: ${Math.round(timeRemaining / 1000)} segundos`
    );

    return timeRemaining < 5 * 60 * 1000; // Retorna true se faltar menos de 5 minutos
  }
}
