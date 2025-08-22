import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  AdminDashboardData,
  UserMetrics,
  FinancialMetrics,
  SystemMetrics,
  SecurityAlert,
  TrendData,
  CountryMetric,
  PlanMetric,
  PlanRevenue,
} from '../models/models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AdminMetricsService extends BaseService {
  constructor() {
    super();
  }

  // Obter dados completos do dashboard
  getDashboardData(): Observable<AdminDashboardData> {
    return this.mockDashboardData().pipe(delay(800));
  }

  // Obter métricas de usuários
  getUserMetrics(): Observable<UserMetrics> {
    return this.mockUserMetrics().pipe(delay(500));
  }

  // Obter métricas financeiras
  getFinancialMetrics(): Observable<FinancialMetrics> {
    return this.mockFinancialMetrics().pipe(delay(500));
  }

  // Obter métricas de sistema
  getSystemMetrics(): Observable<SystemMetrics> {
    return this.mockSystemMetrics().pipe(delay(500));
  }

  // Mock completo do dashboard
  private mockDashboardData(): Observable<AdminDashboardData> {
    const userMetrics = this.generateMockUserMetrics();
    const financialMetrics = this.generateMockFinancialMetrics();
    const systemMetrics = this.generateMockSystemMetrics();

    const dashboardData: AdminDashboardData = {
      userMetrics,
      financialMetrics,
      systemMetrics,
      lastUpdated: new Date(),
    };

    return of(dashboardData);
  }

  // Mock de métricas de usuários
  private mockUserMetrics(): Observable<UserMetrics> {
    return of(this.generateMockUserMetrics());
  }

  private generateMockUserMetrics(): UserMetrics {
    return {
      totalUsers: 12847,
      activeUsers: 8932,
      newUsersToday: 127,
      newUsersThisWeek: 892,
      newUsersThisMonth: 3456,
      proUsers: 2847,
      freeUsers: 10000,
      userGrowthRate: 15.7,
      churnRate: 2.3,
      averageSessionDuration: 24.5,
      usersByCountry: [
        {
          country: 'Brasil',
          countryCode: 'BR',
          userCount: 8932,
          percentage: 69.5,
        },
        {
          country: 'Estados Unidos',
          countryCode: 'US',
          userCount: 1847,
          percentage: 14.4,
        },
        {
          country: 'Portugal',
          countryCode: 'PT',
          userCount: 1284,
          percentage: 10.0,
        },
        {
          country: 'Argentina',
          countryCode: 'AR',
          userCount: 512,
          percentage: 4.0,
        },
        {
          country: 'Outros',
          countryCode: 'XX',
          userCount: 272,
          percentage: 2.1,
        },
      ],
      usersByPlan: [
        {
          planName: 'Gratuito',
          userCount: 10000,
          percentage: 77.8,
          revenue: 0,
        },
        {
          planName: 'Pro Mensal',
          userCount: 1847,
          percentage: 14.4,
          revenue: 55410,
        },
        {
          planName: 'Pro Anual',
          userCount: 1000,
          percentage: 7.8,
          revenue: 240000,
        },
      ],
      userRegistrationTrend: this.generateTrendData(30, 50, 200),
    };
  }

  // Mock de métricas financeiras
  private mockFinancialMetrics(): Observable<FinancialMetrics> {
    return of(this.generateMockFinancialMetrics());
  }

  private generateMockFinancialMetrics(): FinancialMetrics {
    return {
      totalRevenue: 295410.5,
      monthlyRecurringRevenue: 87340.0,
      averageRevenuePerUser: 23.45,
      revenueGrowthRate: 28.7,
      subscriptionRevenue: 285410.5,
      oneTimeRevenue: 10000.0,
      refunds: 2450.0,
      chargeback: 890.0,
      netRevenue: 292070.5,
      revenueByPlan: [
        {
          planId: 'pro-monthly',
          planName: 'Pro Mensal',
          revenue: 55410.0,
          subscriptions: 1847,
          averageValue: 30.0,
        },
        {
          planId: 'pro-yearly',
          planName: 'Pro Anual',
          revenue: 240000.5,
          subscriptions: 1000,
          averageValue: 240.0,
        },
      ],
      revenueTrend: this.generateRevenueTrend(),
      conversionRate: 22.15,
    };
  }

  // Mock de métricas de sistema
  private mockSystemMetrics(): Observable<SystemMetrics> {
    return of(this.generateMockSystemMetrics());
  }

  private generateMockSystemMetrics(): SystemMetrics {
    return {
      serverUptime: 99.98,
      responseTime: 142,
      errorRate: 0.05,
      apiCalls: 1284567,
      activeConnections: 2847,
      databaseSize: 2.8,
      backupStatus: 'success',
      lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      securityAlerts: [
        {
          id: 'alert-001',
          type: 'login_attempt',
          severity: 'medium',
          message: '5 tentativas de login falharam para admin@teste.com',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          resolved: false,
        },
        {
          id: 'alert-002',
          type: 'suspicious_activity',
          severity: 'high',
          message:
            'Padrão de requisições suspeitas detectado do IP 192.168.1.100',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          resolved: true,
        },
        {
          id: 'alert-003',
          type: 'system_error',
          severity: 'low',
          message: 'Timeout temporário na API de cotações',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          resolved: true,
        },
      ],
    };
  }

  // Utilitários para gerar dados mock
  private generateTrendData(
    days: number,
    minValue: number,
    maxValue: number
  ): TrendData[] {
    const data: TrendData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const value = Math.floor(
        Math.random() * (maxValue - minValue) + minValue
      );

      data.push({
        date: date.toISOString().split('T')[0],
        value,
        label: date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
      });
    }

    return data;
  }

  private generateRevenueTrend(): TrendData[] {
    const data: TrendData[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);

      const baseValue = 15000 + (11 - i) * 2000; // Crescimento simulado
      const variation = Math.random() * 5000 - 2500; // Variação aleatória
      const value = Math.max(0, baseValue + variation);

      data.push({
        date: date.toISOString().substring(0, 7), // YYYY-MM
        value: Math.round(value * 100) / 100,
        label: date.toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
        }),
      });
    }

    return data;
  }

  // Métodos para obter dados específicos em tempo real
  getRealTimeMetrics(): Observable<any> {
    return of({
      activeUsers: Math.floor(Math.random() * 100) + 2800,
      apiCallsPerMinute: Math.floor(Math.random() * 50) + 200,
      serverCpuUsage: Math.random() * 30 + 20,
      serverMemoryUsage: Math.random() * 40 + 30,
      timestamp: new Date(),
    }).pipe(delay(100));
  }

  // Exportar dados para relatórios
  exportMetrics(
    startDate: Date,
    endDate: Date,
    format: 'csv' | 'excel' | 'pdf'
  ): Observable<Blob> {
    // Mock de exportação
    const mockData = `Data,Usuários,Receita,Conversão\n${startDate.toISOString()},1000,25000,22.5\n${endDate.toISOString()},1200,30000,24.1`;
    const blob = new Blob([mockData], { type: 'text/csv' });

    return of(blob).pipe(delay(1000));
  }

  // Obter alertas de segurança não resolvidos
  getUnresolvedSecurityAlerts(): Observable<SecurityAlert[]> {
    return of(
      this.generateMockSystemMetrics().securityAlerts.filter(
        alert => !alert.resolved
      )
    );
  }

  // Resolver alerta de segurança
  resolveSecurityAlert(alertId: string): Observable<boolean> {
    // Mock de resolução
    return of(true).pipe(delay(500));
  }
}
