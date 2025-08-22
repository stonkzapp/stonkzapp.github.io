import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { ChangePasswordRequest } from '../../core/models/models';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputComponent } from '../../shared/input/input.component';
import { FormValidationService } from '../../core/services/form-validation.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'stz-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    ButtonComponent,
    InputComponent,
    MatButtonModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private formValidation: FormValidationService
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: this.formValidation.createFormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        newPassword: this.formValidation.createFormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: this.formValidation.createFormControl('', [
          Validators.required,
        ]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Form já é inicializado no constructor
  }

  private passwordMatchValidator(
    form: FormGroup
  ): { [key: string]: any } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }

  get currentPasswordControl(): FormControl {
    return this.passwordForm.get('currentPassword') as FormControl;
  }

  get newPasswordControl(): FormControl {
    return this.passwordForm.get('newPassword') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.passwordForm.get('confirmPassword') as FormControl;
  }

  getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
  } {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return { score, label: 'Muito Fraca', color: '#ff4444' };
      case 2:
        return { score, label: 'Fraca', color: '#ff8800' };
      case 3:
        return { score, label: 'Média', color: '#ffaa00' };
      case 4:
        return { score, label: 'Forte', color: '#00aa00' };
      case 5:
        return { score, label: 'Muito Forte', color: '#008800' };
      default:
        return { score: 0, label: 'Muito Fraca', color: '#ff4444' };
    }
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isSaving = true;

      const formValue = this.passwordForm.value;

      const changePasswordData: ChangePasswordRequest = {
        currentPassword: formValue.currentPassword,
        newPassword: formValue.newPassword,
      };

      // Usar o serviço para alterar a senha
      this.userService.changePassword(changePasswordData).subscribe({
        next: () => {
          console.log('Senha alterada com sucesso!');
          this.isSaving = false;

          // Aqui você pode mostrar uma mensagem de sucesso
          // e redirecionar para o perfil
          setTimeout(() => {
            this.router.navigate(['/dashboard/profile']);
          }, 1500);
        },
        error: (error: any) => {
          console.error('Erro ao alterar senha:', error);
          this.isSaving = false;
          // Aqui você pode mostrar uma mensagem de erro
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.passwordForm.controls).forEach(key => {
      const control = this.passwordForm.get(key);
      control?.markAsTouched();
    });
  }

  getPasswordMismatchError(): string {
    if (this.passwordForm.hasError('passwordMismatch')) {
      return 'As senhas não coincidem';
    }
    return '';
  }
}
