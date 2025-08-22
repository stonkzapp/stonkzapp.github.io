import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

interface ConnectionProvider {
  id: string;
  name: string;
  logo: string;
  type: 'broker' | 'bank' | 'exchange' | 'b3';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  description: string;
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
}

@Component({
  selector: 'app-connections',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss'],
})
export class ConnectionsComponent implements OnInit {
  isLoading = signal(false);
  connectedCount = signal(0);
  selectedFilter = signal<string>('all');
  filteredProviders = signal<ConnectionProvider[]>([]);
  filterCounts = signal<{ [key: string]: number }>({});

  // Provedores de conexão disponíveis
  connectionProviders: ConnectionProvider[] = [
    {
      id: 'b3',
      name: 'B3 - Bolsa de Valores',
      logo: '🏛️',
      type: 'b3',
      status: 'disconnected',
      description:
        'Conexão oficial com a B3 para dados em tempo real e histórico completo',
      features: [
        'Dados oficiais da B3',
        'Tempo real',
        'Histórico completo',
        'Relatórios oficiais',
      ],
      isPopular: true,
    },
    {
      id: 'clear',
      name: 'Clear Corretora',
      logo: '🔷',
      type: 'broker',
      status: 'disconnected',
      description:
        'Integração oficial com Clear para sincronização automática de posições',
      features: [
        'Sincronização automática',
        'Posições em tempo real',
        'Ordens e execuções',
        'Custódia',
      ],
      isPopular: true,
    },
    {
      id: 'xp',
      name: 'XP Investimentos',
      logo: '⚡',
      type: 'broker',
      status: 'disconnected',
      description:
        'Conecte sua conta XP para importar dados e análises completas',
      features: [
        'Importação automática',
        'Carteira completa',
        'Rentabilidade',
        'Dividendos',
      ],
    },
    {
      id: 'inter',
      name: 'Inter Invest',
      logo: '🧡',
      type: 'broker',
      status: 'disconnected',
      description:
        'Integração com Inter para análise completa e relatórios fiscais',
      features: [
        'Análise de carteira',
        'Dividendos',
        'IR e relatórios',
        'Custódia',
      ],
    },
    {
      id: 'rico',
      name: 'Rico Investimentos',
      logo: '💎',
      type: 'broker',
      status: 'disconnected',
      description:
        'Sincronize sua conta Rico automaticamente com análises avançadas',
      features: [
        'Sincronização automática',
        'Relatórios detalhados',
        'Analytics avançado',
        'Custódia',
      ],
      comingSoon: true,
    },
    {
      id: 'nuinvest',
      name: 'Nu Invest',
      logo: '💜',
      type: 'broker',
      status: 'disconnected',
      description:
        'Conecte sua conta Nubank Investimentos para análise completa',
      features: [
        'Carteira Nu completa',
        'Dividendos automáticos',
        'Análises avançadas',
        'Relatórios',
      ],
      comingSoon: true,
    },
    {
      id: 'btg',
      name: 'BTG Pactual',
      logo: '🏦',
      type: 'broker',
      status: 'disconnected',
      description:
        'Integração oficial com BTG Pactual Digital para portfolio completo',
      features: [
        'Portfolio completo',
        'Research oficial',
        'Relatórios detalhados',
        'Custódia',
      ],
      comingSoon: true,
    },
    {
      id: 'toro',
      name: 'Toro Investimentos',
      logo: '🐂',
      type: 'broker',
      status: 'disconnected',
      description:
        'Conecte sua conta Toro para análises e relatórios completos',
      features: [
        'Posições em tempo real',
        'Operações detalhadas',
        'Custódia',
        'Relatórios',
      ],
      comingSoon: true,
    },
  ];

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.updateConnectedCount();
    this.calculateFilterCounts();
    this.applyFilter('all');
  }

  updateConnectedCount(): void {
    const connected = this.connectionProviders.filter(
      provider => provider.status === 'connected'
    ).length;
    this.connectedCount.set(connected);
  }

  calculateFilterCounts(): void {
    const counts = {
      all: this.connectionProviders.length,
      broker: this.connectionProviders.filter(p => p.type === 'broker').length,
      bank: this.connectionProviders.filter(p => p.type === 'bank').length,
      b3: this.connectionProviders.filter(p => p.type === 'b3').length,
      exchange: this.connectionProviders.filter(p => p.type === 'exchange')
        .length,
    };
    this.filterCounts.set(counts);
  }

  connectProvider(provider: ConnectionProvider): void {
    if (provider.comingSoon) {
      this.snackBar.open(
        `${provider.name} estará disponível em breve!`,
        'Fechar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );
      return;
    }

    this.isLoading.set(true);
    provider.status = 'connecting';

    // Simular processo de conexão
    setTimeout(() => {
      provider.status = Math.random() > 0.2 ? 'connected' : 'error';
      this.isLoading.set(false);
      this.updateConnectedCount();

      if (provider.status === 'connected') {
        this.snackBar.open(
          `✅ Conectado com ${provider.name} com sucesso!`,
          'Fechar',
          {
            duration: 4000,
            panelClass: ['success-snackbar'],
          }
        );
      } else {
        this.snackBar.open(
          `❌ Erro ao conectar com ${provider.name}. Tente novamente.`,
          'Fechar',
          {
            duration: 4000,
            panelClass: ['error-snackbar'],
          }
        );
      }
    }, 2000);
  }

  disconnectProvider(provider: ConnectionProvider): void {
    provider.status = 'disconnected';
    this.updateConnectedCount();
    this.snackBar.open(`Desconectado de ${provider.name}`, 'Fechar', {
      duration: 3000,
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'connected':
        return 'check_circle';
      case 'connecting':
        return 'sync';
      case 'error':
        return 'error';
      default:
        return 'radio_button_unchecked';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'primary';
      case 'error':
        return 'warn';
      default:
        return '';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'broker':
        return 'Corretora';
      case 'bank':
        return 'Banco';
      case 'exchange':
        return 'Exchange';
      case 'b3':
        return 'Bolsa';
      default:
        return 'Outro';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'broker':
        return 'primary';
      case 'bank':
        return 'accent';
      case 'exchange':
        return 'warn';
      case 'b3':
        return 'warn';
      default:
        return '';
    }
  }

  onImageError(event: any, provider: ConnectionProvider): void {
    // Fallback para emoji se a imagem falhar
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    target.nextElementSibling?.classList.remove('hidden');
  }

  getProviderEmoji(providerId: string): string {
    const emojiMap: { [key: string]: string } = {
      b3: '🏛️',
      clear: '🔷',
      xp: '⚡',
      inter: '🧡',
      rico: '💎',
      nuinvest: '💜',
      btg: '🏦',
      toro: '🐂',
    };
    return emojiMap[providerId] || '🏢';
  }

  trackByProviderId(index: number, provider: ConnectionProvider): string {
    return provider.id;
  }

  isFilterEnabled(filterType: string): boolean {
    const counts = this.filterCounts();
    return counts[filterType] > 0;
  }

  getFilterCount(filterType: string): number {
    const counts = this.filterCounts();
    return counts[filterType] || 0;
  }

  applyFilter(filterType: string): void {
    this.selectedFilter.set(filterType);

    let filtered: ConnectionProvider[];

    switch (filterType) {
      case 'broker':
        filtered = this.connectionProviders.filter(p => p.type === 'broker');
        break;
      case 'bank':
        filtered = this.connectionProviders.filter(p => p.type === 'bank');
        break;
      case 'b3':
        filtered = this.connectionProviders.filter(p => p.type === 'b3');
        break;
      case 'exchange':
        filtered = this.connectionProviders.filter(p => p.type === 'exchange');
        break;
      default:
        filtered = this.connectionProviders;
        break;
    }

    this.filteredProviders.set(filtered);
  }
}
