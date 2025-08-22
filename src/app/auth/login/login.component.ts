import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { MockAuthService } from '../../core/services/mock-auth.service';
import { ScreenService } from '../../core/services/screen.service';
import { FormValidationService } from '../../core/services/form-validation.service';
import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ERROR_MESSAGES_LOGIN } from './login-errors';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginComponent implements OnInit {
  isLoading = signal(false);
  isMobile: boolean = false;
  loginForm: any;
  showMockInfo = true; // Sempre mostrar no modo mock

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private mockAuthService: MockAuthService,
    private screenService: ScreenService,
    private notificationService: NotificationService,
    private router: Router,
    public formValidation: FormValidationService
  ) {
    this.loginForm = new FormGroup({
      email: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.pattern(this.formValidation.patterns.email),
      ]),
      password: this.formValidation.createFormControl('', [
        Validators.required,
        this.formValidation.passwordValidator(),
      ]),
    });
  }

  ngOnInit(): void {
    this.screenService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });

    // Preencher automaticamente com as credenciais mock
    if (this.mockAuthService.isInMockMode()) {
      const credentials = this.mockAuthService.getMockCredentials();
      this.loginForm.patchValue({
        email: credentials.email,
        password: credentials.password,
      });
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    // Primeiro tenta fazer login real
    this.authService
      .login({ username: email, password })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: response => {
          this.tokenService.setToken(
            response.accessToken.replace(/"/g, ''),
            response.refreshToken,
            response.expiresIn
          );

          this.notificationService.showSuccess('Login realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: error => {
          // Se falhar, tenta usar o mock
          console.log('Backend não disponível, usando modo mock...');
          this.useMockLogin(email, password);
        },
      });
  }

  private useMockLogin(email: string, password: string): void {
    this.mockAuthService.login(email, password).subscribe({
      next: response => {
        if (response.success) {
          this.notificationService.showSuccess(
            'Login realizado com sucesso! (Modo Mock)'
          );
          this.router.navigate(['/dashboard']);
        } else {
          this.notificationService.showError(response.message);
        }
      },
      error: error => {
        this.notificationService.showError('Erro no login mock');
      },
    });
  }

  onForgotPassword(): void {
    this.router.navigate(['auth/forgot-password']);
  }

  onRegister(): void {
    this.router.navigate(['auth/register']);
  }
}
