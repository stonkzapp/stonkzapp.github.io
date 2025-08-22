import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { CardComponent } from '../card/card.component';

export interface TimelineEvent {
  date: string; // ISO date string
  type:
    | 'aporte'
    | 'provento'
    | 'compra'
    | 'venda'
    | 'rebalanceamento'
    | 'outro';
  description: string;
  amount?: number;
}

@Component({
  selector: 'stz-timeline',
  standalone: true,
  imports: [NgClass, CardComponent],
  templateUrl: './timeline.component.html',
})
export class TimelineComponent {
  @Input() events: TimelineEvent[] = [];

  formatDate(iso: string): string {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(d);
  }

  formatCurrency(value?: number): string {
    if (value == null) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
