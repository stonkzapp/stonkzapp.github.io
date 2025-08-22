import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Importando MatIconModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button'; // Importando MatButtonModule

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ], // Incluindo MatIconModule e MatButtonModule
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() iconLeft: string | null = null; // Ícone à esquerda
  @Input() iconRight: string | null = null; // Ícone à direita
  @Input() color: 'primary' | 'secondary' | 'danger' = 'primary'; // Cor do botão
  @Input() disabled: boolean = false; // Botão desabilitado
  @Input() loading: boolean = false; // Indicador de carregamento
  @Input() width: string = '100%'; // Largura do botão
  @Input() height: string = '50px'; // Altura do botão

  get isDisabled() {
    return this.disabled || this.loading; // Desabilita o botão se estiver desabilitado ou carregando
  }

  // Função para aplicar a cor do botão de acordo com o valor
  get colorClass() {
    return this.color; // Retorna 'primary', 'secondary' ou 'danger'
  }
}
