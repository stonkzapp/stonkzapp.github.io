import { Injectable, signal } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import {
  Authentication,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private tokenSignal = signal<string | null>(null);

  isAuthenticated = () => !!this.tokenSignal();

  login(credentials: LoginRequest): Observable<Authentication> {
    return this.http.post<Authentication>(`${this.baseUrl}/login`, credentials);
  }

  refreshToken(data: RefreshTokenRequest): Observable<Authentication> {
    return this.http.post<Authentication>(
      `${this.baseUrl}/refresh-token`,
      data
    );
  }

  logout(data: LogoutRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, data);
  }
}
