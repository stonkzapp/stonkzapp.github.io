import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PasswordService } from '../../core/services/password.service';
import { NotificationService } from '../../core/services/notification.service';
import { FormValidationService } from '../../core/services/form-validation.service';
import { COMMON_ERRORS } from '../../shared/common-errors';
import { ButtonComponent } from '../../shared/button/button.component';
import { CHANGE_PASSWORD_ERRORS } from './change-password.errors';
import { ScreenService } from '../../core/services/screen.service';
import { PasswordInputComponent } from '../../shared/password-input/password-input.component';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, ButtonComponent, PasswordInputComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ChangePasswordComponent implements OnInit {
  isLoading = signal(false);
  isMobile: boolean = false;
  changePasswordForm: any;

  get isSubmitDisabled(): boolean {
    const { newPassword, confirmPassword } = this.changePasswordForm.controls;
    return (
      this.changePasswordForm.invalid ||
      newPassword.value !== confirmPassword.value
    );
  }

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private notificationService: NotificationService,
    public formValidation: FormValidationService,
    private screenService: ScreenService
  ) {
    this.changePasswordForm = new FormGroup({
      currentPassword: this.formValidation.createFormControl('', [
        Validators.required,
      ]),
      newPassword: this.formValidation.createFormControl('', [
        Validators.required,
        this.formValidation.passwordValidator(),
      ]),
    });
  }

  ngOnInit(): void {
    this.changePasswordForm.setValidators(
      this.formValidation.passwordsMatchValidator
    );
    this.screenService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) return;

    this.isLoading.set(true);

    this.passwordService
      .changePassword(this.changePasswordForm.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Senha alterada com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: error => {
          const errorCode = error?.error?.code || error?.error?.field || '500';
          const errorMessage =
            CHANGE_PASSWORD_ERRORS[errorCode] ||
            COMMON_ERRORS[errorCode] ||
            'Erro desconhecido.';

          this.notificationService.showError(errorMessage);
        },
      });
  }
}
