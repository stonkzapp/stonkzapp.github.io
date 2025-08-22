import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

// Services
import { AdminPricingService } from '../../core/services/admin-pricing.service';
import { NotificationService } from '../../core/services/notification.service';

// Models
import {
  AdminPricingPlan,
  CreatePricingPlanRequest,
  UpdatePricingPlanRequest,
} from '../../core/models/models';

@Component({
  selector: 'app-admin-pricing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
  ],
  template: `
    <div class="admin-pricing">
      <!-- Header -->
      <div class="pricing-header">
        <div class="header-content">
          <h1>Gestão de Preços</h1>
          <p class="header-subtitle">Gerencie planos e preços do Stonkz</p>
        </div>
        <div class="header-actions">
          <button
            mat-raised-button
            color="primary"
            (click)="openCreatePlanDialog()">
            <mat-icon>add</mat-icon>
            Novo Plano
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="pricing-stats">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">list_alt</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ pricingPlans().length }}</span>
                <span class="stat-label">Total de Planos</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon active">check_circle</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ getActivePlansCount() }}</span>
                <span class="stat-label">Planos Ativos</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon popular">star</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ getPopularPlansCount() }}</span>
                <span class="stat-label">Planos Populares</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon revenue">attach_money</mat-icon>
              <div class="stat-info">
                <span class="stat-value">{{ getAveragePrice() }}</span>
                <span class="stat-label">Preço Médio</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabs -->
      <mat-tab-group class="pricing-tabs" animationDuration="300ms">
        <!-- Plans Management Tab -->
        <mat-tab label="Gerenciar Planos">
          <div class="tab-content">
            <!-- Plans Grid -->
            <div class="plans-grid">
              <mat-card
                *ngFor="let plan of pricingPlans()"
                class="plan-card"
                [class.inactive]="!plan.isActive">
                <!-- Plan Header -->
                <mat-card-header>
                  <div class="plan-header-content">
                    <div class="plan-title-section">
                      <mat-card-title>{{ plan.name }}</mat-card-title>
                      <mat-card-subtitle>{{
                        plan.description
                      }}</mat-card-subtitle>
                    </div>
                    <div class="plan-badges">
                      <mat-chip *ngIf="plan.isPopular" class="popular-chip"
                        >Popular</mat-chip
                      >
                      <mat-chip
                        [class]="
                          plan.isActive ? 'active-chip' : 'inactive-chip'
                        ">
                        {{ plan.isActive ? 'Ativo' : 'Inativo' }}
                      </mat-chip>
                    </div>
                  </div>
                </mat-card-header>

                <!-- Plan Content -->
                <mat-card-content>
                  <!-- Price -->
                  <div class="plan-price">
                    <span class="price-value">{{
                      formatCurrency(plan.price)
                    }}</span>
                    <span class="price-interval"
                      >/ {{ getIntervalLabel(plan.interval) }}</span
                    >
                  </div>

                  <!-- Features -->
                  <div class="plan-features">
                    <h4>Funcionalidades:</h4>
                    <ul class="features-list">
                      <li *ngFor="let feature of plan.features.slice(0, 4)">
                        <mat-icon>check</mat-icon>
                        {{ feature }}
                      </li>
                      <li
                        *ngIf="plan.features.length > 4"
                        class="more-features">
                        +{{ plan.features.length - 4 }} mais funcionalidades
                      </li>
                    </ul>
                  </div>

                  <!-- Limits -->
                  <div class="plan-limits">
                    <div class="limit-item">
                      <mat-icon>account_balance_wallet</mat-icon>
                      <span
                        >{{
                          plan.maxWallets === -1
                            ? 'Ilimitadas'
                            : plan.maxWallets
                        }}
                        carteiras</span
                      >
                    </div>
                    <div class="limit-item">
                      <mat-icon>link</mat-icon>
                      <span
                        >{{
                          plan.maxConnections === -1
                            ? 'Ilimitadas'
                            : plan.maxConnections
                        }}
                        conexões</span
                      >
                    </div>
                  </div>
                </mat-card-content>

                <!-- Plan Actions -->
                <mat-card-actions>
                  <button mat-button (click)="editPlan(plan)">
                    <mat-icon>edit</mat-icon>
                    Editar
                  </button>
                  <button mat-button (click)="togglePlanStatus(plan)">
                    <mat-icon>{{
                      plan.isActive ? 'visibility_off' : 'visibility'
                    }}</mat-icon>
                    {{ plan.isActive ? 'Desativar' : 'Ativar' }}
                  </button>
                  <button
                    mat-icon-button
                    [matMenuTriggerFor]="planMenu"
                    class="more-actions">
                    <mat-icon>more_vert</mat-icon>
                  </button>

                  <mat-menu #planMenu="matMenu">
                    <button mat-menu-item (click)="duplicatePlan(plan)">
                      <mat-icon>content_copy</mat-icon>
                      Duplicar
                    </button>
                    <button mat-menu-item (click)="viewPlanDetails(plan)">
                      <mat-icon>info</mat-icon>
                      Detalhes
                    </button>
                    <mat-divider></mat-divider>
                    <button
                      mat-menu-item
                      (click)="deletePlan(plan)"
                      class="delete-action">
                      <mat-icon>delete</mat-icon>
                      Excluir
                    </button>
                  </mat-menu>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Create/Edit Plan Tab -->
        <mat-tab label="Criar/Editar Plano" [disabled]="!showPlanForm()">
          <div class="tab-content" *ngIf="showPlanForm()">
            <mat-card class="plan-form-card">
              <mat-card-header>
                <mat-card-title>{{
                  editingPlan() ? 'Editar Plano' : 'Criar Novo Plano'
                }}</mat-card-title>
                <mat-card-subtitle>{{
                  editingPlan()
                    ? 'Modifique as informações do plano'
                    : 'Configure um novo plano de preços'
                }}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <form [formGroup]="planForm" class="plan-form">
                  <!-- Basic Info -->
                  <div class="form-section">
                    <h3>Informações Básicas</h3>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Nome do Plano</mat-label>
                        <input
                          matInput
                          placeholder="Ex: Pro Mensal"
                          formControlName="name"
                          required />
                        <mat-error
                          *ngIf="planForm.get('name')?.hasError('required')">
                          Nome do plano é obrigatório
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field>
                        <mat-label>Intervalo</mat-label>
                        <mat-select formControlName="interval">
                          <mat-option value="monthly">Mensal</mat-option>
                          <mat-option value="yearly">Anual</mat-option>
                          <mat-option value="one_time"
                            >Pagamento Único</mat-option
                          >
                        </mat-select>
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Descrição</mat-label>
                      <textarea
                        matInput
                        placeholder="Descreva o plano de forma clara e atrativa"
                        formControlName="description"
                        rows="3"
                        required></textarea>
                      <mat-error
                        *ngIf="
                          planForm.get('description')?.hasError('required')
                        ">
                        Descrição é obrigatória
                      </mat-error>
                    </mat-form-field>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Preço (R$)</mat-label>
                        <input
                          matInput
                          type="number"
                          placeholder="0.00"
                          formControlName="price"
                          required />
                        <mat-error
                          *ngIf="planForm.get('price')?.hasError('required')">
                          Preço é obrigatório
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Prioridade</mat-label>
                        <input
                          matInput
                          type="number"
                          placeholder="1"
                          formControlName="priority"
                          required />
                        <mat-error
                          *ngIf="
                            planForm.get('priority')?.hasError('required')
                          ">
                          Prioridade é obrigatória
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </div>

                  <!-- Limits -->
                  <div class="form-section">
                    <h3>Limites</h3>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Máximo de Carteiras</mat-label>
                        <input
                          matInput
                          type="number"
                          placeholder="-1 para ilimitado"
                          formControlName="maxWallets"
                          required />
                        <mat-error
                          *ngIf="
                            planForm.get('maxWallets')?.hasError('required')
                          ">
                          Máximo de carteiras é obrigatório
                        </mat-error>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Máximo de Conexões</mat-label>
                        <input
                          matInput
                          type="number"
                          placeholder="-1 para ilimitado"
                          formControlName="maxConnections"
                          required />
                        <mat-error
                          *ngIf="
                            planForm.get('maxConnections')?.hasError('required')
                          ">
                          Máximo de conexões é obrigatório
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </div>

                  <!-- Features -->
                  <div class="form-section">
                    <h3>Funcionalidades</h3>

                    <div class="features-form">
                      <div
                        *ngFor="
                          let feature of getFeatureControls();
                          let i = index
                        "
                        class="feature-item">
                        <mat-form-field appearance="outline" class="full-width">
                          <mat-label>Funcionalidade {{ i + 1 }}</mat-label>
                          <input
                            matInput
                            placeholder="Descreva uma funcionalidade"
                            [formControl]="feature"
                            required />
                          <mat-error *ngIf="feature.hasError('required')">
                            Funcionalidade é obrigatória
                          </mat-error>
                        </mat-form-field>
                        <button
                          type="button"
                          mat-icon-button
                          color="warn"
                          (click)="removeFeature(i)"
                          [disabled]="getFeatureControls().length <= 1">
                          <mat-icon>remove</mat-icon>
                        </button>
                      </div>

                      <button
                        type="button"
                        mat-button
                        color="primary"
                        (click)="addFeature()">
                        <mat-icon>add</mat-icon>
                        Adicionar Funcionalidade
                      </button>
                    </div>
                  </div>

                  <!-- Settings -->
                  <div class="form-section">
                    <h3>Configurações</h3>

                    <div class="settings-row">
                      <mat-slide-toggle formControlName="isActive">
                        Plano Ativo
                      </mat-slide-toggle>

                      <mat-slide-toggle formControlName="isPopular">
                        Plano Popular
                      </mat-slide-toggle>
                    </div>
                  </div>
                </form>
              </mat-card-content>

              <mat-card-actions class="form-actions">
                <button mat-button (click)="cancelPlanForm()">Cancelar</button>
                <button
                  mat-raised-button
                  color="primary"
                  (click)="savePlan()"
                  [disabled]="planForm.invalid || isSaving()">
                  <mat-icon *ngIf="isSaving()">hourglass_empty</mat-icon>
                  {{ editingPlan() ? 'Atualizar Plano' : 'Criar Plano' }}
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styleUrls: ['./admin-pricing.component.scss'],
})
export class AdminPricingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  pricingPlans = signal<AdminPricingPlan[]>([]);
  showPlanForm = signal(false);
  editingPlan = signal<AdminPricingPlan | null>(null);
  isSaving = signal(false);

  planForm: FormGroup;

  constructor(
    private adminPricingService: AdminPricingService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.planForm = this.createPlanForm();
  }

  ngOnInit(): void {
    this.loadPricingPlans();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createPlanForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      interval: new FormControl('monthly', Validators.required),
      features: new FormArray([new FormControl('', Validators.required)]),
      isActive: new FormControl(true),
      isPopular: new FormControl(false),
      maxWallets: new FormControl(1, [Validators.required, Validators.min(-1)]),
      maxConnections: new FormControl(1, [
        Validators.required,
        Validators.min(-1),
      ]),
      priority: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  loadPricingPlans(): void {
    this.adminPricingService
      .getAllPricingPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: plans => {
          this.pricingPlans.set(plans);
        },
        error: error => {
          console.error('Erro ao carregar planos:', error);
          this.notificationService.showError('Erro ao carregar planos');
        },
      });
  }

  openCreatePlanDialog(): void {
    this.editingPlan.set(null);
    this.planForm.reset();
    this.planForm.patchValue({
      isActive: true,
      isPopular: false,
      maxWallets: 1,
      maxConnections: 1,
      priority: 1,
      interval: 'monthly',
      price: 0,
    });

    // Reset features array
    const featuresArray = this.planForm.get('features') as FormArray;
    featuresArray.clear();
    featuresArray.push(new FormControl('', Validators.required));

    this.showPlanForm.set(true);
  }

  editPlan(plan: AdminPricingPlan): void {
    this.editingPlan.set(plan);

    // Populate form
    this.planForm.patchValue({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      interval: plan.interval,
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      maxWallets: plan.maxWallets,
      maxConnections: plan.maxConnections,
      priority: plan.priority,
    });

    // Set features
    const featuresArray = this.planForm.get('features') as FormArray;
    featuresArray.clear();
    plan.features.forEach(feature => {
      featuresArray.push(new FormControl(feature, Validators.required));
    });

    this.showPlanForm.set(true);
  }

  savePlan(): void {
    if (this.planForm.invalid || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);

    const formValue = this.planForm.value;
    const planData = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      currency: 'BRL',
      interval: formValue.interval,
      features: formValue.features.filter((f: string) => f.trim() !== ''),
      isActive: formValue.isActive,
      isPopular: formValue.isPopular,
      maxWallets: formValue.maxWallets,
      maxConnections: formValue.maxConnections,
      priority: formValue.priority,
    };

    const operation = this.editingPlan()
      ? this.adminPricingService.updatePricingPlan({
          id: this.editingPlan()!.id,
          ...planData,
        })
      : this.adminPricingService.createPricingPlan(planData);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showPlanForm.set(false);
        this.editingPlan.set(null);
        this.loadPricingPlans();

        this.notificationService.showSuccess('Plano salvo com sucesso');
      },
      error: error => {
        this.isSaving.set(false);
        console.error('Erro ao salvar plano:', error);
        this.notificationService.showError('Erro ao salvar plano');
      },
    });
  }

  cancelPlanForm(): void {
    this.showPlanForm.set(false);
    this.editingPlan.set(null);
    this.planForm.reset();
  }

  togglePlanStatus(plan: AdminPricingPlan): void {
    this.adminPricingService
      .togglePlanStatus(plan.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadPricingPlans();
          this.notificationService.showSuccess(
            `Plano ${plan.isActive ? 'desativado' : 'ativado'} com sucesso`
          );
        },
        error: error => {
          console.error('Erro ao alterar status do plano:', error);
          this.notificationService.showError('Erro ao alterar status');
        },
      });
  }

  deletePlan(plan: AdminPricingPlan): void {
    if (!confirm(`Tem certeza que deseja excluir o plano "${plan.name}"?`)) {
      return;
    }

    this.adminPricingService
      .deletePricingPlan(plan.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadPricingPlans();
          this.notificationService.showSuccess('Plano excluído com sucesso');
        },
        error: error => {
          console.error('Erro ao excluir plano:', error);
          this.notificationService.showError('Erro ao excluir plano');
        },
      });
  }

  duplicatePlan(plan: AdminPricingPlan): void {
    const duplicatedPlan = {
      ...plan,
      name: `${plan.name} (Cópia)`,
      isPopular: false,
      priority: plan.priority + 1,
    };
    delete (duplicatedPlan as any).id;
    delete (duplicatedPlan as any).createdAt;
    delete (duplicatedPlan as any).updatedAt;

    this.adminPricingService
      .createPricingPlan(duplicatedPlan)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadPricingPlans();
          this.notificationService.showSuccess('Plano duplicado com sucesso');
        },
        error: error => {
          console.error('Erro ao duplicar plano:', error);
          this.notificationService.showError('Erro ao duplicar plano');
        },
      });
  }

  viewPlanDetails(plan: AdminPricingPlan): void {
    this.notificationService.showInfo('Detalhes do Plano');
  }

  // Form helpers
  getFeatureControls(): FormControl[] {
    const featuresArray = this.planForm.get('features') as FormArray;
    return featuresArray.controls as FormControl[];
  }

  addFeature(): void {
    const featuresArray = this.planForm.get('features') as FormArray;
    featuresArray.push(new FormControl('', Validators.required));
  }

  removeFeature(index: number): void {
    const featuresArray = this.planForm.get('features') as FormArray;
    if (featuresArray.length > 1) {
      featuresArray.removeAt(index);
    }
  }

  // Formatting helpers
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getIntervalLabel(interval: string): string {
    const labels: Record<string, string> = {
      monthly: 'mês',
      yearly: 'ano',
      one_time: 'única',
    };
    return labels[interval] || interval;
  }

  getActivePlansCount(): number {
    return this.pricingPlans().filter(plan => plan.isActive).length;
  }

  getPopularPlansCount(): number {
    return this.pricingPlans().filter(plan => plan.isPopular).length;
  }

  getAveragePrice(): string {
    const plans = this.pricingPlans().filter(plan => plan.price > 0);
    if (plans.length === 0) return 'R$ 0,00';

    const total = plans.reduce((sum, plan) => sum + plan.price, 0);
    const average = total / plans.length;
    return this.formatCurrency(average);
  }
}
