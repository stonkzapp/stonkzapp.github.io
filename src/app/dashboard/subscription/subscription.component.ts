import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { NotificationService } from '../../core/services/notification.service';
import { ButtonComponent } from '../../shared/button/button.component';
import {
  SubscriptionPlan,
  SubscriptionSKU,
  UserSubscription,
  SubscriptionFeature,
} from '../../core/models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stz-subscription',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    ButtonComponent,
  ],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  plans: SubscriptionPlan[] = [];
  features: SubscriptionFeature[] = [];
  currentSubscription: UserSubscription | null = null;
  isLoading = false;
  selectedPlan: SubscriptionPlan | null = null;
  selectedSKU: SubscriptionSKU | null = null;
  isProcessingPayment = false;

  // Propriedade para armazenar SKUs do plano selecionado
  planSKUs: SubscriptionSKU[] = [];

  private subscription = new Subscription();

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadData(): void {
    this.isLoading = true;

    // Carregar planos disponíveis usando observable reativo
    this.subscription.add(
      this.subscriptionService.plans$.subscribe(plans => {
        this.plans = plans;
        this.isLoading = false;
      })
    );

    // Carregar funcionalidades
    this.subscription.add(
      this.subscriptionService.getAvailableFeatures().subscribe(features => {
        console.log('Funcionalidades carregadas no ngOnInit:', features);
        this.features = features;
      })
    );

    // Carregar assinatura atual (simular userId)
    this.subscription.add(
      this.subscriptionService
        .getCurrentSubscription('user-123')
        .subscribe(sub => {
          this.currentSubscription = sub;
        })
    );
  }

  selectPlan(plan: SubscriptionPlan): void {
    this.selectedPlan = plan;
    this.selectedSKU = null;

    // Carregar SKUs do plano selecionado
    if (plan.type === 'pro') {
      this.subscription.add(
        this.subscriptionService.getAvailableSKUs(plan.id).subscribe(skus => {
          this.planSKUs = skus;
        })
      );
    } else {
      this.planSKUs = [];
    }
  }

  selectSKU(sku: SubscriptionSKU): void {
    this.selectedSKU = sku;
  }

  getPlanFeatures(planType: 'free' | 'pro'): SubscriptionFeature[] {
    // Agora o serviço retorna 'pro' diretamente, não precisa mais mapear
    const filteredFeatures = this.features.filter(f => f.planType === planType);

    // Debug temporário
    console.log(`getPlanFeatures('${planType}'):`, {
      totalFeatures: this.features.length,
      filteredFeatures: filteredFeatures.length,
      features: this.features,
      filtered: filteredFeatures,
    });

    return filteredFeatures;
  }

  isCurrentPlan(planId: string): boolean {
    return this.currentSubscription?.planId === planId;
  }

  isCurrentSKU(skuId: string): boolean {
    return this.currentSubscription?.skuId === skuId;
  }

  getPlanStatus(planId: string): string {
    if (this.isCurrentPlan(planId)) {
      return 'Ativo';
    }
    return 'Disponível';
  }

  getPlanStatusColor(planId: string): string {
    if (this.isCurrentPlan(planId)) {
      return 'accent';
    }
    return 'primary';
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

  // Formatar preço
  formatPrice(price: number, currency: string = 'BRL'): string {
    return this.subscriptionService.formatPrice(price, currency);
  }

  async onSubscribe(
    plan: SubscriptionPlan,
    sku?: SubscriptionSKU
  ): Promise<void> {
    if (plan.type === 'free') {
      // Plano gratuito - apenas navegar
      this.router.navigate(['/dashboard']);
      return;
    }

    if (!sku) {
      this.notificationService.showError('Selecione um plano de pagamento');
      return;
    }

    try {
      this.isProcessingPayment = true;

      // Criar assinatura com Mercado Pago
      this.subscriptionService
        .createSubscription({
          userId: 'user-123', // Em produção, viria do auth service
          planId: plan.id,
          skuId: sku.id,
        })
        .subscribe({
          next: preference => {
            this.isProcessingPayment = false;

            // Redirecionar para checkout do Mercado Pago
            this.subscriptionService.redirectToCheckout(preference.id);
          },
          error: error => {
            this.isProcessingPayment = false;
            console.error('Erro ao criar assinatura:', error);

            this.notificationService.showError(
              'Erro ao processar pagamento. Tente novamente.'
            );
          },
        });
    } catch (error) {
      this.isProcessingPayment = false;
      console.error('Erro ao processar assinatura:', error);

      this.notificationService.showError(
        'Erro ao processar assinatura. Tente novamente.'
      );
    }
  }

  onCancelSubscription(): void {
    if (this.currentSubscription) {
      this.subscriptionService
        .cancelSubscription(this.currentSubscription.id)
        .subscribe({
          next: success => {
            if (success) {
              this.notificationService.showSuccess(
                'Assinatura cancelada com sucesso'
              );

              this.currentSubscription = null;
              // Recarregar dados
              this.loadData();
            }
          },
          error: error => {
            console.error('Erro ao cancelar assinatura:', error);
            this.notificationService.showError(
              'Erro ao cancelar assinatura. Tente novamente.'
            );
          },
        });
    }
  }

  onRenewSubscription(): void {
    if (this.currentSubscription) {
      this.subscriptionService
        .renewSubscription(this.currentSubscription.id)
        .subscribe({
          next: success => {
            if (success) {
              this.notificationService.showSuccess(
                'Assinatura renovada com sucesso'
              );

              // Recarregar dados
              this.loadData();
            }
          },
          error: error => {
            console.error('Erro ao renovar assinatura:', error);
            this.notificationService.showError(
              'Erro ao renovar assinatura. Tente novamente.'
            );
          },
        });
    }
  }
}
