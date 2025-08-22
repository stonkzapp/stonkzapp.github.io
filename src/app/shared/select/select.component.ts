import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormValidationService } from '../../core/services/form-validation.service';

@Component({
  selector: 'app-select',
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  @Input() label: string = 'Seleção';
  @Input() control!: FormControl;
  @Input() options = signal<{ value: string; label: string }[]>([]);
  @Input() width: string = '100%'; // Adicionado para controle de largura
  @Input() height: string = 'auto'; // Adicionado para controle de altura

  // Verifica se há erro no controle (campo inválido e tocado)
  get hasError() {
    return this.control?.invalid && this.control?.touched;
  }

  // Obtém a mensagem de erro do serviço de validação
  get errorMessage() {
    return this.formValidation.getErrorMessage(this.control);
  }

  constructor(private formValidation: FormValidationService) {}
}
