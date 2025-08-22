import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Wallet } from '../../../core/models/models';
import { WalletService } from '../../../core/services/wallet.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CreateWalletComponent } from '../create-wallet/create-wallet.component';

@Component({
  selector: 'app-manage-wallets',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  template: `
    <div class="manage-wallets-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1>
              <mat-icon>account_balance_wallet</mat-icon>
              Gerenciar Carteiras
            </h1>
            <p class="subtitle">
              Organize e gerencie suas carteiras de investimento
            </p>
          </div>
          <button
            mat-raised-button
            color="primary"
            (click)="createWallet()"
            [disabled]="!canCreateWallet"
            class="create-button">
            <mat-icon>add</mat-icon>
            Nova Carteira
          </button>
        </div>
      </div>

      <!-- Status Info -->
      <div class="status-info">
        <div class="info-card">
          <mat-icon class="info-icon">inventory</mat-icon>
          <div class="info-content">
            <div class="info-label">Total de Carteiras</div>
            <div class="info-value">{{ wallets.length }}</div>
          </div>
        </div>
        <div class="info-card">
          <mat-icon class="info-icon" [class.active]="canHaveMultipleWallets">
            {{ canHaveMultipleWallets ? 'star' : 'star_border' }}
          </mat-icon>
          <div class="info-content">
            <div class="info-label">Plano</div>
            <div class="info-value">
              {{ canHaveMultipleWallets ? 'PRO' : 'Gratuito' }}
            </div>
          </div>
        </div>
        <div class="info-card">
          <mat-icon class="info-icon">trending_up</mat-icon>
          <div class="info-content">
            <div class="info-label">Valor Total</div>
            <div class="info-value">
              {{
                getTotalValue()
                  | currency : 'BRL' : 'symbol' : '1.0-0' : 'pt-BR'
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Carteiras -->
      <div class="wallets-grid">
        <div
          *ngFor="let wallet of wallets; trackBy: trackByWalletId"
          class="wallet-card"
          [class.active]="isActiveWallet(wallet)"
          [class.default]="wallet.isDefault">
          <!-- Header da Carteira -->
          <div class="wallet-header">
            <div class="wallet-info">
              <div
                class="wallet-color"
                [style.background-color]="wallet.color"></div>
              <div class="wallet-details">
                <div class="wallet-name">{{ wallet.name }}</div>
                <div class="wallet-description">
                  {{ wallet.description || 'Sem descrição' }}
                </div>
              </div>
            </div>

            <div class="wallet-badges">
              <mat-chip-set>
                <mat-chip *ngIf="isActiveWallet(wallet)" class="active-chip">
                  <mat-icon matChipAvatar>check</mat-icon>
                  Ativa
                </mat-chip>
                <mat-chip *ngIf="wallet.isDefault" class="default-chip">
                  <mat-icon matChipAvatar>home</mat-icon>
                  Padrão
                </mat-chip>
              </mat-chip-set>
            </div>

            <!-- Menu de Ações -->
            <button
              mat-icon-button
              [matMenuTriggerFor]="walletMenu"
              class="menu-trigger">
              <mat-icon>more_vert</mat-icon>
            </button>

            <mat-menu #walletMenu="matMenu">
              <button mat-menu-item (click)="switchToWallet(wallet)">
                <mat-icon>swap_horiz</mat-icon>
                <span>Trocar para esta carteira</span>
              </button>
              <button
                mat-menu-item
                (click)="setAsDefault(wallet)"
                [disabled]="wallet.isDefault">
                <mat-icon>home</mat-icon>
                <span>Definir como padrão</span>
              </button>
              <button mat-menu-item (click)="editWallet(wallet)">
                <mat-icon>edit</mat-icon>
                <span>Editar</span>
              </button>
              <mat-divider></mat-divider>
              <button
                mat-menu-item
                (click)="deleteWallet(wallet)"
                [disabled]="wallet.isDefault || wallets.length === 1"
                class="delete-action">
                <mat-icon>delete</mat-icon>
                <span>Excluir</span>
              </button>
            </mat-menu>
          </div>

          <!-- Estatísticas da Carteira -->
          <div class="wallet-stats">
            <div class="stat-item">
              <div class="stat-label">Valor Total</div>
              <div class="stat-value">
                {{
                  wallet.totalValue
                    | currency : 'BRL' : 'symbol' : '1.0-0' : 'pt-BR'
                }}
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Retorno</div>
              <div
                class="stat-value"
                [class]="getReturnClass(wallet.returnPercentage)">
                {{ wallet.returnPercentage }}%
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Investido</div>
              <div class="stat-value">
                {{
                  wallet.totalInvested
                    | currency : 'BRL' : 'symbol' : '1.0-0' : 'pt-BR'
                }}
              </div>
            </div>
          </div>

          <!-- Ações da Carteira -->
          <div class="wallet-actions">
            <button
              mat-button
              (click)="switchToWallet(wallet)"
              [disabled]="isActiveWallet(wallet)"
              class="switch-button">
              <mat-icon>swap_horiz</mat-icon>
              {{ isActiveWallet(wallet) ? 'Carteira Ativa' : 'Trocar' }}
            </button>
            <button
              mat-stroked-button
              (click)="editWallet(wallet)"
              class="edit-button">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
          </div>
        </div>

        <!-- Card para criar nova carteira -->
        <div
          *ngIf="canCreateWallet"
          class="wallet-card create-card"
          (click)="createWallet()">
          <div class="create-content">
            <mat-icon class="create-icon">add</mat-icon>
            <div class="create-text">
              <div class="create-title">Nova Carteira</div>
              <div class="create-description">
                Crie uma nova carteira para organizar seus investimentos
              </div>
            </div>
          </div>
        </div>

        <!-- Card de upgrade para PRO -->
        <div
          *ngIf="!canHaveMultipleWallets"
          class="wallet-card upgrade-card"
          (click)="upgradeToPro()">
          <div class="upgrade-content">
            <mat-icon class="upgrade-icon">star</mat-icon>
            <div class="upgrade-text">
              <div class="upgrade-title">Upgrade para PRO</div>
              <div class="upgrade-description">
                Desbloqueie múltiplas carteiras e funcionalidades avançadas
              </div>
            </div>
            <button mat-raised-button color="primary" class="upgrade-button">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./manage-wallets.component.scss'],
})
export class ManageWalletsComponent implements OnInit, OnDestroy {
  wallets: Wallet[] = [];
  canCreateWallet = false;
  canHaveMultipleWallets = false;
  currentWallet: Wallet | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private walletService: WalletService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWallets();
    this.checkPermissions();
    this.subscribeToWalletChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadWallets(): void {
    this.walletService
      .getUserWallets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: wallets => {
          this.wallets = wallets;
        },
        error: error => {
          console.error('Erro ao carregar carteiras:', error);
          this.notificationService.showError('Erro ao carregar carteiras');
        },
      });
  }

  private checkPermissions(): void {
    this.canHaveMultipleWallets = this.walletService.canHaveMultipleWallets();
    this.canCreateWallet = this.walletService.canCreateWallet();
  }

  private subscribeToWalletChanges(): void {
    this.walletService.wallets$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wallets => {
        this.wallets = wallets;
        this.checkPermissions();
      });

    this.walletService.currentWallet$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wallet => {
        this.currentWallet = wallet;
      });
  }

  trackByWalletId(index: number, wallet: Wallet): string {
    return wallet.id;
  }

  isActiveWallet(wallet: Wallet): boolean {
    return this.currentWallet?.id === wallet.id;
  }

  getTotalValue(): number {
    return this.wallets.reduce(
      (total, wallet) => total + (wallet.totalValue || 0),
      0
    );
  }

  getReturnClass(returnPercentage?: number): string {
    if (!returnPercentage) return 'neutral-return';
    if (returnPercentage > 0) return 'positive-return';
    if (returnPercentage < 0) return 'negative-return';
    return 'neutral-return';
  }

  switchToWallet(wallet: Wallet): void {
    if (!this.isActiveWallet(wallet)) {
      this.walletService.setCurrentWallet(wallet);
      this.notificationService.showSuccess(`Carteira "${wallet.name}" ativada`);
    }
  }

  setAsDefault(wallet: Wallet): void {
    if (!wallet.isDefault) {
      this.walletService
        .setDefaultWallet(wallet.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess(
              `"${wallet.name}" definida como carteira padrão`
            );
            this.loadWallets();
          },
          error: error => {
            console.error('Erro ao definir carteira padrão:', error);
            this.notificationService.showError(
              'Erro ao definir carteira padrão'
            );
          },
        });
    }
  }

  createWallet(): void {
    const dialogRef = CreateWalletComponent.openModal(this.dialog);

    dialogRef.afterClosed().subscribe((result: Wallet) => {
      if (result) {
        this.loadWallets();
      }
    });
  }

  editWallet(wallet: Wallet): void {
    // TODO: Implementar modal de edição
    this.notificationService.showInfo(
      'Funcionalidade de edição em desenvolvimento'
    );
  }

  deleteWallet(wallet: Wallet): void {
    if (wallet.isDefault) {
      this.notificationService.showWarning(
        'Não é possível excluir a carteira padrão'
      );
      return;
    }

    if (this.wallets.length === 1) {
      this.notificationService.showWarning(
        'Você deve ter pelo menos uma carteira'
      );
      return;
    }

    if (
      confirm(`Tem certeza que deseja excluir a carteira "${wallet.name}"?`)
    ) {
      this.walletService
        .deleteWallet(wallet.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess(
              `Carteira "${wallet.name}" excluída`
            );
            this.loadWallets();
          },
          error: error => {
            console.error('Erro ao excluir carteira:', error);
            this.notificationService.showError('Erro ao excluir carteira');
          },
        });
    }
  }

  upgradeToPro(): void {
    this.router.navigate(['/dashboard/subscription']);
  }
}
