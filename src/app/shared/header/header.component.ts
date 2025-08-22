import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import {
  MockAuthService,
  MockUser,
} from '../../core/services/mock-auth.service';
import { StorageService } from '../../core/services/storage.service';
import { NotificationService } from '../../core/services/notification.service';
import { BiometricAuthService } from '../../core/services/biometric-auth.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { WalletSelectorComponent } from '../wallet-selector';
import { BiometricCapabilities } from '../../core/models/models';
import { BiometricSettingsModalComponent } from '../biometric-settings-modal/biometric-settings-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    NotificationsComponent,
    WalletSelectorComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string = 'Dashboard';
  @Input() showBackButton: boolean = false;
  @Output() backButtonClick = new EventEmitter<void>();

  isTextMode = signal(false);
  currentUser: MockUser | null = null;
  isMockMode = false;

  // Propriedades de biometria
  biometricCapabilities: BiometricCapabilities | null = null;
  biometricAvailable = signal(false);
  biometricEnrolled = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private mockAuthService: MockAuthService,
    private storageService: StorageService,
    private notificationService: NotificationService,
    private biometricAuthService: BiometricAuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Verifica se está em modo mock
    this.isMockMode = this.mockAuthService.isInMockMode();

    // Se está em modo mock, obtém o usuário mock
    if (this.isMockMode) {
      this.mockAuthService.mockUser$.subscribe(user => {
        this.currentUser = user;
      });
    }

    // Verificar capacidades biométricas
    this.checkBiometricCapabilities();
  }

  isDesktop(): boolean {
    return window.innerWidth > 600;
  }

  onBackClick(): void {
    this.backButtonClick.emit();
    // Fallback: voltar para página anterior
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleTextMode(): void {
    this.isTextMode.update(current => !current);

    if (this.isTextMode()) {
      // Aplicar modo texto (ocultar símbolos $)
      document.body.classList.add('text-mode');
      this.notificationService.showInfo(
        'Modo texto ativado - símbolos $ ocultos'
      );
    } else {
      // Desativar modo texto (mostrar símbolos $)
      document.body.classList.remove('text-mode');
      this.notificationService.showInfo('Modo texto desativado');
    }
  }

  onProfileClick(): void {
    this.router.navigate(['/dashboard/profile']);
  }

  onLogout(): void {
    this.notificationService.showInfo('Saindo da aplicação...');

    // Limpar dados da sessão
    this.tokenService.removeToken();
    this.storageService.clearSession();

    // Se estiver em modo mock, também limpa o usuário mock
    if (this.isMockMode) {
      this.mockAuthService.logout();
    }

    // Redirecionar para login
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 1000);
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return this.currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    // Fallback para quando não há usuário
    return 'US';
  }

  getUserName(): string {
    return this.currentUser?.name || 'Usuário';
  }

  getUserEmail(): string {
    return this.currentUser?.email || 'usuario@exemplo.com';
  }

  goToHome(): void {
    // Voltar para a home do dashboard
    this.router.navigate(['/dashboard/home']);
  }

  // Verificar capacidades biométricas
  private checkBiometricCapabilities(): void {
    this.biometricAuthService.getBiometricCapabilities().subscribe({
      next: capabilities => {
        this.biometricCapabilities = capabilities;
        this.biometricAvailable.set(capabilities.isAvailable);

        // Verificar se o usuário já está registrado
        this.biometricAuthService.isBiometricEnrolled().subscribe(enrolled => {
          this.biometricEnrolled.set(enrolled && capabilities.isAvailable);
        });
      },
      error: error => {
        console.warn('Erro ao verificar capacidades biométricas:', error);
        this.biometricAvailable.set(false);
      },
    });
  }

  // Abrir configurações de biometria
  onBiometricSettingsClick(): void {
    if (!this.biometricAvailable()) {
      this.notificationService.showWarning(
        'Autenticação biométrica não disponível neste dispositivo'
      );
      return;
    }

    // Abrir modal de configuração de biometria
    this.openBiometricSettingsModal();
  }

  // Abrir modal de configuração de biometria
  private openBiometricSettingsModal(): void {
    const dialogRef = this.dialog.open(BiometricSettingsModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      panelClass: 'biometric-settings-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Atualizar status biométrico se necessário
        this.checkBiometricCapabilities();
      }
    });
  }
}
