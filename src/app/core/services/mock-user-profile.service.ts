import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_CONFIG } from '../config/mock.config';

export interface MockUserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription: {
    plan: string;
    status: string;
    expiresAt: string;
    features: string[];
  };
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    country?: string;
    city?: string;
    avatar?: string;
    bio?: string;
    preferences: {
      notifications: boolean;
      newsletter: boolean;
      darkMode: boolean;
    };
  };
  wallet: {
    balance: number;
    currency: string;
    transactions: Array<{
      id: string;
      type: 'credit' | 'debit';
      amount: number;
      description: string;
      date: string;
    }>;
  };
  connections: {
    total: number;
    active: number;
    pending: number;
  };
  statistics: {
    totalInvestments: number;
    totalReturns: number;
    portfolioValue: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

@Injectable({
  providedIn: 'root',
})
export class MockUserProfileService {
  private userProfileSubject = new BehaviorSubject<MockUserProfile | null>(
    null
  );
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    // Inicializa com o usuário padrão
    this.initializeDefaultUser();
  }

  private initializeDefaultUser(): void {
    const defaultProfile: MockUserProfile = {
      id: 'stonkz-user-001',
      email: 'appstonkz@gmail.com',
      name: 'App Stonkz',
      role: 'premium_user',
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        features: [
          'unlimited_investments',
          'advanced_analytics',
          'priority_support',
          'exclusive_content',
          'mobile_app_access',
        ],
      },
      profile: {
        firstName: 'App',
        lastName: 'Stonkz',
        phone: '+55 11 99999-9999',
        country: 'Brasil',
        city: 'São Paulo',
        avatar: '',
        bio: 'Investidor apaixonado por tecnologia e inovação. Sempre em busca das melhores oportunidades de investimento.',
        preferences: {
          notifications: true,
          newsletter: true,
          darkMode: false,
        },
      },
      wallet: {
        balance: 15420.75,
        currency: 'BRL',
        transactions: [
          {
            id: 'tx-001',
            type: 'credit',
            amount: 5000.0,
            description: 'Depósito inicial',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'tx-002',
            type: 'credit',
            amount: 10000.0,
            description: 'Transferência bancária',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'tx-003',
            type: 'debit',
            amount: 2500.0,
            description: 'Investimento em ações',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'tx-004',
            type: 'credit',
            amount: 920.75,
            description: 'Retorno de investimento',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      },
      connections: {
        total: 15,
        active: 12,
        pending: 3,
      },
      statistics: {
        totalInvestments: 25000.0,
        totalReturns: 420.75,
        portfolioValue: 25420.75,
        riskLevel: 'medium',
      },
    };

    this.userProfileSubject.next(defaultProfile);
  }

  // Simula a API userProfile
  getUserProfile(): Observable<MockUserProfile> {
    return of(this.userProfileSubject.value!).pipe(
      delay(MOCK_CONFIG.NETWORK_DELAY.dataLoad)
    );
  }

  // Atualiza o perfil do usuário
  updateUserProfile(
    updates: Partial<MockUserProfile>
  ): Observable<MockUserProfile> {
    const currentProfile = this.userProfileSubject.value;
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates };
      this.userProfileSubject.next(updatedProfile);

      return of(updatedProfile).pipe(delay(MOCK_CONFIG.NETWORK_DELAY.dataLoad));
    }

    return of(null as any);
  }

  // Obtém estatísticas da carteira
  getWalletStatistics(): Observable<MockUserProfile['wallet']> {
    return of(this.userProfileSubject.value?.wallet!).pipe(
      delay(MOCK_CONFIG.NETWORK_DELAY.dataLoad)
    );
  }

  // Obtém estatísticas de investimentos
  getInvestmentStatistics(): Observable<MockUserProfile['statistics']> {
    return of(this.userProfileSubject.value?.statistics!).pipe(
      delay(MOCK_CONFIG.NETWORK_DELAY.dataLoad)
    );
  }

  // Obtém informações de conexões
  getConnectionsInfo(): Observable<MockUserProfile['connections']> {
    return of(this.userProfileSubject.value?.connections!).pipe(
      delay(MOCK_CONFIG.NETWORK_DELAY.dataLoad)
    );
  }

  // Obtém perfil atual
  getCurrentProfile(): MockUserProfile | null {
    return this.userProfileSubject.value;
  }

  // Limpa o perfil (para logout)
  clearProfile(): void {
    this.userProfileSubject.next(null);
  }

  // Verifica se o usuário tem perfil
  hasProfile(): boolean {
    return !!this.userProfileSubject.value;
  }
}
