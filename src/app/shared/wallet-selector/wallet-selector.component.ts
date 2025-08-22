import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Wallet } from '../../core/models/models';
import { WalletService } from '../../core/services/wallet.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { CreateWalletComponent } from '../../dashboard/wallet/create-wallet/create-wallet.component';

@Component({
  selector: 'app-wallet-selector',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './wallet-selector.component.html',
  styleUrls: ['./wallet-selector.component.scss'],
})
export class WalletSelectorComponent implements OnInit, OnDestroy {
  wallets: Wallet[] = [];
  canCreateWallet = false;
  canHaveMultipleWallets = false;

  private destroy$ = new Subject<void>();

  constructor(
    private walletService: WalletService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscribeToWalletChanges();
    this.checkPermissions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToWalletChanges(): void {
    // Observar lista de carteiras
    this.walletService.wallets$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wallets => {
        this.wallets = wallets;
        this.checkPermissions();
      });
  }

  private checkPermissions(): void {
    this.canHaveMultipleWallets = this.walletService.canHaveMultipleWallets();
    this.canCreateWallet = this.walletService.canCreateWallet();
  }

  // Trocar para outra carteira
  switchWallet(wallet: Wallet): void {
    this.walletService.setCurrentWallet(wallet);

    // Redirecionar para a página inicial do dashboard
    // Isso fará com que todos os componentes recarreguem com os dados da nova carteira
    this.router.navigate(['/dashboard/home']);
  }

  // Criar nova carteira
  createWallet(): void {
    if (!this.canCreateWallet) {
      this.router.navigate(['/dashboard/subscription']);
      return;
    }

    const dialogRef = CreateWalletComponent.openModal(this.dialog);

    dialogRef.afterClosed().subscribe((result: Wallet) => {
      if (result) {
        // Carteira criada com sucesso
        console.log('Nova carteira criada:', result);
      }
    });
  }

  // Gerenciar carteiras
  manageWallets(): void {
    this.router.navigate(['/dashboard/wallet/manage']);
  }

  // Verificar se a carteira está ativa
  isActiveWallet(wallet: Wallet): boolean {
    const currentWallet = this.walletService.getCurrentWallet();
    return currentWallet?.id === wallet.id;
  }

  // Obter cor da carteira
  getWalletColor(wallet: Wallet): string {
    return wallet.color || '#6366f1';
  }

  // Verificar se deve mostrar upgrade para PRO
  shouldShowUpgrade(): boolean {
    return !this.canHaveMultipleWallets && this.wallets.length === 1;
  }

  // Upgrade para PRO
  upgradeToPro(): void {
    this.router.navigate(['/dashboard/subscription']);
  }
}
