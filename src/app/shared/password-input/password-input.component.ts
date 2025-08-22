import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormValidationService } from '../../core/services/form-validation.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-password-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PasswordInputComponent implements OnInit {
  @Input() label: string = 'Senha';
  @Input() placeholder: string = 'Digite sua senha';
  @Input() control!: FormControl;
  @Input() confirmControl?: FormControl; // Campo para comparar com a senha confirmada
  @Input() width: string = '100%'; // Adicionado para controle de largura
  @Input() height: string = 'auto'; // Adicionado para controle de altura
  @Input() isConfirmPassword: boolean = false; // Adicionada para identificar se é o campo de confirmação
  @Input() validateMatch: boolean = false;

  focused = false;
  showPassword = false;

  passwordCriteria = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false, // Novo critério para validar senhas iguais
  };

  get hasError() {
    return this.control?.invalid && this.control?.touched;
  }

  get errorMessage() {
    return this.formValidation.getErrorMessage(this.control);
  }

  constructor(private formValidation: FormValidationService) {}

  ngOnInit() {
    if (this.control) {
      this.control.valueChanges.subscribe(() => {
        this.updatePasswordCriteria();
      });
    }
    if (this.confirmControl) {
      this.confirmControl.valueChanges.subscribe(() => {
        this.updatePasswordMatchCriteria();
      });
    }
  }

  updatePasswordCriteria() {
    const passwordValue = this.control.value;

    if (passwordValue) {
      const validationResults =
        this.formValidation.validatePassword(passwordValue);

      this.passwordCriteria = {
        length: !validationResults?.['minLength'],
        uppercase: !validationResults?.['uppercase'],
        lowercase: !validationResults?.['lowercase'],
        number: !validationResults?.['number'],
        special: !validationResults?.['specialChar'],
        match: this.confirmControl
          ? this.control.value === this.confirmControl.value
          : true, // Verifica se as senhas são iguais
      };
    } else {
      this.passwordCriteria = {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        match: this.confirmControl
          ? this.control.value === this.confirmControl.value
          : true,
      };
    }
  }

  updatePasswordMatchCriteria() {
    if (this.confirmControl && this.control) {
      this.passwordCriteria.match =
        this.control.value === this.confirmControl.value;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
