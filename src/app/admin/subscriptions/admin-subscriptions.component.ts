import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-subscriptions">
      <h1>Gerenciar Assinaturas</h1>
      <p>Funcionalidade em desenvolvimento</p>
    </div>
  `,
  styles: [
    `
      .admin-subscriptions {
        padding: var(--space-6);

        h1 {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: var(--space-4);
        }

        p {
          color: var(--color-text-secondary);
        }
      }
    `,
  ],
})
export class AdminSubscriptionsComponent {}
