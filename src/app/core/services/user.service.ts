import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, of } from 'rxjs';
import { UserProfile, ChangePasswordRequest } from '../models/models';
import { MOCK_USER_PROFILE } from '../config/mock-data';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  // Obter perfil do usuário
  getUserProfile(): Observable<UserProfile> {
    // Mock: retornar perfil do usuário
    return of(MOCK_USER_PROFILE);
  }

  // Atualizar perfil do usuário
  updateUserProfile(data: UserProfile): Observable<void> {
    // Mock: simular atualização
    console.log('Perfil atualizado:', data);
    return of(void 0);
  }

  // Alterar senha
  changePassword(data: ChangePasswordRequest): Observable<void> {
    // Mock: simular alteração de senha
    console.log('Senha alterada para usuário:', data);
    return of(void 0);
  }

  // Obter usuário por ID
  getUserById(userId: string): Observable<UserProfile> {
    // Mock: retornar usuário por ID
    if (userId === 'user-123') {
      return of(MOCK_USER_PROFILE);
    }
    return of(MOCK_USER_PROFILE); // Fallback para qualquer ID
  }

  // Obter lista de usuários (para admin)
  getUsers(): Observable<UserProfile[]> {
    // Mock: retornar lista de usuários
    return of([MOCK_USER_PROFILE]);
  }

  // Verificar se email existe
  checkEmailExists(email: string): Observable<boolean> {
    // Mock: simular verificação de email
    const exists = email === MOCK_USER_PROFILE.email;
    return of(exists);
  }

  // Verificar se CPF existe
  checkCpfExists(cpf: string): Observable<boolean> {
    // Mock: simular verificação de CPF
    const exists = cpf === MOCK_USER_PROFILE.cpf;
    return of(exists);
  }

  // Obter nome completo do usuário
  getUserFullName(userId: string): Observable<string> {
    // Mock: retornar nome completo
    if (userId === 'user-123') {
      return of(`${MOCK_USER_PROFILE.firstName} ${MOCK_USER_PROFILE.lastName}`);
    }
    return of(`${MOCK_USER_PROFILE.firstName} ${MOCK_USER_PROFILE.lastName}`);
  }

  // Obter endereço do usuário
  getUserAddress(userId: string): Observable<any> {
    // Mock: retornar endereço do usuário
    if (userId === 'user-123') {
      return of(MOCK_USER_PROFILE.address);
    }
    return of(MOCK_USER_PROFILE.address);
  }

  // Atualizar endereço do usuário
  updateUserAddress(userId: string, address: any): Observable<void> {
    // Mock: simular atualização de endereço
    console.log('Endereço atualizado para usuário:', userId, address);
    return of(void 0);
  }

  // Verificar se usuário é ativo
  isUserActive(userId: string): Observable<boolean> {
    // Mock: simular verificação de usuário ativo
    return of(true);
  }

  // Obter estatísticas do usuário
  getUserStats(userId: string): Observable<any> {
    // Mock: retornar estatísticas do usuário
    return of({
      totalInvestments: 250000,
      totalReturns: 30000,
      portfolioCount: 3,
      lastLogin: new Date('2024-01-15T10:30:00'),
      accountAge: 15, // dias
    });
  }

  // Obter histórico de atividades
  getUserActivityHistory(userId: string): Observable<any[]> {
    // Mock: retornar histórico de atividades
    return of([
      {
        id: 'act-1',
        type: 'login',
        description: 'Login realizado com sucesso',
        timestamp: new Date('2024-01-15T10:30:00'),
        ip: '192.168.1.1',
      },
      {
        id: 'act-2',
        type: 'wallet_switch',
        description: 'Carteira alterada para "Carteira Principal"',
        timestamp: new Date('2024-01-15T09:15:00'),
        ip: '192.168.1.1',
      },
      {
        id: 'act-3',
        type: 'profile_update',
        description: 'Perfil atualizado',
        timestamp: new Date('2024-01-14T16:45:00'),
        ip: '192.168.1.1',
      },
    ]);
  }
}

// import { Injectable } from '@angular/core';
// import { BaseService } from './base.service';
// import { Observable } from 'rxjs';
// import { UserProfile, ChangePasswordRequest } from '../models/models';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService extends BaseService {
//   getUserProfile(): Observable<UserProfile> {
//     return this.http.get<UserProfile>(`${this.baseUrl}/user-profile`);
//   }

//   updateUserProfile(data: UserProfile): Observable<void> {
//     return this.http.put<void>(`${this.baseUrl}/user-profile`, data);
//   }

//   changePassword(data: ChangePasswordRequest): Observable<void> {
//     return this.http.put<void>(`${this.baseUrl}/change-password`, data);
//   }
// }
