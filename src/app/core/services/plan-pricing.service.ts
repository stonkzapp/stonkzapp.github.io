import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface PlanPricing {
  id: string;
  name: string;
  type: 'free' | 'pro';
  basePrice: number;
  currency: string;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SKUPricing {
  id: string;
  planId: string;
  name: string;
  period: 'monthly' | 'semiannual' | 'annual';
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency: string;
  isPopular?: boolean;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingUpdateRequest {
  basePrice?: number;
  currency?: string;
  isActive?: boolean;
}

export interface SKUPricingUpdateRequest {
  price?: number;
  originalPrice?: number;
  discountPercentage?: number;
  isPopular?: boolean;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PlanPricingService {
  private plansSubject = new BehaviorSubject<PlanPricing[]>([]);
  private skusSubject = new BehaviorSubject<SKUPricing[]>([]);

  // Planos disponíveis
  private mockPlans: PlanPricing[] = [
    {
      id: 'free',
      name: 'Gratuito',
      type: 'free',
      basePrice: 0,
      currency: 'BRL',
      description: 'Plano básico com funcionalidades limitadas',
      features: [
        'Dashboard básico',
        'Carteira com até 10 ativos',
        'Relatórios mensais',
        'Suporte por email',
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'pro',
      name: 'PRO',
      type: 'pro',
      basePrice: 29.9,
      currency: 'BRL',
      description: 'Plano avançado com todas as funcionalidades',
      features: [
        'Dashboard completo',
        'Carteira ilimitada',
        'Relatórios avançados',
        'Análises avançadas',
        'Otimização de portfólio',
        'Relatórios fiscais',
        'Alertas personalizados',
        'Suporte prioritário',
        'App mobile nativo',
        'Integração com corretoras',
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  // SKUs disponíveis
  private mockSKUs: SKUPricing[] = [
    // SKUs do plano gratuito
    {
      id: 'free-monthly',
      planId: 'free',
      name: 'Gratuito Mensal',
      period: 'monthly',
      price: 0,
      originalPrice: 0,
      currency: 'BRL',
      discountPercentage: 0,
      isPopular: false,
      features: ['Funcionalidades básicas'],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },

    // SKUs do plano PRO
    {
      id: 'pro-monthly',
      planId: 'pro',
      name: 'PRO Mensal',
      period: 'monthly',
      price: 29.9,
      originalPrice: 29.9,
      currency: 'BRL',
      discountPercentage: 0,
      isPopular: false,
      features: [
        'Todas as funcionalidades PRO',
        'Cobrança mensal',
        'Cancelamento a qualquer momento',
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'pro-semiannual',
      planId: 'pro',
      name: 'PRO Semestral',
      period: 'semiannual',
      price: 119.6,
      originalPrice: 179.4,
      currency: 'BRL',
      discountPercentage: 33,
      isPopular: true,
      features: [
        'Todas as funcionalidades PRO',
        'Cobrança semestral',
        '2 meses grátis',
        'Economia de R$ 59,80',
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'pro-annual',
      planId: 'pro',
      name: 'PRO Anual',
      period: 'annual',
      price: 239.2,
      originalPrice: 358.8,
      currency: 'BRL',
      discountPercentage: 33,
      isPopular: false,
      features: [
        'Todas as funcionalidades PRO',
        'Cobrança anual',
        '4 meses grátis',
        'Economia de R$ 119,60',
        'Melhor custo-benefício',
      ],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  constructor() {
    // Inicializar com dados mockados
    this.plansSubject.next([...this.mockPlans]);
    this.skusSubject.next([...this.mockSKUs]);
  }

  // Métodos para obter dados
  getPlans(): Observable<PlanPricing[]> {
    // Simular delay de API
    return of(this.mockPlans).pipe(delay(500));
  }

  getSKUs(): Observable<SKUPricing[]> {
    // Simular delay de API
    return of(this.mockSKUs).pipe(delay(500));
  }

  getPlanById(id: string): Observable<PlanPricing | null> {
    const plan = this.mockPlans.find(p => p.id === id);
    return of(plan || null).pipe(delay(300));
  }

  getSKUById(id: string): Observable<SKUPricing | null> {
    const sku = this.mockSKUs.find(s => s.id === id);
    return of(sku || null).pipe(delay(300));
  }

  getSKUsByPlan(planId: string): Observable<SKUPricing[]> {
    const skus = this.mockSKUs.filter(s => s.planId === planId);
    return of(skus).pipe(delay(300));
  }

  // Métodos para criar/atualizar dados
  createPlan(
    plan: Omit<PlanPricing, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<PlanPricing> {
    const newPlan: PlanPricing = {
      ...plan,
      id: `plan_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockPlans.push(newPlan);
    this.plansSubject.next([...this.mockPlans]);

    return of(newPlan).pipe(delay(500));
  }

  updatePlan(
    id: string,
    updates: Partial<PlanPricing>
  ): Observable<PlanPricing | null> {
    const index = this.mockPlans.findIndex(p => p.id === id);
    if (index === -1) {
      return of(null);
    }

    this.mockPlans[index] = {
      ...this.mockPlans[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.plansSubject.next([...this.mockPlans]);
    return of(this.mockPlans[index]).pipe(delay(500));
  }

  deletePlan(id: string): Observable<boolean> {
    const index = this.mockPlans.findIndex(p => p.id === id);
    if (index === -1) {
      return of(false);
    }

    this.mockPlans.splice(index, 1);
    this.plansSubject.next([...this.mockPlans]);

    return of(true).pipe(delay(500));
  }

  // Métodos para SKUs
  createSKU(
    sku: Omit<SKUPricing, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<SKUPricing> {
    const newSKU: SKUPricing = {
      ...sku,
      id: `sku_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockSKUs.push(newSKU);
    this.skusSubject.next([...this.mockSKUs]);

    return of(newSKU).pipe(delay(500));
  }

  updateSKU(
    id: string,
    updates: Partial<SKUPricing>
  ): Observable<SKUPricing | null> {
    const index = this.mockSKUs.findIndex(s => s.id === id);
    if (index === -1) {
      return of(null);
    }

    this.mockSKUs[index] = {
      ...this.mockSKUs[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.skusSubject.next([...this.mockSKUs]);
    return of(this.mockSKUs[index]).pipe(delay(500));
  }

  deleteSKU(id: string): Observable<boolean> {
    const index = this.mockSKUs.findIndex(s => s.id === id);
    if (index === -1) {
      return of(false);
    }

    this.mockSKUs.splice(index, 1);
    this.skusSubject.next([...this.mockSKUs]);

    return of(true).pipe(delay(500));
  }

  // PUT /api/plans/:id/pricing - Atualizar preços de um plano
  updatePlanPricing(
    planId: string,
    pricingData: PricingUpdateRequest
  ): Observable<PlanPricing | null> {
    return this.updatePlan(planId, pricingData);
  }

  // PUT /api/skus/:id/pricing - Atualizar preços de um SKU
  updateSKUPricing(
    skuId: string,
    pricingData: SKUPricingUpdateRequest
  ): Observable<SKUPricing | null> {
    return this.updateSKU(skuId, pricingData);
  }

  // POST /api/plans/:id/recalculate-pricing - Recalcular preços dos SKUs
  recalculatePlanPricing(planId: string): Observable<boolean> {
    const plan = this.mockPlans.find(p => p.id === planId);
    if (!plan || plan.type === 'free') {
      return of(false);
    }

    this.recalculateSKUPrices(planId, plan.basePrice);
    return of(true).pipe(delay(300));
  }

  // Método privado para recalcular preços dos SKUs
  private recalculateSKUPrices(planId: string, basePrice: number): void {
    const discountTiers = {
      monthly: { discount: 0, multiplier: 1 },
      semiannual: { discount: 16, multiplier: 6 },
      annual: { discount: 25, multiplier: 12 },
    };

    this.mockSKUs.forEach(sku => {
      if (sku.planId === planId) {
        const tier = discountTiers[sku.period];
        const totalPrice = basePrice * tier.multiplier;
        const discountedPrice = totalPrice * (1 - tier.discount / 100);

        sku.price = Math.round(discountedPrice * 100) / 100; // Arredondar para 2 casas decimais
        sku.originalPrice = totalPrice;
        sku.discountPercentage = tier.discount;
        sku.updatedAt = new Date();
      }
    });

    this.skusSubject.next([...this.mockSKUs]);
  }

  // GET /api/pricing/features - Obter funcionalidades disponíveis
  getAvailableFeatures(): Observable<any[]> {
    const features = [
      {
        id: 'dashboard-basic',
        name: 'Dashboard Básico',
        description: 'Visão geral da sua carteira de investimentos',
        icon: 'dashboard',
        isAvailable: true,
        planType: 'free',
      },
      {
        id: 'dashboard-advanced',
        name: 'Dashboard Avançado',
        description: 'Análises detalhadas e métricas avançadas',
        icon: 'analytics',
        isAvailable: true,
        planType: 'pro',
      },
      {
        id: 'wallet-view',
        name: 'Visualização de Carteira',
        description: 'Acompanhe seus investimentos',
        icon: 'account_balance_wallet',
        isAvailable: true,
        planType: 'free',
      },
      {
        id: 'market-data-limited',
        name: 'Dados de Mercado (Limitado)',
        description: 'Informações básicas de mercado com delay',
        icon: 'trending_up',
        isAvailable: true,
        planType: 'free',
      },
      {
        id: 'market-data-real-time',
        name: 'Dados Atualizados Diariamente',
        description: 'Informações de mercado atualizadas no fim do dia',
        icon: 'schedule',
        isAvailable: true,
        planType: 'pro',
      },
      {
        id: 'alerts',
        name: 'Alertas Personalizados',
        description: 'Configure alertas para seus investimentos',
        icon: 'notifications',
        isAvailable: true,
        planType: 'pro',
      },
      {
        id: 'reports',
        name: 'Relatórios Detalhados',
        description: 'Relatórios completos de performance',
        icon: 'assessment',
        isAvailable: true,
        planType: 'pro',
      },
      {
        id: 'api-access',
        name: 'API de Dados',
        description: 'Acesso programático aos dados da plataforma',
        icon: 'code',
        isAvailable: true,
        planType: 'pro',
      },
      {
        id: 'backtesting',
        name: 'Backtesting de Estratégias',
        description: 'Teste suas estratégias com dados históricos',
        icon: 'science',
        isAvailable: true,
        planType: 'pro',
      },
      {
        id: 'support-email',
        name: 'Suporte por Email',
        description: 'Suporte básico por email',
        icon: 'email',
        isAvailable: true,
        planType: 'free',
      },
      {
        id: 'support-priority',
        name: 'Suporte Prioritário',
        description: 'Suporte prioritário com resposta em até 2h',
        icon: 'support_agent',
        isAvailable: true,
        planType: 'pro',
      },
    ];

    return of(features).pipe(delay(200));
  }

  // Observables para reatividade
  get plans$(): Observable<PlanPricing[]> {
    return this.plansSubject.asObservable();
  }

  get skus$(): Observable<SKUPricing[]> {
    return this.skusSubject.asObservable();
  }

  // Método para resetar dados mockados (útil para testes)
  resetMockData(): void {
    // Restaurar dados originais
    this.mockPlans = [
      {
        id: 'free',
        name: 'Gratuito',
        type: 'free',
        basePrice: 0,
        currency: 'BRL',
        description: 'Acesso básico às funcionalidades da plataforma',
        features: [
          'Dashboard básico',
          'Visualização de carteira',
          'Dados de mercado limitados',
          'Suporte por email',
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'pro',
        name: 'PRO',
        type: 'pro',
        basePrice: 29.9,
        currency: 'BRL',
        description: 'Acesso completo com funcionalidades avançadas',
        features: [
          'Dashboard completo',
          'Análises avançadas',
          'Dados atualizados diariamente',
          'Alertas personalizados',
          'Relatórios detalhados',
          'Suporte prioritário',
          'API de dados',
          'Backtesting de estratégias',
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    this.mockSKUs = [
      {
        id: 'pro-monthly',
        planId: 'pro',
        name: 'PRO Mensal',
        period: 'monthly',
        price: 29.9,
        currency: 'BRL',
        isPopular: false,
        features: [
          'Acesso completo por 1 mês',
          'Cancelamento a qualquer momento',
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'pro-semiannual',
        planId: 'pro',
        name: 'PRO Semestral',
        period: 'semiannual',
        price: 149.9,
        originalPrice: 179.4,
        discountPercentage: 16,
        currency: 'BRL',
        isPopular: true,
        features: [
          'Acesso completo por 6 meses',
          'Economia de R$ 29,50',
          'Cancelamento a qualquer momento',
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'pro-annual',
        planId: 'pro',
        name: 'PRO Anual',
        period: 'annual',
        price: 269.9,
        originalPrice: 358.8,
        discountPercentage: 25,
        currency: 'BRL',
        isPopular: false,
        features: [
          'Acesso completo por 12 meses',
          'Economia de R$ 88,90',
          'Cancelamento a qualquer momento',
          '2 meses grátis',
        ],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    // Atualizar observables
    this.plansSubject.next([...this.mockPlans]);
    this.skusSubject.next([...this.mockSKUs]);
  }
}
