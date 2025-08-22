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
import { COMMON_ERRORS } from 'src/app/shared/common-errors';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { InputComponent } from 'src/app/shared/input/input.component';
import { ScreenService } from '../../core/services/screen.service';
import { TempStorageService } from '../../core/services/temp-storage.service';
import { ForgotPasswordRequest } from '../../core/models/models';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ForgotPasswordComponent implements OnInit {
  isLoading = signal(false);
  isMobile: boolean = false;
  forgotPasswordForm: any;

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private notificationService: NotificationService,
    public formValidation: FormValidationService,
    private screenService: ScreenService,
    private tempStorageService: TempStorageService
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.pattern(this.formValidation.patterns.email),
      ]),
    });
  }

  ngOnInit(): void {
    this.screenService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  onForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading.set(true);

    const forgotPasswordRequest: ForgotPasswordRequest = {
      email: this.forgotPasswordForm.value.email,
    };

    this.passwordService
      .forgotPassword(forgotPasswordRequest)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.tempStorageService.setEmail(this.forgotPasswordForm.value.email);
          this.notificationService.showSuccess(
            'E-mail enviado! Verifique sua caixa de entrada.'
          );
          this.router.navigate(['/auth/reset-password']);
        },
        error: error => {
          const errorCode = error?.error?.code || error?.error?.field || '500';
          const errorMessage = COMMON_ERRORS[errorCode] || 'Erro desconhecido.';

          this.notificationService.showError(errorMessage);
        },
      });
  }

  onLogin(): void {
    this.router.navigate(['auth/login']);
  }
}
