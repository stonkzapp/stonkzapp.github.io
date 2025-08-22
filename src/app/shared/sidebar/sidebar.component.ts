import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../core/services/theme.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ScreenService } from '../../core/services/screen.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  isPremium?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isMobile: boolean = false;
  selectedIndex: number | null = null;
  isPremiumUser: boolean = false; // Simular usuário não premium

  // Menu Principal
  mainMenuItems: MenuItem[] = [
    { icon: 'home', label: 'Dashboard', route: '/dashboard/home' },
    {
      icon: 'account_balance_wallet',
      label: 'Carteira',
      route: '/dashboard/wallet',
    },
    { icon: 'show_chart', label: 'Mercado', route: '/dashboard/market' },
    {
      icon: 'link',
      label: 'Conexões',
      route: '/dashboard/connections',
      isPremium: true,
    },
  ];

  // Menu de Análises
  analysisMenuItems: MenuItem[] = [
    {
      icon: 'analytics',
      label: 'Análises Avançadas',
      route: '/dashboard/analytics',
      isPremium: true,
    },
    {
      icon: 'trending_up',
      label: 'Otimização de Portfólio',
      route: '/dashboard/portfolio-optimization',
      isPremium: true,
    },
    {
      icon: 'compare_arrows',
      label: 'Relatórios Fiscais',
      route: '/dashboard/tax-reports',
      isPremium: true,
    },
    {
      icon: 'insights',
      label: 'Alertas Personalizados',
      route: '/dashboard/alerts',
      isPremium: true,
    },
    {
      icon: 'account_balance',
      label: 'Integração com Corretoras',
      route: '/dashboard/broker-integration',
      isPremium: true,
    },
    {
      icon: 'smartphone',
      label: 'App Mobile',
      route: '/dashboard/mobile-app',
      isPremium: true,
    },
    {
      icon: 'api',
      label: 'API de Dados',
      route: '/dashboard/api',
      isPremium: true,
    },
    {
      icon: 'timeline',
      label: 'Backtesting',
      route: '/dashboard/backtesting',
      isPremium: true,
    },
    {
      icon: 'support_agent',
      label: 'Suporte Prioritário',
      route: '/dashboard/priority-support',
      isPremium: true,
    },
  ];

  // Menu de Relatórios
  reportsMenuItems: MenuItem[] = [
    {
      icon: 'assessment',
      label: 'Relatório Mensal',
      route: '/dashboard/monthly-report',
      isPremium: true,
    },
    {
      icon: 'pie_chart',
      label: 'Análise de Risco',
      route: '/dashboard/risk-analysis',
      isPremium: true,
    },
    {
      icon: 'timeline',
      label: 'Histórico Detalhado',
      route: '/dashboard/detailed-history',
      isPremium: true,
    },
    {
      icon: 'download',
      label: 'Exportar Dados',
      route: '/dashboard/export',
      isPremium: true,
      isNew: true,
    },
  ];

  // // Menu de Configurações
  // settingsMenuItems: MenuItem[] = [
  //   {
  //     icon: 'notifications',
  //     label: 'Alertas',
  //     route: '/dashboard/alerts',
  //     isPremium: true,
  //   },
  //   { icon: 'sync', label: 'Sincronização', route: '/dashboard/sync' },
  //   { icon: 'person', label: 'Perfil', route: '/dashboard/profile' },
  // ];

  get logoPath() {
    return this.themeService.getLogoPath();
  }

  constructor(
    private themeService: ThemeService,
    private screenService: ScreenService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.screenService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  selectMenu(index: number, route: string): void {
    this.selectedIndex = index;
    this.router.navigate([route]);
  }

  // Método para lidar com cliques em itens premium
  handleMenuClick(item: MenuItem, index: number): void {
    if (item.isPremium && !this.isPremiumUser) {
      // Usuário não premium tentando acessar funcionalidade PRO
      this.notificationService.showInfo(
        'Esta funcionalidade está disponível apenas para usuários PRO. Faça upgrade do seu plano para acessar!',
        { title: '🔒 Funcionalidade PRO' }
      );

      // Redirecionar para tela de planos
      this.router.navigate(['/dashboard/profile/subscription']);
    } else {
      // Usuário premium ou funcionalidade gratuita - navegar normalmente
      this.selectedIndex = index;
      this.router.navigate([item.route]);
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkModeEnabled();
  }

  upgradeToPremium(): void {
    // Redirecionar para tela de planos
    this.router.navigate(['/dashboard/profile/subscription']);
  }
}
