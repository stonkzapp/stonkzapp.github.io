import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';

export interface Notification {
  id: string;
  emoji: string;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  action?: {
    label: string;
    route: string;
    icon: string;
  };
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  isMenuOpen = signal(false);

  unreadCount = computed(
    () => this.notifications().filter(n => !n.isRead).length
  );

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockNotifications();
  }

  loadMockNotifications(): void {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        emoji: '🎉',
        title: 'Bem-vindo ao Stonkz!',
        description:
          'Sua conta foi criada com sucesso. Comece a explorar todas as funcionalidades disponíveis.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
        isRead: false,
        type: 'success',
        action: {
          label: 'Explorar',
          route: '/dashboard/home',
          icon: 'explore',
        },
      },
      {
        id: '2',
        emoji: '📊',
        title: 'Análise de Carteira Atualizada',
        description:
          'Sua análise de carteira foi atualizada com os dados mais recentes do mercado.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
        isRead: false,
        type: 'info',
        action: {
          label: 'Ver Análise',
          route: '/dashboard/wallet',
          icon: 'analytics',
        },
      },
      {
        id: '3',
        emoji: '🔔',
        title: 'Lembrete de Dividendos',
        description:
          'Você tem dividendos disponíveis para receber em 3 ações da sua carteira.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 horas atrás
        isRead: true,
        type: 'warning',
        action: {
          label: 'Ver Dividendos',
          route: '/dashboard/wallet',
          icon: 'account_balance_wallet',
        },
      },
      {
        id: '4',
        emoji: '✅',
        title: 'Conexão B3 Estabelecida',
        description:
          'Sua conexão com a B3 foi estabelecida com sucesso. Dados em tempo real disponíveis.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 horas atrás
        isRead: true,
        type: 'success',
        action: {
          label: 'Ver Conexões',
          route: '/dashboard/connections',
          icon: 'link',
        },
      },
      {
        id: '5',
        emoji: '📈',
        title: 'Alerta de Mercado',
        description:
          'PETR4 atingiu seu preço alvo. Considere revisar sua estratégia de investimento.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 horas atrás
        isRead: true,
        type: 'info',
        action: {
          label: 'Ver Mercado',
          route: '/dashboard/market',
          icon: 'show_chart',
        },
      },
    ];

    this.notifications.set(mockNotifications);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(current => !current);
  }

  markAsRead(notificationId: string): void {
    this.notifications.update(notifications =>
      notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  }

  markAllAsRead(): void {
    this.notifications.update(notifications =>
      notifications.map(n => ({ ...n, isRead: true }))
    );
  }

  deleteNotification(notificationId: string): void {
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== notificationId)
    );
  }

  clearAllNotifications(): void {
    this.notifications.set([]);
  }

  navigateToNotification(notification: Notification): void {
    if (notification.action?.route) {
      this.router.navigate([notification.action.route]);
      this.markAsRead(notification.id);
      this.isMenuOpen.set(false);
    }
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;

    return timestamp.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      default:
        return 'var(--color-primary)';
    }
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}
