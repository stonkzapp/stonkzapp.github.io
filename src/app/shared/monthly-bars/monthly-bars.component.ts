import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import ApexCharts from 'apexcharts';
import { ThemeService } from '../../core/services/theme.service';
import { CardComponent } from '../card/card.component';

export interface MonthlyPoint {
  month: string; // 'YYYY-MM'
  value: number;
}

@Component({
  selector: 'stz-monthly-bars',
  standalone: true,
  imports: [CardComponent],
  template: `
    <stz-card [title]="title">
      <div #chart class="h-64 w-full"></div>
    </stz-card>
  `,
})
export class MonthlyBarsComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() title: string = 'Mensal';
  @Input() data: MonthlyPoint[] = [];
  @Input() color?: string;

  @ViewChild('chart', { static: true }) chartEl!: ElementRef<HTMLDivElement>;
  private chart?: ApexCharts;
  private themeService = inject(ThemeService);
  private themeSub = this.themeService.darkModeChanges$.subscribe(() =>
    this.updateTheme()
  );

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.chart) return;
    this.chart.updateOptions(this.buildOptions() as any, false, true);
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.themeSub.unsubscribe();
  }

  private render(): void {
    this.chart = new ApexCharts(
      this.chartEl.nativeElement,
      this.buildOptions() as any
    );
    this.chart.render();
  }

  private updateTheme(): void {
    if (!this.chart) return;
    const isDark = this.themeService.isDarkModeEnabled();
    this.chart.updateOptions(
      {
        theme: { mode: isDark ? 'dark' : 'light' },
        colors: [this.resolveColor()],
      } as any,
      false,
      true
    );
  }

  private buildOptions(): Record<string, unknown> {
    const categories = this.data.map(d => this.formatMonth(d.month));
    const series = [{ name: this.title, data: this.data.map(d => d.value) }];
    const isDark = this.themeService.isDarkModeEnabled();
    return {
      chart: { type: 'bar', height: 300, animations: { enabled: true } },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 4 } },
      colors: [this.resolveColor()],
      dataLabels: { enabled: false },
      grid: { strokeDashArray: 3 },
      series,
      xaxis: { categories },
      yaxis: { labels: { formatter: (v: number) => this.formatCurrency(v) } },
      tooltip: { y: { formatter: (v: number) => this.formatCurrency(v) } },
      legend: { show: false },
      theme: { mode: isDark ? 'dark' : 'light' },
    };
  }

  private resolveColor(): string {
    if (this.color) return this.color;
    const styles = getComputedStyle(document.body);
    return styles.getPropertyValue('--primary-color').trim() || '#2563eb';
  }

  private formatMonth(month: string): string {
    const d = new Date(/\d{4}-\d{2}$/.test(month) ? `${month}-01` : month);
    return new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(d);
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
