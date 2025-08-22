import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Ignora requisições de loading para evitar loop infinito
    if (req.url.includes('loading') || req.url.includes('status')) {
      return next.handle(req);
    }

    // Inicia o loading
    this.loadingService.startLoading();

    return next.handle(req).pipe(
      finalize(() => {
        // Para o loading independente de sucesso ou erro
        this.loadingService.stopLoading();
      })
    );
  }
}
