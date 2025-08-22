import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
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
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { MockAuthService } from '../../core/services/mock-auth.service';
import { ScreenService } from '../../core/services/screen.service';
import { FormValidationService } from '../../core/services/form-validation.service';
import { SocialAuthService } from '../../core/services/social-auth.service';
import { BiometricAuthService } from '../../core/services/biometric-auth.service';
import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { Router } from '@angular/router';
import { finalize, takeUntil, Subject } from 'rxjs';
import { ERROR_MESSAGES_LOGIN } from './login-errors';
import { NotificationService } from '../../core/services/notification.service';
import { AuthProvider, BiometricCapabilities } from '../../core/models/models';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = signal(false);
  isSocialLoading = signal<AuthProvider | null>(null);
  isBiometricLoading = signal(false);
  isMobile: boolean = false;
  loginForm: FormGroup;
  showMockInfo = true; // Sempre mostrar no modo mock

  // Capacidades de autenticação
  biometricCapabilities: BiometricCapabilities | null = null;
  biometricAvailable = signal(false);
  biometricEnrolled = signal(false);

  // Provedores sociais disponíveis
  socialProviders: {
    provider: AuthProvider;
    name: string;
    icon: string;
    color: string;
  }[] = [
    { provider: 'google', name: 'Google', icon: 'google', color: '#db4437' },
    { provider: 'apple', name: 'Apple', icon: 'apple', color: '#000000' },
    // {
    //   provider: 'facebook',
    //   name: 'Facebook',
    //   icon: 'facebook',
    //   color: '#1877f2',
    // },
    // {
    //   provider: 'microsoft',
    //   name: 'Microsoft',
    //   icon: 'microsoft',
    //   color: '#0078d4',
    // },
    // { provider: 'github', name: 'GitHub', icon: 'github', color: '#333333' },
  ];

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private mockAuthService: MockAuthService,
    private screenService: ScreenService,
    private notificationService: NotificationService,
    private socialAuthService: SocialAuthService,
    private biometricAuthService: BiometricAuthService,
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
      rememberMe: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.screenService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobile => {
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

    // Verificar capacidades biométricas
    this.checkBiometricCapabilities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkBiometricCapabilities(): void {
    this.biometricAuthService
      .getBiometricCapabilities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: capabilities => {
          this.biometricCapabilities = capabilities;
          this.biometricAvailable.set(capabilities.isAvailable);

          // Verificar se o usuário já está registrado
          this.biometricAuthService
            .isBiometricEnrolled()
            .pipe(takeUntil(this.destroy$))
            .subscribe(enrolled => {
              this.biometricEnrolled.set(enrolled && capabilities.isAvailable);
            });
        },
        error: error => {
          console.warn('Erro ao verificar capacidades biométricas:', error);
          this.biometricAvailable.set(false);
        },
      });
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

  // Login Social
  onSocialLogin(provider: AuthProvider): void {
    if (!this.socialAuthService.isProviderAvailable(provider)) {
      this.notificationService.showWarning(
        `${provider} não está disponível no momento`
      );
      return;
    }

    this.isSocialLoading.set(provider);

    let socialObservable;
    switch (provider) {
      case 'google':
        socialObservable = this.socialAuthService.loginWithGoogle();
        break;
      case 'apple':
        socialObservable = this.socialAuthService.loginWithApple();
        break;
      case 'facebook':
        socialObservable = this.socialAuthService.loginWithFacebook();
        break;
      case 'microsoft':
        socialObservable = this.socialAuthService.loginWithMicrosoft();
        break;
      case 'github':
        socialObservable = this.socialAuthService.loginWithGitHub();
        break;
      default:
        this.notificationService.showError(
          `Provedor ${provider} não suportado`
        );
        this.isSocialLoading.set(null);
        return;
    }

    socialObservable
      .pipe(
        finalize(() => this.isSocialLoading.set(null)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: socialRequest => {
          // Enviar para o backend
          this.authService
            .socialLogin(socialRequest)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: response => {
                this.handleSuccessfulLogin(response, provider);
              },
              error: error => {
                this.notificationService.showError(
                  `Erro no login ${provider}: ${error.message}`
                );
              },
            });
        },
        error: error => {
          this.notificationService.showError(
            `Erro na autenticação ${provider}: ${error.message}`
          );
        },
      });
  }

  // Login Biométrico
  onBiometricLogin(): void {
    if (!this.biometricAvailable() || !this.biometricEnrolled()) {
      this.notificationService.showWarning(
        'Autenticação biométrica não disponível ou não configurada'
      );
      return;
    }

    this.isBiometricLoading.set(true);

    this.biometricAuthService
      .authenticate()
      .pipe(
        finalize(() => this.isBiometricLoading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: biometricRequest => {
          this.authService
            .biometricLogin(biometricRequest)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: response => {
                this.handleSuccessfulLogin(response, 'biometric');
              },
              error: error => {
                this.notificationService.showError(
                  `Erro no login biométrico: ${error.message}`
                );
              },
            });
        },
        error: error => {
          this.notificationService.showError(
            `Erro na autenticação biométrica: ${error.message}`
          );
        },
      });
  }

  // Configurar autenticação biométrica
  onSetupBiometric(): void {
    if (!this.biometricAvailable()) {
      this.notificationService.showWarning(
        'Autenticação biométrica não disponível neste dispositivo'
      );
      return;
    }

    this.notificationService.showInfo(
      'Faça login primeiro, depois configure a autenticação biométrica nas configurações'
    );
  }

  // SSO Login (Android/iOS)
  onSSOLogin(): void {
    const platform = this.detectPlatform();
    if (!['android', 'ios'].includes(platform)) {
      this.notificationService.showWarning(
        'SSO disponível apenas em dispositivos móveis'
      );
      return;
    }

    this.isSocialLoading.set('sso');

    const ssoRequest = {
      provider: platform as 'android' | 'ios',
      deviceId: this.getDeviceId(),
      token: this.generateMockSSOToken(),
    };

    this.authService
      .ssoLogin(ssoRequest)
      .pipe(
        finalize(() => this.isSocialLoading.set(null)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: response => {
          this.handleSuccessfulLogin(response, 'sso');
        },
        error: error => {
          this.notificationService.showError(`Erro no SSO: ${error.message}`);
        },
      });
  }

  // Método auxiliar para lidar com login bem-sucedido
  private handleSuccessfulLogin(response: any, provider: AuthProvider): void {
    this.tokenService.setToken(
      response.accessToken.replace(/"/g, ''),
      response.refreshToken,
      response.expiresIn
    );

    this.authService.setCurrentProvider(provider);

    const providerNames: { [key in AuthProvider]: string } = {
      email: 'Email',
      google: 'Google',
      apple: 'Apple',
      facebook: 'Facebook',
      microsoft: 'Microsoft',
      github: 'GitHub',
      keycloak: 'Keycloak',
      biometric: 'Biométrica',
      sso: 'SSO',
    };

    this.notificationService.showSuccess(
      `Login ${providerNames[provider]} realizado com sucesso!`
    );

    if (provider === 'biometric') {
      this.biometricAuthService.setBiometricEnrolled(true);
    }

    this.router.navigate(['/dashboard']);
  }

  // Métodos auxiliares
  private detectPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/i.test(userAgent)) return 'android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
    if (/windows/i.test(userAgent)) return 'windows';
    if (/macintosh|mac os x/i.test(userAgent)) return 'macos';
    return 'unknown';
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('stonkz_device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('stonkz_device_id', deviceId);
    }
    return deviceId;
  }

  private generateMockSSOToken(): string {
    return 'mock_sso_' + Math.random().toString(36).substring(2, 15);
  }

  isSocialProviderLoading(provider: AuthProvider): boolean {
    return this.isSocialLoading() === provider;
  }

  getBiometricIcon(): string {
    if (!this.biometricCapabilities) return 'fingerprint';

    if (this.biometricCapabilities.faceId) return 'face';
    if (this.biometricCapabilities.touchId) return 'fingerprint';
    if (this.biometricCapabilities.fingerprint) return 'fingerprint';
    if (this.biometricCapabilities.iris) return 'visibility';
    if (this.biometricCapabilities.voice) return 'mic';

    return 'fingerprint';
  }

  getBiometricText(): string {
    if (!this.biometricCapabilities) return 'Biométrica';

    if (this.biometricCapabilities.faceId) return 'Face ID';
    if (this.biometricCapabilities.touchId) return 'Touch ID';
    if (this.biometricCapabilities.fingerprint) return 'Digital';
    if (this.biometricCapabilities.iris) return 'Íris';
    if (this.biometricCapabilities.voice) return 'Voz';

    return 'Biométrica';
  }

  getValidationMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control) return '';

    // Verificar se há erros no controle
    if (control.errors && control.touched) {
      const firstError = Object.keys(control.errors)[0];

      switch (firstError) {
        case 'required':
          return `${field} é obrigatório`;
        case 'email':
          return 'E-mail inválido';
        case 'pattern':
          return 'Formato inválido';
        case 'minlength':
          return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
        case 'maxlength':
          return `Máximo de ${control.errors['maxlength'].requiredLength} caracteres`;
        default:
          return 'Campo inválido';
      }
    }

    return '';
  }

  onForgotPassword(): void {
    this.router.navigate(['auth/forgot-password']);
  }

  onRegister(): void {
    this.router.navigate(['auth/register']);
  }
}
