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

export interface AllocationSlice {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'stz-allocation-donut',
  standalone: true,
  imports: [],
  template: `<div
    #chart
    class="w-full"
    [style.height]="height || '300px'"></div>`,
})
export class AllocationDonutComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() data: AllocationSlice[] = [];
  @Input() height?: string;
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
        colors: this.resolveColors(),
      } as any,
      false,
      true
    );
  }

  private buildOptions(): Record<string, unknown> {
    const labels = this.data.map(d => d.label);
    const series = this.data.map(d => d.value);
    const colors = this.resolveColors();
    const isDark = this.themeService.isDarkModeEnabled();

    return {
      chart: { type: 'donut', height: 300 },
      labels,
      series,
      colors,
      legend: { position: 'bottom' },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(0)}%`,
      },
      tooltip: {
        y: {
          formatter: (val: number) =>
            new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(val),
        },
      },
      theme: { mode: isDark ? 'dark' : 'light' },
    };
  }

  private resolveColors(): string[] {
    // Prioriza cores individuais fornecidas; caso contrário deriva do tema
    const provided = this.data.map(d => d.color).filter(Boolean) as string[];
    if (provided.length === this.data.length && provided.length > 0)
      return provided;
    const styles = getComputedStyle(document.body);
    const primary =
      styles.getPropertyValue('--primary-color').trim() || '#2563eb';
    const secondary =
      styles.getPropertyValue('--secondary-color').trim() || '#10b981';
    const palette = [
      primary,
      secondary,
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#14b8a6',
    ];
    return this.data.map((_, i) => palette[i % palette.length]);
  }
}
