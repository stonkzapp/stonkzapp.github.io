import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { FormValidationService } from '../../core/services/form-validation.service';

// Models
import { AdminLoginRequest } from '../../core/models/models';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="admin-login-container">
      <div class="admin-login-card">
        <!-- Header -->
        <div class="admin-header">
          <div class="admin-logo">
            <mat-icon class="admin-icon">admin_panel_settings</mat-icon>
            <h1>Stonkz Admin</h1>
          </div>
          <p class="admin-subtitle">Painel Administrativo</p>
        </div>

        <!-- Alert de Segurança -->
        <div class="security-alert">
          <mat-icon>security</mat-icon>
          <div>
            <strong>Área Restrita</strong>
            <p>Acesso autorizado apenas para administradores</p>
          </div>
        </div>

        <!-- Formulário -->
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="admin-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>E-mail Administrativo</mat-label>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="Digite seu e-mail administrativo"
              required />
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
              E-mail é obrigatório
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('pattern')">
              E-mail inválido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Senha</mat-label>
            <input
              matInput
              type="password"
              formControlName="password"
              placeholder="Digite sua senha"
              required />
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              Senha é obrigatória
            </mat-error>
            <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
              Senha deve ter pelo menos 8 caracteres
            </mat-error>
          </mat-form-field>

          <!-- Código de Segurança (Opcional)
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Código de Segurança (Opcional)</mat-label>
            <input
              matInput
              type="text"
              formControlName="securityCode"
              placeholder="Digite o código de segurança" />
          </mat-form-field> -->

          <!-- Botão de Login -->
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            class="login-button full-width">
            <mat-icon *ngIf="!isLoading()">admin_panel_settings</mat-icon>
            <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
            {{ isLoading() ? 'Entrando...' : 'Entrar no Painel' }}
          </button>
        </form>

        <!-- Credenciais de Desenvolvimento -->
        <div class="dev-credentials" *ngIf="showDevCredentials">
          <mat-divider></mat-divider>
          <div class="dev-info">
            <mat-icon>code</mat-icon>
            <div>
              <strong>Credenciais de Desenvolvimento</strong>
              <p><strong>E-mail:</strong> admin&#64;stonkz.com</p>
              <p><strong>Senha:</strong> Stonkz&#64;Admin2024!</p>
              <small>⚠️ Apenas para desenvolvimento</small>
            </div>
          </div>
        </div>

        <!-- Loading Bar -->
        <mat-progress-bar
          *ngIf="isLoading()"
          mode="indeterminate"
          class="loading-bar">
        </mat-progress-bar>

        <!-- Footer -->
        <div class="admin-footer">
          <p>&copy; 2025 Stonkz. Sistema Administrativo.</p>
          <a (click)="goToUserLogin()" class="user-login-link">
            <mat-icon>person</mat-icon>
            Login de Usuário
          </a>
        </div>
      </div>

      <!-- Background -->
      <div class="admin-background">
        <div class="grid-pattern"></div>
        <div class="gradient-overlay"></div>
      </div>
    </div>
  `,
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = signal(false);
  showDevCredentials = true; // Mostrar apenas em desenvolvimento
  loginForm: FormGroup;

  constructor(
    private adminAuthService: AdminAuthService,
    private notificationService: NotificationService,
    private router: Router,
    private formValidation: FormValidationService
  ) {
    this.loginForm = new FormGroup({
      email: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.pattern(this.formValidation.patterns.email),
      ]),
      password: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      securityCode: new FormControl(''),
    });
  }

  ngOnInit(): void {
    // Verificar se já está autenticado
    if (this.adminAuthService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    // Pre-preencher com credenciais de desenvolvimento
    if (this.showDevCredentials) {
      this.loginForm.patchValue({
        email: 'admin@stonkz.com',
        password: 'Stonkz@Admin2024!',
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin(): void {
    if (this.loginForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    const credentials: AdminLoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      securityCode: this.loginForm.value.securityCode || undefined,
    };

    this.adminAuthService
      .login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.isLoading.set(false);
          this.notificationService.showSuccess(
            `Bem-vindo, ${response.adminUser.name}!`
          );
          this.router.navigate(['/admin/dashboard']);
        },
        error: error => {
          this.isLoading.set(false);
          console.error('Erro no login administrativo:', error);

          let errorMessage = 'Erro no login administrativo';
          if (error.status === 401) {
            errorMessage = 'Credenciais inválidas';
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.notificationService.showError(errorMessage);
        },
      });
  }

  goToUserLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Método para obter mensagem de validação
  getValidationMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control) return '';

    if (control.errors && control.touched) {
      const firstError = Object.keys(control.errors)[0];
      switch (firstError) {
        case 'required':
          return `${field === 'email' ? 'E-mail' : 'Senha'} é obrigatório`;
        case 'email':
        case 'pattern':
          return 'E-mail inválido';
        case 'minlength':
          return `Senha deve ter pelo menos ${control.errors['minlength'].requiredLength} caracteres`;
        default:
          return 'Campo inválido';
      }
    }
    return '';
  }
}
