import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MarketIndex {
  code: string; // ex: IBOV, IFIX, DOLAR
  name: string; // nome amigável
  value: number; // valor atual (ou variação em %)
  display: string; // string formatada (ex: "+0,85%" ou "R$ 5,12")
}

export interface MarketNewsItem {
  id: string;
  title: string;
  publishedAt: string; // ISO
}

@Injectable({ providedIn: 'root' })
export class MarketService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getIndices(): Observable<MarketIndex[]> {
    return this.http.get<MarketIndex[]>(`${this.baseUrl}/market/indices`);
  }

  getNews(): Observable<MarketNewsItem[]> {
    return this.http.get<MarketNewsItem[]>(`${this.baseUrl}/market/news`);
  }
}
