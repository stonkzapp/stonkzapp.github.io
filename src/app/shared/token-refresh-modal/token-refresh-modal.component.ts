import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TokenService } from '../../core/services/token.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-token-refresh-modal',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './token-refresh-modal.component.html',
  styleUrls: ['./token-refresh-modal.component.scss'],
})
export class TokenRefreshModalComponent {
  constructor(
    private dialogRef: MatDialogRef<TokenRefreshModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { refreshToken: string; isTokenExpiringSoon: boolean },
    private tokenService: TokenService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  // Função para renovar o token
  refreshToken(): void {
    this.authService
      .refreshToken({ refreshToken: this.data.refreshToken })
      .subscribe({
        next: response => {
          this.tokenService.setToken(
            response.accessToken,
            response.refreshToken,
            response.expiresIn
          );
          this.notificationService.showSuccess('Token renovado com sucesso');
          this.dialogRef.close(true); // Usuário aceitou renovar o token
        },
        error: error => {
          this.notificationService.showError('Falha ao renovar o token');
          this.dialogRef.close(false); // Usuário não aceitou renovar o token
        },
      });
  }

  // Função para redirecionar para a página de login caso o token tenha expirado
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
    this.dialogRef.close(false); // Fechar o modal e redirecionar para o login
  }

  // Função para fechar o modal sem fazer nada
  close(): void {
    this.dialogRef.close(false); // Usuário cancelou
  }
}
