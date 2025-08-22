import { ToastrConfig } from './../../node_modules/ngx-toastr/toastr/toastr-config.d';
import {
  ANIMATION_MODULE_TYPE,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './core/services/notification.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from './core/services/form-validation.service';
import { InputComponent } from './shared/input/input.component';
import { ButtonComponent } from './shared/button/button.component';
import { SelectComponent } from './shared/select/select.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { TokenService } from './core/services/token.service';
import { StorageService } from './core/services/storage.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importando animações
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TokenRefreshModalComponent } from './shared/token-refresh-modal/token-refresh-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    LoadingComponent,
    // InputComponent,
    // ButtonComponent,
    // SelectComponent,
  ],
  providers: [ThemeService, NotificationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  form2: any;
  form3: any;

  constructor(
    private notificationService: NotificationService,
    public formValidation: FormValidationService,
    private router: Router,
    private tokenService: TokenService,
    private storageService: StorageService,
    private dialog: Dialog,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Inicializar o tema
    this.themeService.darkModeChanges$.subscribe(isDark => {
      // O tema já é aplicado automaticamente pelo ThemeService
    });

    // this.handleTokenExpiration();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (
          event.url === '' ||
          event.url === '/auth/login' ||
          event.url === '/auth/register' ||
          event.url === '/auth/forgot-password' ||
          event.url === '/auth/reset-password'
        ) {
          this.clearSessionData();
        }
      }
    });
  }

  clearSessionData(): void {
    this.tokenService.removeToken();
    this.storageService.clearSession();
  }

  private handleTokenExpiration(): void {
    if (!this.tokenService.isAuthenticated()) {
      const refreshToken = this.storageService.getSessionItem('refreshToken');
      if (refreshToken) {
        this.showTokenRefreshModal(refreshToken);
      } else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  private showTokenRefreshModal(refreshToken: string): void {
    const dialogRef = this.dialog.open(TokenRefreshModalComponent, {
      data: { refreshToken },
    });

    dialogRef.closed.subscribe(() => {
      // You can add any post-refresh actions here
    });
  }

  onSuccess() {
    this.notificationService.showSuccess('Ação realizada com sucesso!');
  }

  onError() {
    this.notificationService.showError(
      'Ocorreu um erro ao processar a requisição.'
    );
  }

  onInfo() {
    this.notificationService.showInfo('Atenção: Verifique os dados inseridos.');
  }
}
