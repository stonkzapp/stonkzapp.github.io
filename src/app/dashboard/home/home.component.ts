import { Component } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TimeSeriesComponent } from 'src/app/shared/time-series/time-series.component';
import { CardComponent } from 'src/app/shared/card/card.component';
import {
  TimelineComponent,
  TimelineEvent,
} from 'src/app/shared/timeline/timeline.component';
import {
  AllocationDonutComponent,
  AllocationSlice,
} from 'src/app/shared/allocation-donut/allocation-donut.component';
import {
  MonthlyBarsComponent,
  MonthlyPoint,
} from 'src/app/shared/monthly-bars/monthly-bars.component';

interface AssetClass {
  name: string;
  balance: number;
  allocation: number;
  color: string;
}

interface KpiItem {
  label: string;
  value: string | number;
  change?: string;
  icon?: string;
  accent?: 'primary' | 'success' | 'warning' | 'danger';
}

interface PortfolioHistoryItem {
  date: string;
  type: string;
  value: number;
  change: number;
}

interface ProductItem {
  code: string;
  name: string;
  allocation: number;
  performance: number;
}

@Component({
  selector: 'stz-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CardComponent,
    TimeSeriesComponent,
    AllocationDonutComponent,
    MonthlyBarsComponent,
    TimelineComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // KPI Cards originais (para referência)
  kpis: KpiItem[] = [
    {
      label: 'Valor da Carteira',
      value: 'R$ 125.400',
      change: '+2.5%',
      icon: 'savings',
      accent: 'primary',
    },
    {
      label: 'Rentabilidade YTD',
      value: '8,4%',
      change: '+0.3%',
      icon: 'trending_up',
      accent: 'success',
    },
    {
      label: 'Aportes Totais',
      value: 'R$ 30.000',
      change: '0%',
      icon: 'account_balance_wallet',
      accent: 'warning',
    },
    {
      label: 'Proventos 12M',
      value: 'R$ 2.500',
      change: '+1.2%',
      icon: 'payments',
      accent: 'success',
    },
  ];

  // Histórico da carteira
  portfolioHistory: PortfolioHistoryItem[] = [
    { date: '2025-04-15', type: 'Saldo atual', value: 125400, change: 2.5 },
    { date: '2025-04-14', type: 'Compra', value: 122300, change: -1.2 },
    { date: '2025-04-13', type: 'Provento', value: 123800, change: 0.8 },
    { date: '2025-04-12', type: 'Valorização', value: 122900, change: 1.5 },
  ];

  // Produtos
  products: ProductItem[] = [
    { code: 'PETR4', name: 'Petrobras PN', allocation: 15.2, performance: 8.4 },
    { code: 'VALE3', name: 'Vale ON', allocation: 12.8, performance: -2.1 },
    { code: 'ITSA4', name: 'Itaúsa PN', allocation: 10.5, performance: 5.7 },
    { code: 'B3SA3', name: 'B3 ON', allocation: 8.9, performance: 12.3 },
  ];

  // Valores mensais
  monthlyContribution = 2500;
  monthlyDividends = 410;

  series = [
    { date: '2019-05', value: 50000 },
    { date: '2019-06', value: 52000 },
    { date: '2019-07', value: 55000 },
    { date: '2019-08', value: 58000 },
    { date: '2019-09', value: 62000 },
    { date: '2019-10', value: 65000 },
    { date: '2019-11', value: 68000 },
    { date: '2019-12', value: 72000 },
    { date: '2020-01', value: 75000 },
    { date: '2020-02', value: 78000 },
    { date: '2020-03', value: 82000 },
    { date: '2020-04', value: 85000 },
    { date: '2020-05', value: 90000 },
    { date: '2020-06', value: 95000 },
    { date: '2020-07', value: 100000 },
    { date: '2020-08', value: 105000 },
    { date: '2020-09', value: 110000 },
    { date: '2020-10', value: 115000 },
    { date: '2020-11', value: 120000 },
    { date: '2020-12', value: 125000 },
    { date: '2021-01', value: 130000 },
    { date: '2021-02', value: 135000 },
    { date: '2021-03', value: 140000 },
    { date: '2021-04', value: 145000 },
    { date: '2021-05', value: 150000 },
    { date: '2021-06', value: 155000 },
    { date: '2021-07', value: 160000 },
    { date: '2021-08', value: 165000 },
    { date: '2021-09', value: 170000 },
    { date: '2021-10', value: 175000 },
    { date: '2021-11', value: 180000 },
    { date: '2021-12', value: 185000 },
    { date: '2022-01', value: 190000 },
    { date: '2022-02', value: 195000 },
    { date: '2022-03', value: 200000 },
    { date: '2022-04', value: 205000 },
    { date: '2022-05', value: 210000 },
    { date: '2022-06', value: 215000 },
    { date: '2022-07', value: 220000 },
    { date: '2022-08', value: 225000 },
    { date: '2022-09', value: 230000 },
    { date: '2022-10', value: 235000 },
    { date: '2022-11', value: 240000 },
    { date: '2022-12', value: 245000 },
    { date: '2023-01', value: 250000 },
    { date: '2023-02', value: 255000 },
    { date: '2023-03', value: 260000 },
    { date: '2023-04', value: 265000 },
    { date: '2023-05', value: 270000 },
    { date: '2023-06', value: 275000 },
    { date: '2023-07', value: 280000 },
    { date: '2023-08', value: 285000 },
    { date: '2023-09', value: 290000 },
    { date: '2023-10', value: 295000 },
    { date: '2023-11', value: 300000 },
    { date: '2023-12', value: 305000 },
    { date: '2024-01', value: 310000 },
    { date: '2024-02', value: 315000 },
    { date: '2024-03', value: 320000 },
    { date: '2024-04', value: 325000 },
    { date: '2024-05', value: 330000 },
    { date: '2024-06', value: 335000 },
    { date: '2024-07', value: 340000 },
    { date: '2024-08', value: 345000 },
    { date: '2024-09', value: 350000 },
    { date: '2024-10', value: 352000 },
    { date: '2024-11', value: 354000 },
    { date: '2024-12', value: 355000 },
    { date: '2025-01', value: 355600 },
    { date: '2025-02', value: 355600 },
  ];

  benchmark = [
    { date: '2019-05', value: 50000 },
    { date: '2019-06', value: 51000 },
    { date: '2019-07', value: 52000 },
    { date: '2019-08', value: 53000 },
    { date: '2019-09', value: 54000 },
    { date: '2019-10', value: 55000 },
    { date: '2019-11', value: 56000 },
    { date: '2019-12', value: 57000 },
    { date: '2020-01', value: 58000 },
    { date: '2020-02', value: 59000 },
    { date: '2020-03', value: 60000 },
    { date: '2020-04', value: 61000 },
    { date: '2020-05', value: 62000 },
    { date: '2020-06', value: 63000 },
    { date: '2020-07', value: 64000 },
    { date: '2020-08', value: 65000 },
    { date: '2020-09', value: 66000 },
    { date: '2020-10', value: 67000 },
    { date: '2020-11', value: 68000 },
    { date: '2020-12', value: 69000 },
    { date: '2021-01', value: 70000 },
    { date: '2021-02', value: 71000 },
    { date: '2021-03', value: 72000 },
    { date: '2021-04', value: 73000 },
    { date: '2021-05', value: 74000 },
    { date: '2021-06', value: 75000 },
    { date: '2021-07', value: 76000 },
    { date: '2021-08', value: 77000 },
    { date: '2021-09', value: 78000 },
    { date: '2021-10', value: 79000 },
    { date: '2021-11', value: 80000 },
    { date: '2021-12', value: 81000 },
    { date: '2022-01', value: 82000 },
    { date: '2022-02', value: 83000 },
    { date: '2022-03', value: 84000 },
    { date: '2022-04', value: 85000 },
    { date: '2022-05', value: 86000 },
    { date: '2022-06', value: 87000 },
    { date: '2022-07', value: 88000 },
    { date: '2022-08', value: 89000 },
    { date: '2022-09', value: 90000 },
    { date: '2022-10', value: 91000 },
    { date: '2022-11', value: 92000 },
    { date: '2022-12', value: 93000 },
    { date: '2023-01', value: 94000 },
    { date: '2023-02', value: 95000 },
    { date: '2023-03', value: 96000 },
    { date: '2023-04', value: 97000 },
    { date: '2023-05', value: 98000 },
    { date: '2023-06', value: 99000 },
    { date: '2023-07', value: 100000 },
    { date: '2023-08', value: 101000 },
    { date: '2023-09', value: 102000 },
    { date: '2023-10', value: 103000 },
    { date: '2023-11', value: 104000 },
    { date: '2023-12', value: 105000 },
    { date: '2024-01', value: 106000 },
    { date: '2024-02', value: 107000 },
    { date: '2024-03', value: 108000 },
    { date: '2024-04', value: 109000 },
    { date: '2024-05', value: 110000 },
    { date: '2024-06', value: 111000 },
    { date: '2024-07', value: 112000 },
    { date: '2024-08', value: 113000 },
    { date: '2024-09', value: 114000 },
    { date: '2024-10', value: 115000 },
    { date: '2024-11', value: 116000 },
    { date: '2024-12', value: 117000 },
    { date: '2025-01', value: 118000 },
    { date: '2025-02', value: 119000 },
  ];

  allocation: AllocationSlice[] = [
    { label: 'AÇÕES', value: 93961.31, color: '#ec4899' },
    { label: 'FII', value: 79287.79, color: '#3b82f6' },
    { label: 'CRIPTOMOEDA', value: 67662.75, color: '#8b5cf6' },
    { label: 'PREVIDÊNCIA', value: 50300.47, color: '#10b981' },
    { label: 'TESOURO DIRETO', value: 41065.67, color: '#84cc16' },
    { label: 'CONTA CORRENTE', value: 3322.73, color: '#f9a8d4' },
  ];

  assetClasses: AssetClass[] = [
    { name: 'AÇÕES', balance: 93961.31, allocation: 28.0, color: '#ec4899' },
    { name: 'FII', balance: 79287.79, allocation: 23.62, color: '#3b82f6' },
    {
      name: 'CRIPTOMOEDA',
      balance: 67662.75,
      allocation: 20.16,
      color: '#8b5cf6',
    },
    {
      name: 'PREVIDÊNCIA',
      balance: 50300.47,
      allocation: 14.99,
      color: '#10b981',
    },
    {
      name: 'TESOURO DIRETO',
      balance: 41065.67,
      allocation: 12.24,
      color: '#84cc16',
    },
    {
      name: 'CONTA CORRENTE',
      balance: 3322.73,
      allocation: 0.99,
      color: '#f9a8d4',
    },
  ];

  events: TimelineEvent[] = [
    {
      date: '2025-02-15',
      type: 'provento',
      description: 'Dividendos PETR4',
      amount: 320.5,
    },
    {
      date: '2025-02-10',
      type: 'compra',
      description: 'Compra de 10 B3SA3',
      amount: 140.0,
    },
    {
      date: '2025-02-05',
      type: 'venda',
      description: 'Venda de 5 ITSA4',
      amount: 60.0,
    },
    {
      date: '2025-02-01',
      type: 'aporte',
      description: 'Aporte mensal',
      amount: 1500.0,
    },
  ];

  monthlyAportes: MonthlyPoint[] = [
    { month: '2025-01', value: 2000 },
    { month: '2025-02', value: 1500 },
    { month: '2025-03', value: 1800 },
    { month: '2025-04', value: 2500 },
  ];

  monthlyProventos: MonthlyPoint[] = [
    { month: '2025-01', value: 300 },
    { month: '2025-02', value: 260 },
    { month: '2025-03', value: 320 },
    { month: '2025-04', value: 410 },
  ];
}
