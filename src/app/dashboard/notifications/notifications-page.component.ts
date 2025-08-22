import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Notification } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss',
})
export class NotificationsPageComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  selectedFilter = signal<string>('all');

  filteredNotifications = computed(() => {
    const filter = this.selectedFilter();
    const allNotifications = this.notifications();

    switch (filter) {
      case 'unread':
        return allNotifications.filter(n => !n.isRead);
      case 'read':
        return allNotifications.filter(n => n.isRead);
      case 'success':
      case 'info':
      case 'warning':
      case 'error':
        return allNotifications.filter(n => n.type === filter);
      default:
        return allNotifications;
    }
  });

  unreadCount = computed(
    () => this.notifications().filter(n => !n.isRead).length
  );

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    // Simulando notificações mais extensas geradas por IA
    const mockNotifications: Notification[] = [
      {
        id: '1',
        emoji: '🎉',
        title: 'Bem-vindo ao Stonkz!',
        description:
          'Sua conta foi criada com sucesso. Nossa IA analisou seu perfil e preparou recomendações personalizadas para você.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false,
        type: 'success',
        action: {
          label: 'Explorar Dashboard',
          route: '/dashboard/home',
          icon: 'explore',
        },
      },
      {
        id: '2',
        emoji: '🤖',
        title: 'Análise de IA Concluída',
        description:
          'Nossa inteligência artificial terminou de processar sua carteira e identificou 3 oportunidades de otimização baseadas em machine learning.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
        isRead: false,
        type: 'info',
        action: {
          label: 'Ver Análise IA',
          route: '/dashboard/wallet',
          icon: 'psychology',
        },
      },
      {
        id: '3',
        emoji: '📊',
        title: 'Padrão Detectado pela IA',
        description:
          'Algoritmos de deep learning identificaram um padrão de comportamento em PETR4 similar ao observado antes de valorizações históricas.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: false,
        type: 'info',
        action: {
          label: 'Ver Análise',
          route: '/dashboard/market',
          icon: 'trending_up',
        },
      },
      {
        id: '4',
        emoji: '💡',
        title: 'Sugestão Inteligente de Rebalanceamento',
        description:
          'Nossa IA sugere um rebalanceamento de portfólio baseado em análise de risco-retorno e correlações de mercado atualizadas.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isRead: true,
        type: 'warning',
        action: {
          label: 'Ver Sugestões',
          route: '/dashboard/wallet',
          icon: 'balance',
        },
      },
      {
        id: '5',
        emoji: '🎯',
        title: 'Meta de Investimento Atingida',
        description:
          'Parabéns! Você atingiu 85% da sua meta anual. Nossa IA calculou que mantendo o ritmo atual, você superará a meta em 2 meses.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        isRead: true,
        type: 'success',
        action: {
          label: 'Ver Progresso',
          route: '/dashboard/home',
          icon: 'flag',
        },
      },
      {
        id: '6',
        emoji: '⚠️',
        title: 'Alerta de Risco Calculado por IA',
        description:
          'Modelos de machine learning detectaram aumento de volatilidade em 40% da sua carteira. Considere ajustar exposição.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        isRead: true,
        type: 'warning',
        action: {
          label: 'Avaliar Riscos',
          route: '/dashboard/wallet',
          icon: 'warning',
        },
      },
      {
        id: '7',
        emoji: '🔔',
        title: 'Dividendos Previstos pela IA',
        description:
          'Nossa IA prevê R$ 247,50 em dividendos para este mês baseado em análise preditiva e histórico de distribuições.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        isRead: true,
        type: 'info',
        action: {
          label: 'Ver Projeções',
          route: '/dashboard/wallet',
          icon: 'account_balance_wallet',
        },
      },
      {
        id: '8',
        emoji: '🚀',
        title: 'Oportunidade Identificada',
        description:
          'Algoritmos de NLP analisaram 10.000+ notícias e identificaram sentimento positivo crescente para o setor de tecnologia.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        isRead: true,
        type: 'success',
        action: {
          label: 'Explorar Setor',
          route: '/dashboard/market',
          icon: 'rocket_launch',
        },
      },
    ];

    this.notifications.set(mockNotifications);
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
    }
  }

  applyFilter(filterType: string): void {
    this.selectedFilter.set(filterType);
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    if (hours < 24) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    if (days < 7) return `${days} dia${days > 1 ? 's' : ''} atrás`;

    return timestamp.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
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

  getNotificationTypeLabel(type: string): string {
    switch (type.toLowerCase()) {
      case 'success':
        return 'Sucesso';
      case 'warning':
        return 'Aviso';
      case 'error':
        return 'Erro';
      case 'info':
        return 'Info';
      default:
        return 'Info';
    }
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}
