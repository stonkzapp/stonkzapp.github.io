import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../../core/services/screen.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  isPremium?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    NgClass,
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit {
  isMobile: boolean = false;
  isKeyboardOpen: boolean = false;
  isPremiumMenuOpen: boolean = false;

  // Menu principal (itens básicos)
  mainMenuItems: MenuItem[] = [
    { icon: 'home', label: 'Início', route: '/dashboard' },
    {
      icon: 'account_balance_wallet',
      label: 'Carteira',
      route: '/dashboard/wallet',
    },
    { icon: 'show_chart', label: 'Mercado', route: '/dashboard/market' },
    { icon: 'person', label: 'Perfil', route: '/dashboard/profile' },
  ];

  // Menu premium (itens avançados)
  premiumMenuItems: MenuItem[] = [
    {
      label: 'Análises Avançadas',
      icon: 'analytics',
      route: '/dashboard/analytics',
      isPremium: true,
    },
    {
      label: 'Otimização de Portfólio',
      icon: 'trending_up',
      route: '/dashboard/portfolio-optimization',
      isPremium: true,
    },
    {
      label: 'Relatórios Fiscais',
      icon: 'receipt_long',
      route: '/dashboard/tax-reports',
      isPremium: true,
    },
    {
      label: 'Alertas Personalizados',
      icon: 'notifications_active',
      route: '/dashboard/alerts',
      isPremium: true,
    },
    {
      label: 'Integração com Corretoras',
      icon: 'account_balance',
      route: '/dashboard/broker-integration',
      isPremium: true,
    },
    {
      label: 'App Mobile',
      icon: 'smartphone',
      route: '/dashboard/mobile-app',
      isPremium: true,
    },
    {
      label: 'API de Dados',
      icon: 'api',
      route: '/dashboard/api',
      isPremium: true,
    },
    {
      label: 'Backtesting',
      icon: 'timeline',
      route: '/dashboard/backtesting',
      isPremium: true,
    },
    {
      label: 'Suporte Prioritário',
      icon: 'support_agent',
      route: '/dashboard/priority-support',
      isPremium: true,
    },
  ];

  constructor(
    private screenService: ScreenService,
    private themeService: ThemeService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.screenService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    if (window.visualViewport) {
      const updateKeyboard = () => {
        const vv = window.visualViewport!;
        this.isKeyboardOpen = vv.height < window.innerHeight - 100;
      };
      window.visualViewport.addEventListener('resize', updateKeyboard);
      updateKeyboard();
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkModeEnabled();
  }

  showPremiumMenu(): void {
    this.isPremiumMenuOpen = true;
  }

  closePremiumMenu(): void {
    this.isPremiumMenuOpen = false;
  }

  // Método para lidar com cliques em itens premium
  handleMenuClick(item: MenuItem): void {
    if (item.isPremium) {
      // Usuário tentando acessar funcionalidade PRO
      this.notificationService.showInfo(
        'Esta funcionalidade está disponível apenas para usuários PRO. Faça upgrade do seu plano para acessar!',
        { title: '🔒 Funcionalidade PRO' }
      );

      // Redirecionar para tela de planos
      this.router.navigate(['/dashboard/profile/subscription']);

      // Fechar menu premium
      this.closePremiumMenu();
    } else {
      // Funcionalidade gratuita - navegar normalmente
      this.router.navigate([item.route]);
    }
  }

  upgradeToPremium(): void {
    // Redirecionar para tela de planos
    this.router.navigate(['/dashboard/profile/subscription']);
    this.closePremiumMenu();
  }
}
