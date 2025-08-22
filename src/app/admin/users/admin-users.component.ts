import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-users">
      <h1>Gerenciar Usuários</h1>
      <p>Funcionalidade em desenvolvimento</p>
    </div>
  `,
  styles: [
    `
      .admin-users {
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
export class AdminUsersComponent {}
