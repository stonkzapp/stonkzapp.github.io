import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, interval } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

// Services
import { AdminMetricsService } from '../../core/services/admin-metrics.service';
import { NotificationService } from '../../core/services/notification.service';

// Models
import {
  AdminDashboardData,
  UserMetrics,
  FinancialMetrics,
  SystemMetrics,
  SecurityAlert,
} from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatTabsModule,
  ],
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Dashboard Administrativo</h1>
          <p class="header-subtitle">Visão geral do sistema Stonkz</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="refreshData()">
            <mat-icon>refresh</mat-icon>
            Atualizar
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="loading-container">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p>Carregando métricas...</p>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!isLoading() && dashboardData()" class="dashboard-content">
        <!-- Key Metrics Cards -->
        <div class="metrics-grid">
          <!-- Users Card -->
          <mat-card class="metric-card users-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>people</mat-icon>
              <mat-card-title>Usuários</mat-card-title>
              <mat-card-subtitle>Gestão de usuários</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-value">
                {{ formatNumber(getUserMetrics()?.totalUsers) }}
              </div>
              <div class="metric-label">Total de usuários</div>
              <div class="metric-details">
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatNumber(getUserMetrics()?.activeUsers)
                  }}</span>
                  <span class="detail-label">Ativos</span>
                </div>
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatNumber(getUserMetrics()?.newUsersToday)
                  }}</span>
                  <span class="detail-label">Hoje</span>
                </div>
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatPercentage(getUserMetrics()?.userGrowthRate)
                  }}</span>
                  <span class="detail-label">Crescimento</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Revenue Card -->
          <mat-card class="metric-card revenue-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>attach_money</mat-icon>
              <mat-card-title>Receita</mat-card-title>
              <mat-card-subtitle>Métricas financeiras</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-value">
                {{ formatCurrency(getFinancialMetrics()?.totalRevenue) }}
              </div>
              <div class="metric-label">Receita total</div>
              <div class="metric-details">
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatCurrency(
                      getFinancialMetrics()?.monthlyRecurringRevenue
                    )
                  }}</span>
                  <span class="detail-label">MRR</span>
                </div>
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatCurrency(getFinancialMetrics()?.averageRevenuePerUser)
                  }}</span>
                  <span class="detail-label">ARPU</span>
                </div>
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatPercentage(getFinancialMetrics()?.revenueGrowthRate)
                  }}</span>
                  <span class="detail-label">Crescimento</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- System Health Card -->
          <mat-card class="metric-card system-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>computer</mat-icon>
              <mat-card-title>Sistema</mat-card-title>
              <mat-card-subtitle>Saúde do sistema</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-value">
                {{ formatPercentage(getSystemMetrics()?.serverUptime) }}
              </div>
              <div class="metric-label">Uptime</div>
              <div class="metric-details">
                <div class="detail-item">
                  <span class="detail-value"
                    >{{ getSystemMetrics()?.responseTime || 0 }}ms</span
                  >
                  <span class="detail-label">Resposta</span>
                </div>
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatNumber(getSystemMetrics()?.apiCalls)
                  }}</span>
                  <span class="detail-label">API Calls</span>
                </div>
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatPercentage(getSystemMetrics()?.errorRate)
                  }}</span>
                  <span class="detail-label">Erro</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Conversions Card -->
          <mat-card class="metric-card conversion-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>trending_up</mat-icon>
              <mat-card-title>Conversão</mat-card-title>
              <mat-card-subtitle>Taxa de conversão</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-value">
                {{ formatPercentage(getFinancialMetrics()?.conversionRate) }}
              </div>
              <div class="metric-label">Taxa de conversão</div>
              <div class="metric-details">
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatNumber(getUserMetrics()?.proUsers)
                  }}</span>
                  <span class="detail-label">Usuários Pro</span>
                </div>
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatNumber(getUserMetrics()?.freeUsers)
                  }}</span>
                  <span class="detail-label">Usuários Free</span>
                </div>
                <div class="detail-item">
                  <span class="detail-value">{{
                    formatPercentage(getUserMetrics()?.churnRate)
                  }}</span>
                  <span class="detail-label">Churn</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Detailed Analytics -->
        <mat-tab-group class="analytics-tabs" animationDuration="300ms">
          <!-- Users Tab -->
          <mat-tab label="Usuários">
            <div class="tab-content">
              <div class="analytics-grid">
                <!-- Users by Country -->
                <mat-card class="analytics-card">
                  <mat-card-header>
                    <mat-card-title>Usuários por País</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="country-list">
                      <div
                        *ngFor="
                          let country of getUserMetrics()?.usersByCountry || []
                        "
                        class="country-item">
                        <div class="country-info">
                          <span class="country-flag">{{
                            getCountryFlag(country.countryCode)
                          }}</span>
                          <span class="country-name">{{
                            country.country
                          }}</span>
                        </div>
                        <div class="country-stats">
                          <span class="country-count">{{
                            formatNumber(country.userCount)
                          }}</span>
                          <span class="country-percentage"
                            >{{ country.percentage }}%</span
                          >
                        </div>
                        <div class="country-bar">
                          <div
                            class="bar-fill"
                            [style.width.%]="country.percentage"></div>
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Users by Plan -->
                <mat-card class="analytics-card">
                  <mat-card-header>
                    <mat-card-title>Usuários por Plano</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="plan-list">
                      <div
                        *ngFor="let plan of getUserMetrics()?.usersByPlan || []"
                        class="plan-item">
                        <div class="plan-info">
                          <span class="plan-name">{{ plan.planName }}</span>
                          <span class="plan-revenue">{{
                            formatCurrency(plan.revenue)
                          }}</span>
                        </div>
                        <div class="plan-stats">
                          <span class="plan-count">{{
                            formatNumber(plan.userCount)
                          }}</span>
                          <span class="plan-percentage"
                            >{{ plan.percentage }}%</span
                          >
                        </div>
                        <div class="plan-bar">
                          <div
                            class="bar-fill"
                            [style.width.%]="plan.percentage"></div>
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- Financial Tab -->
          <mat-tab label="Financeiro">
            <div class="tab-content">
              <div class="analytics-grid">
                <!-- Revenue by Plan -->
                <mat-card class="analytics-card">
                  <mat-card-header>
                    <mat-card-title>Receita por Plano</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="revenue-list">
                      <div
                        *ngFor="
                          let planRevenue of getFinancialMetrics()
                            ?.revenueByPlan || []
                        "
                        class="revenue-item">
                        <div class="revenue-info">
                          <span class="revenue-plan">{{
                            planRevenue.planName
                          }}</span>
                          <span class="revenue-subs"
                            >{{
                              formatNumber(planRevenue.subscriptions)
                            }}
                            assinaturas</span
                          >
                        </div>
                        <div class="revenue-amount">
                          <span class="revenue-value">{{
                            formatCurrency(planRevenue.revenue)
                          }}</span>
                          <span class="revenue-avg"
                            >Média:
                            {{ formatCurrency(planRevenue.averageValue) }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Financial Summary -->
                <mat-card class="analytics-card">
                  <mat-card-header>
                    <mat-card-title>Resumo Financeiro</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="financial-summary">
                      <div class="summary-item">
                        <span class="summary-label"
                          >Receita de Assinaturas</span
                        >
                        <span class="summary-value">{{
                          formatCurrency(
                            getFinancialMetrics()?.subscriptionRevenue
                          )
                        }}</span>
                      </div>
                      <div class="summary-item">
                        <span class="summary-label">Receita Única</span>
                        <span class="summary-value">{{
                          formatCurrency(getFinancialMetrics()?.oneTimeRevenue)
                        }}</span>
                      </div>
                      <div class="summary-item">
                        <span class="summary-label">Reembolsos</span>
                        <span class="summary-value negative"
                          >-{{
                            formatCurrency(getFinancialMetrics()?.refunds)
                          }}</span
                        >
                      </div>
                      <div class="summary-item">
                        <span class="summary-label">Chargebacks</span>
                        <span class="summary-value negative"
                          >-{{
                            formatCurrency(getFinancialMetrics()?.chargeback)
                          }}</span
                        >
                      </div>
                      <mat-divider></mat-divider>
                      <div class="summary-item total">
                        <span class="summary-label">Receita Líquida</span>
                        <span class="summary-value">{{
                          formatCurrency(getFinancialMetrics()?.netRevenue)
                        }}</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>

          <!-- System Tab -->
          <mat-tab label="Sistema">
            <div class="tab-content">
              <div class="analytics-grid">
                <!-- System Status -->
                <mat-card class="analytics-card">
                  <mat-card-header>
                    <mat-card-title>Status do Sistema</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="system-status">
                      <div class="status-item">
                        <mat-icon class="status-icon healthy"
                          >check_circle</mat-icon
                        >
                        <div class="status-info">
                          <span class="status-label">Servidor</span>
                          <span class="status-value"
                            >{{
                              formatPercentage(getSystemMetrics()?.serverUptime)
                            }}
                            Uptime</span
                          >
                        </div>
                      </div>
                      <div class="status-item">
                        <mat-icon
                          class="status-icon"
                          [class.healthy]="
                            (getSystemMetrics()?.responseTime || 0) < 200
                          "
                          [class.warning]="
                            (getSystemMetrics()?.responseTime || 0) >= 200 &&
                            (getSystemMetrics()?.responseTime || 0) < 500
                          "
                          [class.critical]="
                            (getSystemMetrics()?.responseTime || 0) >= 500
                          "
                          >speed</mat-icon
                        >
                        <div class="status-info">
                          <span class="status-label">Tempo de Resposta</span>
                          <span class="status-value"
                            >{{ getSystemMetrics()?.responseTime || 0 }}ms</span
                          >
                        </div>
                      </div>
                      <div class="status-item">
                        <mat-icon
                          class="status-icon"
                          [class.healthy]="
                            (getSystemMetrics()?.errorRate || 0) < 1
                          "
                          [class.warning]="
                            (getSystemMetrics()?.errorRate || 0) >= 1 &&
                            (getSystemMetrics()?.errorRate || 0) < 5
                          "
                          [class.critical]="
                            (getSystemMetrics()?.errorRate || 0) >= 5
                          "
                          >error_outline</mat-icon
                        >
                        <div class="status-info">
                          <span class="status-label">Taxa de Erro</span>
                          <span class="status-value">{{
                            formatPercentage(getSystemMetrics()?.errorRate)
                          }}</span>
                        </div>
                      </div>
                      <div class="status-item">
                        <mat-icon class="status-icon healthy">storage</mat-icon>
                        <div class="status-info">
                          <span class="status-label">Banco de Dados</span>
                          <span class="status-value"
                            >{{ getSystemMetrics()?.databaseSize || 0 }}GB</span
                          >
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>

                <!-- Security Alerts -->
                <mat-card class="analytics-card">
                  <mat-card-header>
                    <mat-card-title>Alertas de Segurança</mat-card-title>
                    <mat-card-subtitle
                      >{{ getUnresolvedAlertsCount() }} não
                      resolvidos</mat-card-subtitle
                    >
                  </mat-card-header>
                  <mat-card-content>
                    <div class="security-alerts">
                      <div
                        *ngFor="let alert of getRecentAlerts()"
                        class="alert-item"
                        [class]="alert.severity">
                        <mat-icon class="alert-icon">{{
                          getAlertIcon(alert.type)
                        }}</mat-icon>
                        <div class="alert-info">
                          <span class="alert-message">{{ alert.message }}</span>
                          <span class="alert-time">{{
                            formatTime(alert.timestamp)
                          }}</span>
                        </div>
                        <mat-chip [class]="alert.severity">{{
                          alert.severity
                        }}</mat-chip>
                        <mat-chip *ngIf="alert.resolved" class="resolved"
                          >Resolvido</mat-chip
                        >
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>

        <!-- Last Updated -->
        <div class="last-updated">
          <mat-icon>schedule</mat-icon>
          <span
            >Última atualização:
            {{ formatDateTime(dashboardData()?.lastUpdated) }}</span
          >
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = signal(false);
  dashboardData = signal<AdminDashboardData | null>(null);

  constructor(
    private adminMetricsService: AdminMetricsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();

    // Auto-refresh a cada 5 minutos
    interval(5 * 60 * 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadDashboardData(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(showLoading = true): void {
    if (showLoading) {
      this.isLoading.set(true);
    }

    this.adminMetricsService
      .getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.dashboardData.set(data);
          this.isLoading.set(false);
        },
        error: error => {
          console.error('Erro ao carregar dados do dashboard:', error);
          this.isLoading.set(false);
          this.notificationService.showError('Erro ao carregar dados');
        },
      });
  }

  refreshData(): void {
    this.loadDashboardData(true);
    this.notificationService.showSuccess('Dados atualizados com sucesso');
  }

  // Métodos auxiliares para formatação
  formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) return '0';
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  formatPercentage(value: number | undefined): string {
    if (value === undefined || value === null) return '0%';
    return `${value.toFixed(1)}%`;
  }

  formatDateTime(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  formatTime(date: Date | undefined): string {
    if (!date) return 'N/A';
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins} min atrás`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h atrás`;
    } else {
      return `${Math.floor(diffMins / 1440)}d atrás`;
    }
  }

  getCountryFlag(countryCode: string): string {
    const flags: Record<string, string> = {
      BR: '🇧🇷',
      US: '🇺🇸',
      PT: '🇵🇹',
      AR: '🇦🇷',
      XX: '🌍',
    };
    return flags[countryCode] || '🌍';
  }

  getRecentAlerts(): SecurityAlert[] {
    return this.dashboardData()?.systemMetrics.securityAlerts.slice(0, 5) || [];
  }

  getUnresolvedAlertsCount(): number {
    return (
      this.dashboardData()?.systemMetrics.securityAlerts.filter(
        alert => !alert.resolved
      ).length || 0
    );
  }

  getAlertIcon(type: string): string {
    const icons: Record<string, string> = {
      login_attempt: 'login',
      data_breach: 'security',
      suspicious_activity: 'warning',
      system_error: 'error',
    };
    return icons[type] || 'info';
  }

  // Verificações de segurança para dados do dashboard
  getDashboardData(): AdminDashboardData | null {
    return this.dashboardData();
  }

  getUserMetrics() {
    return this.getDashboardData()?.userMetrics;
  }

  getFinancialMetrics() {
    return this.getDashboardData()?.financialMetrics;
  }

  getSystemMetrics() {
    return this.getDashboardData()?.systemMetrics;
  }
}
