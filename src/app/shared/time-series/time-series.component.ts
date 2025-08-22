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

@Component({
  selector: 'stz-time-series',
  standalone: true,
  imports: [],
  template: `<div
    #chart
    class="w-full"
    [style.height]="height || '320px'"></div>`,
})
export class TimeSeriesComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() series: { date: string; value: number }[] = [];
  @Input() benchmark?: { date: string; value: number }[];
  @Input() height?: string;

  @ViewChild('chart', { static: true }) chartEl!: ElementRef<HTMLDivElement>;

  private chart?: ApexCharts;
  private themeService = inject(ThemeService);
  private themeSub = this.themeService.darkModeChanges$.subscribe(() =>
    this.updateTheme()
  );

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.chart) return;

    const options = this.buildOptions();
    if (changes['series'] || changes['benchmark']) {
      this.chart.updateOptions(options as any, false, true);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.themeSub.unsubscribe();
  }

  private renderChart(): void {
    const options = this.buildOptions();
    this.chart = new ApexCharts(this.chartEl.nativeElement, options as any);
    this.chart.render();
  }

  private updateTheme(): void {
    if (!this.chart) return;
    const isDark = this.themeService.isDarkModeEnabled();
    this.chart.updateOptions(
      {
        theme: { mode: isDark ? 'dark' : 'light' },
        colors: this.resolveColors(),
      } as any,
      false,
      true
    );
  }

  private buildOptions(): Record<string, unknown> {
    const portfolioSeries = (this.series ?? []).map(p => ({
      x: this.parseDate(p.date),
      y: p.value,
    }));
    const benchmarkSeries = (this.benchmark ?? []).map(p => ({
      x: this.parseDate(p.date),
      y: p.value,
    }));

    const series = [
      { name: 'Carteira', data: portfolioSeries },
      ...(benchmarkSeries.length
        ? [{ name: 'Benchmark', data: benchmarkSeries }]
        : []),
    ];

    const isDark = this.themeService.isDarkModeEnabled();

    return {
      chart: {
        type: 'area',
        height: 300,
        toolbar: {
          show: true,
          tools: { download: true, zoom: true, pan: true, reset: true },
        },
        animations: { enabled: true },
      },
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      grid: { strokeDashArray: 3 },
      colors: this.resolveColors(),
      series,
      xaxis: { type: 'datetime', labels: { datetimeUTC: false } },
      yaxis: {
        labels: {
          formatter: (val: number) => this.formatCurrency(val),
        },
      },
      tooltip: {
        x: { format: 'dd MMM yyyy' },
        y: {
          formatter: (val: number) => this.formatCurrency(val),
        },
      },
      legend: { position: 'top' },
      theme: { mode: isDark ? 'dark' : 'light' },
    };
  }

  private resolveColors(): string[] {
    const styles = getComputedStyle(document.body);
    const primary =
      styles.getPropertyValue('--primary-color').trim() || '#2563eb';
    const secondary =
      styles.getPropertyValue('--secondary-color').trim() || '#10b981';
    return [primary, secondary];
  }

  private parseDate(dateStr: string): Date {
    const normalized = /\d{4}-\d{2}$/.test(dateStr) ? `${dateStr}-01` : dateStr;
    return new Date(normalized);
  }

  private formatCurrency(value: number): string {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `R$ ${value.toFixed(0)}`;
    }
  }
}
