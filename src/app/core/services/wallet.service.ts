import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Wallet,
  WalletConnection,
  WalletSummary,
  CreateWalletRequest,
  UpdateWalletRequest,
} from '../models/models';
import { AuthService } from './auth.service';
import { SubscriptionService } from './subscription.service';
import {
  MOCK_WALLETS,
  MOCK_WALLET_CONNECTIONS,
  MOCK_WALLET_SUMMARIES,
  getMockWalletById,
  getMockWalletSummaryById,
  getMockWalletConnectionsByWalletId,
} from '../config/mock-data';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private currentWalletSubject = new BehaviorSubject<Wallet | null>(null);
  private walletsSubject = new BehaviorSubject<Wallet[]>([]);
  private walletConnectionsSubject = new BehaviorSubject<WalletConnection[]>(
    []
  );

  public currentWallet$ = this.currentWalletSubject.asObservable();
  public wallets$ = this.walletsSubject.asObservable();
  public walletConnections$ = this.walletConnectionsSubject.asObservable();

  private readonly baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private subscriptionService: SubscriptionService
  ) {
    this.loadWallets();
  }

  // Carregar carteiras do usuário
  private loadWallets(): void {
    if (this.authService.isAuthenticated()) {
      this.getUserWallets().subscribe({
        next: wallets => {
          this.walletsSubject.next(wallets);
          if (wallets.length > 0) {
            const defaultWallet = wallets.find(w => w.isDefault) || wallets[0];
            this.setCurrentWallet(defaultWallet);
          }
        },
        error: error => {
          console.error('Erro ao carregar carteiras:', error);
        },
      });
    }
  }

  // Obter carteiras do usuário
  getUserWallets(): Observable<Wallet[]> {
    // Mock: retornar carteiras do usuário
    return of(MOCK_WALLETS);
  }

  // Obter carteira específica
  getWallet(walletId: string): Observable<Wallet> {
    const wallet = getMockWalletById(walletId);
    if (wallet) {
      return of(wallet);
    }
    return throwError(() => new Error('Carteira não encontrada'));
  }

  // Obter resumo da carteira
  getWalletSummary(walletId: string): Observable<WalletSummary> {
    const summary = getMockWalletSummaryById(walletId);
    if (summary) {
      return of(summary);
    }
    return throwError(() => new Error('Resumo da carteira não encontrado'));
  }

  // Criar nova carteira (apenas PRO)
  createWallet(request: CreateWalletRequest): Observable<Wallet> {
    if (!this.subscriptionService.isProUser()) {
      return throwError(
        () => new Error('Apenas usuários PRO podem criar múltiplas carteiras')
      );
    }

    // Mock: simular criação de carteira
    const newWallet: Wallet = {
      id: `wallet-${Date.now()}`,
      name: request.name,
      description: request.description,
      color: request.color,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalValue: 0,
      totalInvested: 0,
      totalReturn: 0,
      returnPercentage: 0,
    };

    // Adicionar à lista de carteiras
    const currentWallets = this.walletsSubject.value;
    this.walletsSubject.next([...currentWallets, newWallet]);

    return of(newWallet);
  }

  // Atualizar carteira
  updateWallet(
    walletId: string,
    request: UpdateWalletRequest
  ): Observable<Wallet> {
    const currentWallets = this.walletsSubject.value;
    const walletIndex = currentWallets.findIndex(w => w.id === walletId);

    if (walletIndex === -1) {
      return throwError(() => new Error('Carteira não encontrada'));
    }

    // Mock: simular atualização
    const updatedWallet = {
      ...currentWallets[walletIndex],
      ...request,
      updatedAt: new Date(),
    };
    currentWallets[walletIndex] = updatedWallet;
    this.walletsSubject.next([...currentWallets]);

    // Se for a carteira atual, atualizar também
    if (this.currentWalletSubject.value?.id === walletId) {
      this.currentWalletSubject.next(updatedWallet);
    }

    return of(updatedWallet);
  }

  // Deletar carteira (apenas PRO, não pode deletar a padrão)
  deleteWallet(walletId: string): Observable<void> {
    if (!this.subscriptionService.isProUser()) {
      return throwError(
        () => new Error('Apenas usuários PRO podem deletar carteiras')
      );
    }

    const currentWallets = this.walletsSubject.value;
    const wallet = currentWallets.find(w => w.id === walletId);

    if (!wallet) {
      return throwError(() => new Error('Carteira não encontrada'));
    }

    if (wallet.isDefault) {
      return throwError(
        () => new Error('Não é possível deletar a carteira padrão')
      );
    }

    // Mock: simular remoção
    const filteredWallets = currentWallets.filter(w => w.id !== walletId);
    this.walletsSubject.next(filteredWallets);

    // Se for a carteira atual, limpar
    if (this.currentWalletSubject.value?.id === walletId) {
      this.currentWalletSubject.next(null);
    }

    return of(void 0);
  }

  // Definir carteira padrão
  setDefaultWallet(walletId: string): Observable<Wallet> {
    const currentWallets = this.walletsSubject.value;
    const walletIndex = currentWallets.findIndex(w => w.id === walletId);

    if (walletIndex === -1) {
      return throwError(() => new Error('Carteira não encontrada'));
    }

    // Mock: simular definição de carteira padrão
    const updatedWallets = currentWallets.map(w => ({
      ...w,
      isDefault: w.id === walletId,
    }));

    this.walletsSubject.next(updatedWallets);
    const updatedWallet = updatedWallets[walletIndex];

    // Se for a carteira atual, atualizar também
    if (this.currentWalletSubject.value?.id === walletId) {
      this.currentWalletSubject.next(updatedWallet);
    }

    return of(updatedWallet);
  }

  // Trocar carteira ativa
  setCurrentWallet(wallet: Wallet): void {
    this.currentWalletSubject.next(wallet);
    this.loadWalletConnections(wallet.id);

    // Salvar no localStorage para persistir entre sessões
    localStorage.setItem('currentWalletId', wallet.id);
  }

  // Obter carteira ativa
  getCurrentWallet(): Wallet | null {
    return this.currentWalletSubject.value;
  }

  // Obter ID da carteira ativa
  getCurrentWalletId(): string | null {
    const wallet = this.getCurrentWallet();
    return wallet ? wallet.id : null;
  }

  // Carregar conexões da carteira
  private loadWalletConnections(walletId: string): void {
    this.getWalletConnections(walletId).subscribe({
      next: connections => {
        this.walletConnectionsSubject.next(connections);
      },
      error: error => {
        console.error('Erro ao carregar conexões da carteira:', error);
        this.walletConnectionsSubject.next([]);
      },
    });
  }

  // Obter conexões da carteira
  getWalletConnections(walletId: string): Observable<WalletConnection[]> {
    // Mock: retornar conexões da carteira
    const connections = getMockWalletConnectionsByWalletId(walletId);
    return of(connections);
  }

  // Verificar se usuário pode ter múltiplas carteiras
  canHaveMultipleWallets(): boolean {
    return this.subscriptionService.isProUser();
  }

  // Verificar se usuário pode criar nova carteira
  canCreateWallet(): boolean {
    if (!this.canHaveMultipleWallets()) {
      return false;
    }

    const currentWallets = this.walletsSubject.value;
    // Limite de carteiras para usuários PRO (pode ser configurável)
    const maxWallets = 10;
    return currentWallets.length < maxWallets;
  }

  // Obter número de carteiras
  getWalletCount(): number {
    return this.walletsSubject.value.length;
  }

  // Verificar se é a primeira carteira
  isFirstWallet(): boolean {
    return this.getWalletCount() === 1;
  }

  // Verificar se é a carteira padrão
  isDefaultWallet(wallet: Wallet): boolean {
    return wallet.isDefault;
  }

  // Obter cores disponíveis para carteiras
  getAvailableColors(): string[] {
    return [
      '#6366f1', // Primary
      '#8b5cf6', // Secondary
      '#06b6d4', // Accent
      '#10b981', // Success
      '#f59e0b', // Warning
      '#ef4444', // Error
      '#8b5a96', // Purple
      '#f97316', // Orange
      '#84cc16', // Lime
      '#06b6d4', // Cyan
    ];
  }

  // Recarregar dados da carteira atual
  refreshCurrentWallet(): void {
    const currentWallet = this.getCurrentWallet();
    if (currentWallet) {
      this.getWalletSummary(currentWallet.id).subscribe({
        next: summary => {
          // Atualizar dados da carteira atual
          const updatedWallet = { ...currentWallet, ...summary };
          this.currentWalletSubject.next(updatedWallet);
        },
        error: error => {
          console.error('Erro ao atualizar carteira:', error);
        },
      });
    }
  }

  // Limpar dados ao fazer logout
  clearWallets(): void {
    this.currentWalletSubject.next(null);
    this.walletsSubject.next([]);
    this.walletConnectionsSubject.next([]);
    localStorage.removeItem('currentWalletId');
  }
}
