import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  constructor(private router: Router, private themeService: ThemeService) {}

  // Features da plataforma
  features = [
    {
      icon: 'analytics',
      title: 'Análises Avançadas',
      description:
        'Relatórios detalhados sobre seus investimentos com métricas profissionais',
      comingSoon: false,
    },
    {
      icon: 'account_balance_wallet',
      title: 'Gestão de Carteira',
      description:
        'Controle total da sua carteira com visualizações intuitivas',
      comingSoon: false,
    },
    {
      icon: 'trending_up',
      title: 'Acompanhamento Diário',
      description:
        'Monitore seus ativos com dados atualizados da B3 e CVM no fim do dia',
      comingSoon: false,
    },
    {
      icon: 'notifications',
      title: 'Alertas Personalizados',
      description:
        'Configure alertas para movimentações importantes nos seus ativos',
      comingSoon: false,
    },
    {
      icon: 'pie_chart',
      title: 'Diversificação Inteligente',
      description: 'Análise de risco e sugestões para otimizar sua carteira',
      comingSoon: false,
    },
    {
      icon: 'mobile_friendly',
      title: 'App Mobile',
      description:
        'Acesse seus investimentos de qualquer lugar, a qualquer hora',
      comingSoon: true,
    },
  ];

  // Planos disponíveis
  plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: 'para sempre',
      features: [
        'Gestão básica de carteira',
        'Dados de mercado atualizados diariamente',
        'Relatórios mensais básicos',
        'Suporte por email',
        'Até 10 ativos na carteira',
      ],
      buttonText: 'Começar Grátis',
      buttonColor: 'secondary',
      popular: false,
    },
    {
      name: 'PRO',
      price: 'R$ 29,90',
      period: 'por mês',
      features: [
        'Tudo do plano gratuito',
        'Análises avançadas e relatórios',
        'Alertas personalizados',
        'Integração com corretoras',
        'Carteira ilimitada',
        'Suporte prioritário',
        'API de dados',
        'Backtesting de estratégias',
        'App Mobile (Em breve)',
      ],
      buttonText: 'Assinar PRO',
      buttonColor: 'primary',
      popular: true,
    },
  ];

  // Métodos de navegação
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goToSubscription(): void {
    this.router.navigate(['/auth/login']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Métodos de tema
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkModeEnabled();
  }
}
