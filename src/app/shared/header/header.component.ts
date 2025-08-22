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
import { NotificationsComponent } from '../notifications/notifications.component';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private mockAuthService: MockAuthService,
    private storageService: StorageService,
    private notificationService: NotificationService
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
}
