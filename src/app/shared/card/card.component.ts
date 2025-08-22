import { Component, Input } from '@angular/core';

@Component({
  selector: 'stz-card',
  standalone: true,
  template: `
    <div class="stz-card">
      @if (title) {
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <div class="card-actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </div>
      }
      <div class="card-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .stz-card {
        background-color: var(--color-card-background);
        border: 1px solid var(--color-card-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-card);
        transition: all var(--transition-normal);
        overflow: hidden;
      }

      .stz-card:hover {
        box-shadow: var(--shadow-card-hover);
        transform: translateY(-2px);
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-4);
        border-bottom: 1px solid var(--color-border-tertiary);
        background-color: var(--color-surface-secondary);
      }

      .card-title {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
      }

      .card-actions {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .card-content {
        padding: var(--space-4);
      }

      /* Variações */
      .stz-card--elevated {
        box-shadow: var(--shadow-lg);
      }

      .stz-card--elevated:hover {
        box-shadow: var(--shadow-xl);
      }

      .stz-card--bordered {
        border-width: 2px;
      }

      .stz-card--compact .card-header,
      .stz-card--compact .card-content {
        padding: var(--space-3);
      }

      .stz-card--spacious .card-header,
      .stz-card--spacious .card-content {
        padding: var(--space-6);
      }
    `,
  ],
})
export class CardComponent {
  @Input() title?: string;
}
