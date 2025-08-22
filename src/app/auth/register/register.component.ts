import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ScreenService } from '../../core/services/screen.service';
import { FormValidationService } from '../../core/services/form-validation.service';
import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { RegistrationService } from '../../core/services/registration.service';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TempStorageService } from '../../core/services/temp-storage.service';
import { REGISTER_ERRORS } from './register-errors';
import { COMMON_ERRORS } from '../../shared/common-errors';
import { PasswordInputComponent } from '../../shared/password-input/password-input.component';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatButtonModule,
    InputComponent,
    ButtonComponent,
    PasswordInputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RegisterComponent {
  isLoading = signal(false);
  isMobile: boolean = false;
  registerForm: any;

  constructor(
    private screenService: ScreenService,
    private router: Router,
    private notificationService: NotificationService,
    public formValidation: FormValidationService,
    private registrationService: RegistrationService,
    private tempStorageService: TempStorageService
  ) {
    this.registerForm = new FormGroup({
      firstName: this.formValidation.createFormControl('', [
        Validators.required,
      ]),
      lastName: this.formValidation.createFormControl('', [
        Validators.required,
      ]),
      document: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.pattern(this.formValidation.patterns.cpf),
      ]),
      email: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.pattern(this.formValidation.patterns.email),
      ]),
      phoneNumber: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.pattern(this.formValidation.patterns.phone),
      ]),
      password: this.formValidation.createFormControl('', [
        Validators.required,
        this.formValidation.passwordValidator(),
      ]),
      term: this.formValidation.createFormControl(false, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.screenService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    const { firstName, lastName, document, email, phoneNumber, password } =
      this.registerForm.value;

    this.registrationService
      .register({ firstName, lastName, document, email, phoneNumber, password })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.tempStorageService.setEmail(email);
          this.notificationService.showSuccess(
            'Registro realizado com sucesso! Verifique seu e-mail para confirmar.'
          );
          this.router.navigate(['/auth/confirm']);
        },
        error: error => {
          const errorCode = error?.error?.code || error?.error?.field || '500';
          const errorMessage =
            REGISTER_ERRORS[errorCode] ||
            COMMON_ERRORS[errorCode] ||
            'Erro desconhecido.';

          this.notificationService.showError(errorMessage);
        },
      });
  }

  onLogin(): void {
    this.router.navigate(['auth/login']);
  }
}
