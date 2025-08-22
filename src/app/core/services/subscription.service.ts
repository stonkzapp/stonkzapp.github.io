import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {
  SubscriptionPlan,
  SubscriptionSKU,
  UserSubscription,
  SubscriptionFeature,
} from '../models/models';
import {
  MercadoPagoService,
  MercadoPagoPreference,
} from './mercadopago.service';
import {
  PlanPricingService,
  PlanPricing,
  SKUPricing,
} from './plan-pricing.service';
import { switchMap, tap, map } from 'rxjs/operators';
import {
  MOCK_SUBSCRIPTION_PLANS,
  MOCK_SUBSCRIPTION_SKUS,
  MOCK_USER_SUBSCRIPTION,
  MOCK_SUBSCRIPTION_FEATURES,
  getMockSubscriptionByUserId,
  isProUser,
} from '../config/mock-data';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService extends BaseService {
  private currentSubscriptionSubject =
    new BehaviorSubject<UserSubscription | null>(null);
  public currentSubscription$ = this.currentSubscriptionSubject.asObservable();

  constructor(
    private mercadoPagoService: MercadoPagoService,
    private planPricingService: PlanPricingService
  ) {
    super();
    // Inicializar com mock de usuário PRO
    this.currentSubscriptionSubject.next(MOCK_USER_SUBSCRIPTION);
  }

  // Obter todos os planos disponíveis
  getAvailablePlans(): Observable<SubscriptionPlan[]> {
    return of(MOCK_SUBSCRIPTION_PLANS);
  }

  // Obter SKUs disponíveis para um plano
  getAvailableSKUs(planId: string): Observable<SubscriptionSKU[]> {
    if (planId === 'free') {
      return of([]); // Plano gratuito não tem SKUs
    }

    return of(MOCK_SUBSCRIPTION_SKUS.filter(sku => sku.planId === planId));
  }

  // Obter todas as funcionalidades disponíveis
  getAvailableFeatures(): Observable<SubscriptionFeature[]> {
    return of(MOCK_SUBSCRIPTION_FEATURES);
  }

  // Obter assinatura atual do usuário
  getCurrentSubscription(userId: string): Observable<UserSubscription | null> {
    const mockSubscription = getMockSubscriptionByUserId(userId);
    this.currentSubscriptionSubject.next(mockSubscription);
    return of(mockSubscription);
  }

  // Criar nova assinatura com Mercado Pago
  createSubscription(
    subscriptionData: Partial<UserSubscription>
  ): Observable<MercadoPagoPreference> {
    if (
      !subscriptionData.userId ||
      !subscriptionData.skuId ||
      !subscriptionData.planId
    ) {
      throw new Error('Dados de assinatura incompletos');
    }

    // Obter informações do SKU
    return this.getAvailableSKUs(subscriptionData.planId).pipe(
      switchMap(skus => {
        const sku = skus.find(s => s.id === subscriptionData.skuId);
        if (!sku) {
          throw new Error('SKU não encontrado');
        }

        // Criar preferência no Mercado Pago
        return this.mercadoPagoService.createPreference({
          planId: subscriptionData.planId!,
          skuId: subscriptionData.skuId!,
          userId: subscriptionData.userId!,
          planName: 'PRO',
          period: this.getPeriodInPortuguese(sku.period),
          price: sku.price,
          currency: sku.currency,
        });
      })
    );
  }

  // Processar pagamento aprovado
  processApprovedPayment(paymentId: string): Observable<UserSubscription> {
    return this.mercadoPagoService.processPayment(paymentId).pipe(
      switchMap(payment => {
        // Simular nova assinatura
        const mockSubscription: UserSubscription = {
          id: `sub_${Date.now()}`,
          userId: 'user-123',
          planId: 'pro',
          skuId: 'pro-monthly', // Em produção, viria do payment
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          autoRenew: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        this.currentSubscriptionSubject.next(mockSubscription);
        return of(mockSubscription);
      })
    );
  }

  // Cancelar assinatura
  cancelSubscription(subscriptionId: string): Observable<boolean> {
    return this.mercadoPagoService.cancelSubscription(subscriptionId).pipe(
      tap(success => {
        if (success) {
          // Atualizar status da assinatura
          const currentSub = this.currentSubscriptionSubject.value;
          if (currentSub && currentSub.id === subscriptionId) {
            currentSub.status = 'cancelled';
            this.currentSubscriptionSubject.next(currentSub);
          }
        }
      })
    );
  }

  // Renovar assinatura
  renewSubscription(subscriptionId: string): Observable<boolean> {
    return this.mercadoPagoService.renewSubscription(subscriptionId).pipe(
      tap(success => {
        if (success) {
          // Atualizar datas da assinatura
          const currentSub = this.currentSubscriptionSubject.value;
          if (currentSub && currentSub.id === subscriptionId) {
            currentSub.endDate = new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            );
            currentSub.nextPaymentDate = new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            );
            currentSub.updatedAt = new Date();
            this.currentSubscriptionSubject.next(currentSub);
          }
        }
      })
    );
  }

  // Verificar se usuário tem acesso a uma funcionalidade
  hasFeatureAccess(userId: string, featureId: string): Observable<boolean> {
    return new Observable(observer => {
      this.getCurrentSubscription(userId).subscribe(subscription => {
        if (!subscription || subscription.status !== 'active') {
          observer.next(false);
          observer.complete();
          return;
        }

        // Verificar se a funcionalidade está disponível no plano atual
        this.getAvailableFeatures().subscribe(features => {
          const feature = features.find(f => f.id === featureId);
          if (!feature) {
            observer.next(false);
            observer.complete();
            return;
          }

          if (feature.planType === 'free') {
            observer.next(true);
          } else if (
            feature.planType === 'pro' &&
            subscription.planId === 'pro'
          ) {
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        });
      });
    });
  }

  // Obter preço formatado
  formatPrice(price: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }

  // Calcular economia
  calculateSavings(originalPrice: number, currentPrice: number): number {
    return originalPrice - currentPrice;
  }

  // Obter período em português
  getPeriodInPortuguese(period: string): string {
    const periods = {
      monthly: 'Mensal',
      semiannual: 'Semestral',
      annual: 'Anual',
    };
    return periods[period as keyof typeof periods] || period;
  }

  // Redirecionar para checkout do Mercado Pago
  redirectToCheckout(preferenceId: string): void {
    this.mercadoPagoService.redirectToCheckout(preferenceId, true); // true para sandbox
  }

  // Métodos para gestão de preços (delegam para PlanPricingService)

  // Atualizar preço base de um plano
  updatePlanBasePrice(
    planId: string,
    newBasePrice: number
  ): Observable<boolean> {
    return this.planPricingService
      .updatePlanPricing(planId, { basePrice: newBasePrice })
      .pipe(map(plan => !!plan));
  }

  // Atualizar preço de um SKU
  updateSKUPrice(skuId: string, newPrice: number): Observable<boolean> {
    return this.planPricingService
      .updateSKUPricing(skuId, { price: newPrice })
      .pipe(map(sku => !!sku));
  }

  // Recalcular preços de um plano
  recalculatePlanPricing(planId: string): Observable<boolean> {
    return this.planPricingService.recalculatePlanPricing(planId);
  }

  // Obter observables reativos
  get plans$() {
    return this.planPricingService.plans$;
  }

  get skus$() {
    return this.planPricingService.skus$;
  }

  // Verificar se o usuário tem plano PRO
  isProUser(): boolean {
    // Usar mock para usuário PRO
    return isProUser('user-123');
  }

  // Verificar se o usuário tem plano específico
  hasPlan(userId: string, planType: 'free' | 'pro'): Observable<boolean> {
    return new Observable(observer => {
      this.getCurrentSubscription(userId).subscribe(subscription => {
        if (!subscription || subscription.status !== 'active') {
          observer.next(planType === 'free');
          observer.complete();
          return;
        }

        // Verificar se o plano atual corresponde ao tipo solicitado
        const hasAccess = subscription.planId === planType;
        observer.next(hasAccess);
        observer.complete();
      });
    });
  }
}
