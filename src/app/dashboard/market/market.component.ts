import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  MarketService,
  MarketIndex,
  MarketNewsItem,
} from '../../core/services/market.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'stz-market',
  standalone: true,
  imports: [AsyncPipe, CardComponent],
  template: `
    <div class="sticky-header">
      <h2 class="text-xl font-semibold">Mercado</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      <stz-card title="Índices" class="lg:col-span-2">
        @if (indices$ | async; as indices) { @if (indices.length) {
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          @for (idx of indices; track idx.code) {
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
            <p class="text-xs text-gray-500">{{ idx.name }}</p>
            <p class="text-lg font-semibold">{{ idx.display }}</p>
          </div>
          }
        </div>
        } @else {
        <p class="text-sm text-gray-500">Nenhum índice disponível.</p>
        } } @else {
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          @for (i of [1,2,3,4]; track i) {
          <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-6"></div>
          }
        </div>
        }
      </stz-card>

      <stz-card title="Notícias">
        @if (news$ | async; as news) { @if (news.length) {
        <ul class="space-y-2">
          @for (n of news; track n.id) {
          <li class="text-sm">{{ n.title }}</li>
          }
        </ul>
        } @else {
        <p class="text-sm text-gray-500">Nenhuma notícia no momento.</p>
        } } @else {
        <ul class="space-y-2">
          @for (i of [1,2,3]; track i) {
          <li class="bg-gray-100 dark:bg-gray-700 h-4 rounded"></li>
          }
        </ul>
        }
      </stz-card>
    </div>
  `,
})
export class MarketComponent {
  private market = inject(MarketService);
  indices$: Observable<MarketIndex[]> = this.market
    .getIndices()
    .pipe(catchError(() => of([])));
  news$: Observable<MarketNewsItem[]> = this.market
    .getNews()
    .pipe(catchError(() => of([])));
}
