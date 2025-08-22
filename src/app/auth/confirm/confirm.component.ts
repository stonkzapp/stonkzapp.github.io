import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { finalize } from 'rxjs';
import { RegistrationService } from '../../core/services/registration.service';
import { TempStorageService } from '../../core/services/temp-storage.service';
import { InputComponent } from 'src/app/shared/input/input.component';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { FormValidationService } from '../../core/services/form-validation.service';
import { CONFIRMATION_ERRORS } from './confirmation-errors';
import { COMMON_ERRORS } from '../../shared/common-errors';
import { RESEND_CONFIRMATION_ERRORS } from './resend-confirmation-errors';
import { OTPRequest } from '../../core/models/models';
import { ScreenService } from '../../core/services/screen.service';

@Component({
  selector: 'app-confirm',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ConfirmComponent implements OnInit {
  isLoading = signal(false);
  isMobile: boolean = false;
  confirmForm: any;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private notificationService: NotificationService,
    private tempStorageService: TempStorageService,
    public formValidation: FormValidationService,
    private screenService: ScreenService
  ) {
    this.confirmForm = new FormGroup({
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

  onConfirm(): void {
    if (this.confirmForm.invalid) return;

    this.isLoading.set(true);

    const { token } = this.confirmForm.value;

    const OTPRequest: OTPRequest = {
      token: Number(token),
      email: this.tempStorageService.getEmail() as string,
    };

    this.registrationService
      .confirmRegistration(OTPRequest)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Conta confirmada com sucesso! Faça login para continuar.'
          );
          this.router.navigate(['/auth/login']);
        },
        error: error => {
          const errorCode = error?.error?.code || error?.error?.field || '500';
          const errorMessage =
            CONFIRMATION_ERRORS[errorCode] ||
            COMMON_ERRORS[errorCode] ||
            'Erro desconhecido.';

          this.notificationService.showError(errorMessage);
        },
      });
  }

  onResendToken(): void {
    const email = this.tempStorageService.getEmail();
    if (!email) {
      this.notificationService.showError(
        'Erro: Nenhum e-mail encontrado. Faça o cadastro novamente.'
      );
      return;
    }

    this.isLoading.set(true);

    this.registrationService
      .resendConfirmation({ email })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () =>
          this.notificationService.showSuccess(
            'Novo código enviado para seu e-mail.'
          ),
        error: error => {
          const errorCode = error?.error?.code || error?.error?.field || '500';
          const errorMessage =
            RESEND_CONFIRMATION_ERRORS[errorCode] ||
            COMMON_ERRORS[errorCode] ||
            'Erro desconhecido.';

          this.notificationService.showError(errorMessage);
        },
      });
  }
}
