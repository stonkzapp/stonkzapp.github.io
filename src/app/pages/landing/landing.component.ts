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

  // Empresas parceiras que fornecem dados públicos
  partners = [
    {
      name: 'B3',
      logo: 'partners/b3.png',
      description: 'Bolsa brasileira de valores',
      alt: 'Logo B3 - Bolsa brasileira de valores',
    },
    {
      name: 'CVM',
      logo: 'partners/cvm.png',
      description: 'Comissão de Valores Mobiliários',
      alt: 'Logo CVM - Comissão de Valores Mobiliários',
    },
    {
      name: 'Banco Central',
      logo: 'partners/banco-central.png',
      description: 'Banco Central do Brasil',
      alt: 'Logo Banco Central do Brasil',
    },
    {
      name: 'Tesouro Nacional',
      logo: 'partners/tesouro-nacional.png',
      description: 'Tesouro Nacional',
      alt: 'Logo Tesouro Nacional',
    },
  ];

  // Projeções e possibilidades para o usuário
  projections = [
    {
      icon: 'trending_up',
      title: 'Crescimento do Patrimônio',
      description: 'Acompanhe a evolução do seu patrimônio ao longo do tempo',
      highlight: 'CRESCIMENTO',
      gradient: 'gradient-success',
    },
    {
      icon: 'analytics',
      title: 'Análise de Performance',
      description: 'Compare seus resultados com benchmarks do mercado',
      highlight: 'PERFORMANCE',
      gradient: 'gradient-primary',
    },
    {
      icon: 'account_balance_wallet',
      title: 'Gestão Inteligente',
      description: 'Organize suas carteiras por estratégia e objetivo',
      highlight: 'GESTÃO',
      gradient: 'gradient-accent',
    },
    {
      icon: 'insights',
      title: 'Insights Valiosos',
      description:
        'Receba análises e sugestões para otimizar seus investimentos',
      highlight: 'INSIGHTS',
      gradient: 'gradient-secondary',
    },
  ];

  // Funcionalidades avançadas
  advancedFeatures = [
    {
      icon: 'dashboard',
      title: 'Carteiras Múltiplas',
      description:
        'Gerencie diferentes estratégias de investimento em carteiras separadas',
      highlight: 'MULTIPLAS',
      gradient: 'gradient-primary',
    },
    {
      icon: 'analytics',
      title: 'Análise de Risco',
      description: 'Métricas avançadas de risco e volatilidade para cada ativo',
      highlight: 'RISCO',
      gradient: 'gradient-warning',
    },
    {
      icon: 'trending_up',
      title: 'Performance Tracking',
      description: 'Acompanhe o desempenho histórico com gráficos interativos',
      highlight: 'PERFORMANCE',
      gradient: 'gradient-success',
    },
    {
      icon: 'notifications',
      title: 'Alertas Inteligentes',
      description:
        'Configure alertas personalizados para movimentações importantes',
      highlight: 'ALERTAS',
      gradient: 'gradient-accent',
    },
  ];

  // Dados de exemplo para gráficos
  portfolioData = [
    { month: 'Jan', value: 10000, growth: 0, height: 60 },
    { month: 'Fev', value: 10500, growth: 5, height: 70 },
    { month: 'Mar', value: 11200, growth: 12, height: 80 },
    { month: 'Abr', value: 11800, growth: 18, height: 90 },
    { month: 'Mai', value: 12500, growth: 25, height: 100 },
    { month: 'Jun', value: 13200, growth: 32, height: 110 },
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
