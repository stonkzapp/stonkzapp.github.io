import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SubscriptionService } from '../../core/services/subscription.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  PlanPricingService,
  PlanPricing,
  SKUPricing,
} from '../../core/services/plan-pricing.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stz-plan-pricing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './plan-pricing.component.html',
  styleUrls: ['./plan-pricing.component.scss'],
})
export class PlanPricingComponent implements OnInit, OnDestroy {
  plans: PlanPricing[] = [];
  skus: SKUPricing[] = [];
  isLoading = false;
  editingPlan: PlanPricing | null = null;
  editingSKU: SKUPricing | null = null;

  planForm: FormGroup;
  skuForm: FormGroup;

  private subscription = new Subscription();

  constructor(
    private subscriptionService: SubscriptionService,
    private planPricingService: PlanPricingService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.planForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['pro', Validators.required],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      currency: ['BRL', Validators.required],
      description: ['', Validators.required],
      isActive: [true],
    });

    this.skuForm = this.formBuilder.group({
      name: ['', Validators.required],
      period: ['monthly', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [0, [Validators.min(0)]],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      isPopular: [false],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadData(): void {
    this.isLoading = true;

    // Carregar planos
    this.subscription.add(
      this.planPricingService.plans$.subscribe(plans => {
        this.plans = plans;
        this.isLoading = false;
      })
    );

    // Carregar SKUs
    this.subscription.add(
      this.planPricingService.skus$.subscribe(skus => {
        this.skus = skus;
      })
    );
  }

  // Editar plano
  editPlan(plan: PlanPricing): void {
    this.editingPlan = { ...plan };
    this.planForm.patchValue({
      name: plan.name,
      type: plan.type,
      basePrice: plan.basePrice,
      currency: plan.currency,
      description: plan.description,
      isActive: plan.isActive,
    });
  }

  // Salvar alterações do plano
  savePlan(): void {
    if (this.planForm.valid && this.editingPlan) {
      const updates = this.planForm.value;

      this.subscriptionService
        .updatePlanBasePrice(this.editingPlan.id, updates.basePrice)
        .subscribe({
          next: success => {
            if (success) {
              this.notificationService.showSuccess(
                'Preço do plano atualizado com sucesso!'
              );

              // Recalcular preços dos SKUs
              this.subscriptionService
                .recalculatePlanPricing(this.editingPlan!.id)
                .subscribe();

              this.cancelEditPlan();
            }
          },
          error: error => {
            console.error('Erro ao atualizar plano:', error);
            this.notificationService.showError(
              'Erro ao atualizar plano. Tente novamente.'
            );
          },
        });
    }
  }

  // Cancelar edição do plano
  cancelEditPlan(): void {
    this.editingPlan = null;
    this.planForm.reset({
      name: '',
      type: 'pro',
      basePrice: 0,
      currency: 'BRL',
      description: '',
      isActive: true,
    });
  }

  // Editar SKU
  editSKU(sku: SKUPricing): void {
    this.editingSKU = { ...sku };
    this.skuForm.patchValue({
      name: sku.name,
      period: sku.period,
      price: sku.price,
      originalPrice: sku.originalPrice || 0,
      discountPercentage: sku.discountPercentage || 0,
      isPopular: sku.isPopular || false,
      isActive: sku.isActive,
    });
  }

  // Salvar alterações do SKU
  saveSKU(): void {
    if (this.skuForm.valid && this.editingSKU) {
      const updates = this.skuForm.value;

      this.subscriptionService
        .updateSKUPrice(this.editingSKU.id, updates.price)
        .subscribe({
          next: success => {
            if (success) {
              this.notificationService.showSuccess(
                'Preço do SKU atualizado com sucesso!'
              );

              this.cancelEditSKU();
            }
          },
          error: error => {
            console.error('Erro ao atualizar SKU:', error);
            this.notificationService.showError(
              'Erro ao atualizar SKU. Tente novamente.'
            );
          },
        });
    }
  }

  // Cancelar edição do SKU
  cancelEditSKU(): void {
    this.editingSKU = null;
    this.skuForm.reset({
      name: '',
      period: 'monthly',
      price: 0,
      originalPrice: 0,
      discountPercentage: 0,
      isPopular: false,
      isActive: true,
    });
  }

  // Obter SKUs de um plano específico
  getSKUsForPlan(planId: string): SKUPricing[] {
    return this.skus.filter(sku => sku.planId === planId);
  }

  // Formatar preço
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

  // Resetar dados mockados (para testes)
  resetMockData(): void {
    this.planPricingService.resetMockData();
    this.notificationService.showSuccess(
      'Dados resetados para valores padrão!'
    );
  }
}
