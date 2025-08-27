import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('landingContainer') landingContainer!: ElementRef;

  private observer!: IntersectionObserver;
  private scrollListener!: () => void;

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit() {
    this.setupScrollAnimations();
    this.setupHeaderScrollEffect();
  }

  ngAfterViewInit() {
    this.initializeScrollAnimations();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  // Sistema de animações de scroll
  private setupScrollAnimations() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');

            // Adiciona delay sequencial para elementos filhos
            const children =
              entry.target.querySelectorAll('.animate-on-scroll');
            children.forEach((child: Element, index: number) => {
              setTimeout(() => {
                child.classList.add('animated');
              }, index * 100);
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
  }

  private initializeScrollAnimations() {
    // Adiciona classes de animação apenas aos elementos que realmente precisam
    const animatedElements =
      this.landingContainer.nativeElement.querySelectorAll(
        '.animate-on-scroll'
      );

    animatedElements.forEach((element: Element) => {
      this.observer.observe(element);
    });

    // Observa seções completas para animações especiais (gráficos e estatísticas)
    const sections =
      this.landingContainer.nativeElement.querySelectorAll('section');
    sections.forEach((section: Element) => {
      this.observer.observe(section);
    });

    // Remove delays sequenciais automáticos - agora são aplicados manualmente
    // apenas aos elementos que realmente precisam
  }

  // Efeito de scroll no header
  private setupHeaderScrollEffect() {
    this.scrollListener = () => {
      const header = document.querySelector('.landing-header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', this.scrollListener);
  }

  // Animações especiais para gráficos
  animateChartBars() {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.classList.add('animated');
      }, index * 100);
    });
  }

  // Animações para números estatísticos
  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
      setTimeout(() => {
        stat.classList.add('animated');
        this.animateCounter(stat as HTMLElement);
      }, index * 200);
    });
  }

  // Ativa animações especiais quando elementos entram na viewport
  private activateSpecialAnimations(entry: IntersectionObserverEntry) {
    const target = entry.target;

    // Anima gráficos quando a seção demo entrar na viewport
    if (
      target.classList.contains('demo-section') ||
      target.querySelector('.chart-container')
    ) {
      setTimeout(() => this.animateChartBars(), 300);
    }

    // Anima estatísticas quando a seção about entrar na viewport
    if (
      target.classList.contains('about-section') ||
      target.querySelector('.stat-item')
    ) {
      setTimeout(() => this.animateStats(), 300);
    }
  }

  private animateCounter(element: HTMLElement) {
    const finalValue = element.textContent;
    if (finalValue && finalValue.includes('+')) {
      const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
      let currentValue = 0;
      const increment = numericValue / 30;

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
          currentValue = numericValue;
          clearInterval(timer);
        }

        if (finalValue.includes('R$')) {
          element.textContent = `R$ ${Math.floor(currentValue)}M+`;
        } else if (finalValue.includes('%')) {
          element.textContent = `${currentValue.toFixed(1)}%`;
        } else {
          element.textContent = `${Math.floor(currentValue)}k+`;
        }
      }, 50);
    }
  }

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

  // Dados do gráfico de portfólio
  portfolioData = [
    { month: 'Jan', value: 15000, height: 60 },
    { month: 'Fev', value: 16500, height: 66 },
    { month: 'Mar', value: 14200, height: 57 },
    { month: 'Abr', value: 17800, height: 71 },
    { month: 'Mai', value: 19200, height: 77 },
    { month: 'Jun', value: 19800, height: 79 },
  ];

  // Dados das projeções
  projections = [
    {
      icon: 'trending_up',
      highlight: 'Crescimento',
      title: 'Acompanhamento de Performance',
      description:
        'Monitore o crescimento da sua carteira com gráficos interativos e relatórios detalhados.',
      gradient: 'gradient-primary',
    },
    {
      icon: 'analytics',
      highlight: 'Análise',
      title: 'Insights Inteligentes',
      description:
        'Receba sugestões baseadas em dados para otimizar seus investimentos.',
      gradient: 'gradient-secondary',
    },
    {
      icon: 'security',
      highlight: 'Segurança',
      title: 'Dados Confiáveis',
      description:
        'Acesso a informações oficiais da B3 e CVM, sempre atualizadas e precisas.',
      gradient: 'gradient-success',
    },
  ];

  // Funcionalidades avançadas
  advancedFeatures = [
    {
      icon: 'dashboard',
      highlight: 'Dashboard',
      title: 'Visão Completa',
      description:
        'Interface intuitiva que mostra todos os seus investimentos em um só lugar.',
      gradient: 'gradient-primary',
    },
    {
      icon: 'notifications_active',
      highlight: 'Alertas',
      title: 'Notificações Inteligentes',
      description:
        'Configure alertas personalizados para movimentações importantes.',
      gradient: 'gradient-secondary',
    },
    {
      icon: 'compare_arrows',
      highlight: 'Comparação',
      title: 'Benchmarking',
      description:
        'Compare seu desempenho com índices do mercado e outras carteiras.',
      gradient: 'gradient-success',
    },
  ];

  // Empresas parceiras
  partners = [
    { logo: 'partners/b3.png', alt: 'B3' },
    { logo: 'partners/cvm.png', alt: 'CVM' },
    { logo: 'partners/banco-central.png', alt: 'Banco Central' },
    { logo: 'partners/tesouro-nacional.png', alt: 'Tesouro Nacional' },
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
