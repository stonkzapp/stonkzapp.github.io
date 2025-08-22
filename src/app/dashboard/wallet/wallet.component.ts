import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WalletService,
  WalletAsset,
  WalletSummary,
} from '../../core/services/wallet.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
          <p class="text-xs text-gray-500">P/L do Dia</p>
          <p class="text-lg font-semibold">{{ s.dayPnlPct }}%</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">YTD</p>
          <p class="text-lg font-semibold">{{ s.ytdReturnPct }}%</p>
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
      @if (assets$ | async; as assets) { @if (assets.length) { @for (a of
      assets; track a.ticker) {
      <stz-card>
        <h3 class="text-base font-medium mb-2">
          {{ a.ticker }} · {{ a.name }}
        </h3>
        <div class="space-y-2 text-sm">
          <p class="text-gray-500">
            Qtde: {{ a.quantity }} · PM:
            {{ a.avgPrice | currency : 'BRL' : 'symbol' : '1.2-2' : 'pt-BR' }}
          </p>
          <p>
            Preço:
            {{
              a.currentPrice | currency : 'BRL' : 'symbol' : '1.2-2' : 'pt-BR'
            }}
          </p>
          <p>Alocação: {{ a.allocationPct }}%</p>
        </div>
      </stz-card>
      } } @else {
      <stz-card>
        <p class="text-sm text-gray-500">Nenhum ativo na carteira.</p>
      </stz-card>
      } } @else { @for (i of [1, 2, 3, 4, 5, 6]; track i) {
      <stz-card>
        <div class="bg-gray-100 dark:bg-gray-700 rounded h-20"></div>
      </stz-card>
      } }
    </div>
  `,
})
export class WalletComponent {
  private wallet = inject(WalletService);
  summary$: Observable<WalletSummary | null> = this.wallet
    .getSummary()
    .pipe(catchError(() => of(null)));
  assets$: Observable<WalletAsset[]> = this.wallet
    .getAssets()
    .pipe(catchError(() => of([])));
}
