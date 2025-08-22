import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormValidationService } from '../../core/services/form-validation.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input',
  standalone: true,
  providers: [provideNgxMask()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgxMaskDirective,
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'password' | 'email' = 'text';
  @Input() control: FormControl = new FormControl('');
  @Input() iconRight: string | null = null;
  @Input() mask: string | null = null;
  @Input() width: string = '100%'; // Adicionado para controle de largura
  @Input() height: string = 'auto'; // Adicionado para controle de altura
  focused = false;
  isPasswordVisible = false; // Variável para controlar a visibilidade da senha

  // Verifica se o campo tem erro
  get hasError() {
    return this.control?.invalid && this.control?.touched;
  }

  // Retorna a mensagem de erro
  get errorMessage() {
    return this.formValidation.getErrorMessage(this.control);
  }

  constructor(public formValidation: FormValidationService) {}

  // Alterna a visibilidade da senha
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
