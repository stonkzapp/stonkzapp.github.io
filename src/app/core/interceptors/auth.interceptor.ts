import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TokenRefreshModalComponent } from '../../shared/token-refresh-modal/token-refresh-modal.component';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenService = inject(TokenService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokenService.getToken();

    if (token) {
      // Verifica se o token está prestes a expirar ou já expirou
      if (this.tokenService.isTokenExpiringSoon()) {
        // Token prestes a expirar, exibe o modal para renovação
        const dialogRef = this.dialog.open(TokenRefreshModalComponent, {
          data: {
            refreshToken: this.tokenService.getRefreshToken(),
            type: 'expiring',
          },
        });

        // Após o usuário tomar uma ação no modal, retentamos a requisição
        return dialogRef.afterClosed().pipe(
          catchError((error: any) => {
            return throwError(error); // Caso o modal falhe ou o usuário cancele, retorne o erro
          })
        );
      } else if (this.tokenService.isTokenExpired()) {
        // Token expirado, exibe o modal para redirecionamento ao login
        const dialogRef = this.dialog.open(TokenRefreshModalComponent, {
          data: { type: 'expired' },
        });

        return dialogRef.afterClosed().pipe(
          catchError((error: any) => {
            return throwError(error); // Caso o modal falhe ou o usuário cancele, retorne o erro
          })
        );
      } else {
        // Se o token não está expirando nem expirado, prossegue com a requisição normalmente
        const cloned = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        return next.handle(cloned).pipe(
          catchError((error: HttpErrorResponse) => {
            // Se o erro for 401 (token expirado), solicitamos novo login
            if (error.status === 401) {
              this.notificationService.showError(
                'Token expirado. Por favor, faça login novamente.'
              );
              this.router.navigate(['/auth/login']);
            }
            return throwError(error);
          })
        );
      }
    }

    return next.handle(req); // Se não houver token, prossegue normalmente
  }
}
