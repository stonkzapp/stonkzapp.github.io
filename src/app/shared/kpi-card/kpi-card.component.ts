import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'stz-kpi-card',
  standalone: true,
  imports: [NgClass, NgIf, MatIconModule],
  template: `
    <div class="kpi-card">
      <div class="kpi-header">
        <h4 class="kpi-label">{{ label }}</h4>
        <mat-icon *ngIf="icon" class="kpi-icon">{{ icon }}</mat-icon>
      </div>
      <p class="kpi-value">{{ value }}</p>
      <p
        class="kpi-change"
        [ngClass]="{
          'kpi-change--positive': change >= 0 && !accent,
          'kpi-change--negative': change < 0 && !accent,
          'kpi-change--primary': accent === 'primary',
          'kpi-change--success': accent === 'success',
          'kpi-change--warning': accent === 'warning',
          'kpi-change--danger': accent === 'danger'
        }">
        {{ change }}%
      </p>
    </div>
  `,
  styles: [
    `
      .kpi-card {
        background-color: var(--color-card-background);
        border: 1px solid var(--color-card-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-card);
        padding: var(--space-4);
        transition: all var(--transition-normal);
        overflow: hidden;
      }

      .kpi-card:hover {
        box-shadow: var(--shadow-card-hover);
        transform: translateY(-2px);
      }

      .kpi-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-1);
      }

      .kpi-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-tertiary);
        font-weight: var(--font-weight-medium);
        margin: 0;
      }

      .kpi-icon {
        color: var(--color-text-tertiary);
        font-size: var(--font-size-lg);
        width: var(--font-size-lg);
        height: var(--font-size-lg);
      }

      .kpi-value {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);
        margin: var(--space-2) 0;
        line-height: var(--line-height-tight);
      }

      .kpi-change {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        margin: 0;
      }

      /* Variações de cor para mudanças */
      .kpi-change--positive {
        color: var(--color-success);
      }

      .kpi-change--negative {
        color: var(--color-error);
      }

      .kpi-change--primary {
        color: var(--color-primary);
      }

      .kpi-change--success {
        color: var(--color-success);
      }

      .kpi-change--warning {
        color: var(--color-warning);
      }

      .kpi-change--danger {
        color: var(--color-error);
      }

      /* Variações de estilo */
      .kpi-card--elevated {
        box-shadow: var(--shadow-lg);
      }

      .kpi-card--elevated:hover {
        box-shadow: var(--shadow-xl);
      }

      .kpi-card--bordered {
        border-width: 2px;
      }

      .kpi-card--compact {
        padding: var(--space-3);
      }

      .kpi-card--spacious {
        padding: var(--space-6);
      }
    `,
  ],
})
export class KpiCardComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() change: number = 0;
  @Input() icon?: string;
  @Input() accent?: 'primary' | 'success' | 'warning' | 'danger';
}
