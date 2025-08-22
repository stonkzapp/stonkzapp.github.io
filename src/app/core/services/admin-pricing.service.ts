import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  AdminPricingPlan,
  CreatePricingPlanRequest,
  UpdatePricingPlanRequest,
} from '../models/models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AdminPricingService extends BaseService {
  private pricingPlansSubject = new BehaviorSubject<AdminPricingPlan[]>([]);
  public pricingPlans$ = this.pricingPlansSubject.asObservable();

  constructor() {
    super();
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const mockPlans = this.generateMockPricingPlans();
    this.pricingPlansSubject.next(mockPlans);
  }

  // Obter todos os planos de preços
  getAllPricingPlans(): Observable<AdminPricingPlan[]> {
    return of(this.pricingPlansSubject.value).pipe(delay(300));
  }

  // Obter planos ativos
  getActivePricingPlans(): Observable<AdminPricingPlan[]> {
    const activePlans = this.pricingPlansSubject.value.filter(
      plan => plan.isActive
    );
    return of(activePlans).pipe(delay(300));
  }

  // Obter plano por ID
  getPricingPlanById(id: string): Observable<AdminPricingPlan | null> {
    const plan = this.pricingPlansSubject.value.find(p => p.id === id) || null;
    return of(plan).pipe(delay(200));
  }

  // Criar novo plano
  createPricingPlan(
    request: CreatePricingPlanRequest
  ): Observable<AdminPricingPlan> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          const newPlan: AdminPricingPlan = {
            id: this.generateId(),
            ...request,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const currentPlans = this.pricingPlansSubject.value;
          const updatedPlans = [...currentPlans, newPlan];
          this.pricingPlansSubject.next(updatedPlans);

          observer.next(newPlan);
          observer.complete();
        } catch (error) {
          observer.error({ message: 'Erro ao criar plano de preços' });
        }
      }, 500);
    });
  }

  // Atualizar plano existente
  updatePricingPlan(
    request: UpdatePricingPlanRequest
  ): Observable<AdminPricingPlan> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          const currentPlans = this.pricingPlansSubject.value;
          const planIndex = currentPlans.findIndex(p => p.id === request.id);

          if (planIndex === -1) {
            observer.error({ message: 'Plano não encontrado' });
            return;
          }

          const updatedPlan: AdminPricingPlan = {
            ...currentPlans[planIndex],
            ...request,
            updatedAt: new Date(),
          };

          const updatedPlans = [...currentPlans];
          updatedPlans[planIndex] = updatedPlan;
          this.pricingPlansSubject.next(updatedPlans);

          observer.next(updatedPlan);
          observer.complete();
        } catch (error) {
          observer.error({ message: 'Erro ao atualizar plano de preços' });
        }
      }, 500);
    });
  }

  // Deletar plano
  deletePricingPlan(id: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          const currentPlans = this.pricingPlansSubject.value;
          const planIndex = currentPlans.findIndex(p => p.id === id);

          if (planIndex === -1) {
            observer.error({ message: 'Plano não encontrado' });
            return;
          }

          // Verificar se o plano pode ser deletado (não tem usuários ativos)
          const canDelete = this.canDeletePlan(id);
          if (!canDelete) {
            observer.error({
              message: 'Não é possível deletar um plano com usuários ativos',
            });
            return;
          }

          const updatedPlans = currentPlans.filter(p => p.id !== id);
          this.pricingPlansSubject.next(updatedPlans);

          observer.next(true);
          observer.complete();
        } catch (error) {
          observer.error({ message: 'Erro ao deletar plano de preços' });
        }
      }, 500);
    });
  }

  // Ativar/Desativar plano
  togglePlanStatus(id: string): Observable<AdminPricingPlan> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          const currentPlans = this.pricingPlansSubject.value;
          const planIndex = currentPlans.findIndex(p => p.id === id);

          if (planIndex === -1) {
            observer.error({ message: 'Plano não encontrado' });
            return;
          }

          const updatedPlan: AdminPricingPlan = {
            ...currentPlans[planIndex],
            isActive: !currentPlans[planIndex].isActive,
            updatedAt: new Date(),
          };

          const updatedPlans = [...currentPlans];
          updatedPlans[planIndex] = updatedPlan;
          this.pricingPlansSubject.next(updatedPlans);

          observer.next(updatedPlan);
          observer.complete();
        } catch (error) {
          observer.error({ message: 'Erro ao alterar status do plano' });
        }
      }, 300);
    });
  }

  // Reordenar planos (prioridade)
  reorderPlans(planIds: string[]): Observable<AdminPricingPlan[]> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          const currentPlans = this.pricingPlansSubject.value;
          const reorderedPlans = planIds
            .map((id, index) => {
              const plan = currentPlans.find(p => p.id === id);
              if (plan) {
                return { ...plan, priority: index + 1, updatedAt: new Date() };
              }
              return null;
            })
            .filter(Boolean) as AdminPricingPlan[];

          this.pricingPlansSubject.next(reorderedPlans);

          observer.next(reorderedPlans);
          observer.complete();
        } catch (error) {
          observer.error({ message: 'Erro ao reordenar planos' });
        }
      }, 400);
    });
  }

  // Obter estatísticas de planos
  getPlanStatistics(): Observable<any> {
    const stats = {
      totalPlans: this.pricingPlansSubject.value.length,
      activePlans: this.pricingPlansSubject.value.filter(p => p.isActive)
        .length,
      inactivePlans: this.pricingPlansSubject.value.filter(p => !p.isActive)
        .length,
      popularPlans: this.pricingPlansSubject.value.filter(p => p.isPopular)
        .length,
      averagePrice: this.calculateAveragePrice(),
      priceRange: this.getPriceRange(),
      plansByInterval: this.groupPlansByInterval(),
    };

    return of(stats).pipe(delay(200));
  }

  // Validar dados do plano
  validatePlanData(
    data: CreatePricingPlanRequest | UpdatePricingPlanRequest
  ): string[] {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (data.price !== undefined && data.price < 0) {
      errors.push('Preço deve ser maior ou igual a zero');
    }

    if (!data.features || data.features.length === 0) {
      errors.push('Pelo menos uma funcionalidade deve ser especificada');
    }

    if (data.maxWallets !== undefined && data.maxWallets < 1) {
      errors.push('Número máximo de carteiras deve ser pelo menos 1');
    }

    if (data.maxConnections !== undefined && data.maxConnections < 1) {
      errors.push('Número máximo de conexões deve ser pelo menos 1');
    }

    return errors;
  }

  // Gerar dados mock iniciais
  private generateMockPricingPlans(): AdminPricingPlan[] {
    return [
      {
        id: 'plan-free',
        name: 'Gratuito',
        description: 'Plano gratuito com funcionalidades básicas para começar',
        price: 0,
        currency: 'BRL',
        interval: 'monthly',
        features: [
          '1 carteira',
          '3 conexões',
          'Dados básicos de mercado',
          'Suporte por email',
        ],
        isActive: true,
        isPopular: false,
        maxWallets: 1,
        maxConnections: 3,
        priority: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'plan-pro-monthly',
        name: 'Pro Mensal',
        description: 'Plano profissional mensal com todas as funcionalidades',
        price: 29.9,
        currency: 'BRL',
        interval: 'monthly',
        features: [
          'Carteiras ilimitadas',
          'Conexões ilimitadas',
          'Dados em tempo real',
          'Análises avançadas',
          'Relatórios personalizados',
          'Suporte prioritário',
          'API access',
        ],
        isActive: true,
        isPopular: true,
        maxWallets: -1, // ilimitado
        maxConnections: -1, // ilimitado
        priority: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 'plan-pro-yearly',
        name: 'Pro Anual',
        description: 'Plano profissional anual com 20% de desconto',
        price: 239.9,
        currency: 'BRL',
        interval: 'yearly',
        features: [
          'Carteiras ilimitadas',
          'Conexões ilimitadas',
          'Dados em tempo real',
          'Análises avançadas',
          'Relatórios personalizados',
          'Suporte prioritário',
          'API access',
          '20% de desconto',
          'Backup automático',
        ],
        isActive: true,
        isPopular: false,
        maxWallets: -1,
        maxConnections: -1,
        priority: 3,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
      },
    ];
  }

  // Utilitários privados
  private generateId(): string {
    return 'plan-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private canDeletePlan(planId: string): boolean {
    // Mock: sempre permite deletar para desenvolvimento
    // Na implementação real, verificar se há usuários com este plano
    return true;
  }

  private calculateAveragePrice(): number {
    const plans = this.pricingPlansSubject.value.filter(p => p.price > 0);
    if (plans.length === 0) return 0;

    const total = plans.reduce((sum, plan) => sum + plan.price, 0);
    return Math.round((total / plans.length) * 100) / 100;
  }

  private getPriceRange(): { min: number; max: number } {
    const prices = this.pricingPlansSubject.value.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  private groupPlansByInterval(): any {
    const plans = this.pricingPlansSubject.value;
    return {
      monthly: plans.filter(p => p.interval === 'monthly').length,
      yearly: plans.filter(p => p.interval === 'yearly').length,
      one_time: plans.filter(p => p.interval === 'one_time').length,
    };
  }
}
