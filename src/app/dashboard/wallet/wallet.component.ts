import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../core/services/wallet.service';
import { WalletSummary } from '../../core/models/models';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'stz-wallet',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="sticky-header">
      <h2 class="text-xl font-semibold">Carteira</h2>
    </div>

    <stz-card title="Resumo da Carteira" class="mt-4">
      @if (summary$ | async; as s) { @if (s) {
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p class="text-xs text-gray-500">Valor Total</p>
          <p class="text-lg font-semibold">
            {{ s.totalValue | currency : 'BRL' : 'symbol' : '1.0-0' : 'pt-BR' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Retorno</p>
          <p class="text-lg font-semibold">{{ s.returnPercentage }}%</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Investido</p>
          <p class="text-lg font-semibold">
            {{
              s.totalInvested | currency : 'BRL' : 'symbol' : '1.0-0' : 'pt-BR'
            }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Ativos</p>
          <p class="text-lg font-semibold">{{ s.assetCount }}</p>
        </div>
      </div>
      } @else {
      <p class="text-sm text-gray-500">
        Não foi possível carregar o resumo da carteira.
      </p>
      } } @else {
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (i of [1, 2, 3, 4]; track i) {
        <div class="bg-gray-100 dark:bg-gray-700 rounded h-10"></div>
        }
      </div>
      }
    </stz-card>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <stz-card>
        <h3 class="text-base font-medium mb-2">Conexões da Carteira</h3>
        <div class="space-y-2 text-sm">
          <p class="text-gray-500">
            Use o seletor de carteiras no header para gerenciar suas carteiras.
          </p>
        </div>
      </stz-card>
    </div>
  `,
})
export class WalletComponent {
  private wallet = inject(WalletService);

  summary$: Observable<WalletSummary | null> = this.wallet.currentWallet$.pipe(
    switchMap(wallet => {
      if (!wallet) return of(null);
      return this.wallet
        .getWalletSummary(wallet.id)
        .pipe(catchError(() => of(null)));
    })
  );
}
