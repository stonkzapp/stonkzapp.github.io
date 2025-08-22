import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface WalletAsset {
  ticker: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  allocationPct: number;
}

export interface WalletSummary {
  totalValue: number;
  dayPnlPct: number;
  ytdReturnPct: number;
}

@Injectable({ providedIn: 'root' })
export class WalletService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getSummary(): Observable<WalletSummary> {
    return this.http.get<WalletSummary>(`${this.baseUrl}/wallet/summary`);
  }

  getAssets(): Observable<WalletAsset[]> {
    return this.http.get<WalletAsset[]>(`${this.baseUrl}/wallet/assets`);
  }
}
