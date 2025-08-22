import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FormValidationService } from '../../core/services/form-validation.service';
import { NotificationService } from '../../core/services/notification.service';
import { PasswordService } from '../../core/services/password.service';
import { ScreenService } from '../../core/services/screen.service';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { COMMON_ERRORS } from 'src/app/shared/common-errors';
import { PasswordInputComponent } from '../../shared/password-input/password-input.component';
import { ResetPasswordRequest } from '../../core/models/models';
import { TempStorageService } from '../../core/services/temp-storage.service';
import { InputComponent } from '../../shared/input/input.component';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    PasswordInputComponent,
    InputComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ResetPasswordComponent implements OnInit {
  isLoading = signal(false);
  isMobile: boolean = false;
  resetPasswordForm: any;

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private notificationService: NotificationService,
    public formValidation: FormValidationService,
    private screenService: ScreenService,
    private tempStorageService: TempStorageService
  ) {
    this.resetPasswordForm = new FormGroup({
      newPassword: this.formValidation.createFormControl('', [
        Validators.required,
        this.formValidation.passwordValidator(),
      ]),
      token: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.pattern(this.formValidation.patterns.confirmationCode),
      ]),
    });
  }
  ngOnInit(): void {
    this.screenService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.invalid) return;

    this.isLoading.set(true);

    const email = this.tempStorageService.getEmail() as string;

    const resetPasswordRequest: ResetPasswordRequest = {
      token: Number(this.resetPasswordForm.value.token),
      email: email,
      password: this.resetPasswordForm.value.newPassword,
    };

    this.passwordService
      .resetPassword(resetPasswordRequest)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Senha redefinida com sucesso! Faça login novamente.'
          );
          this.router.navigate(['/auth/login']);
        },
        error: error => {
          const errorCode = error?.error?.code || error?.error?.field || '500';
          const errorMessage = COMMON_ERRORS[errorCode] || 'Erro desconhecido.';

          this.notificationService.showError(errorMessage);
        },
      });
  }
}
