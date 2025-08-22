import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private isMobileSubject = new BehaviorSubject<boolean>(this.isMobileScreen());
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    // Detecta mudanças de tela e atualiza o estado
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(200), // Evita execuções repetidas em redimensionamentos rápidos
        map(() => this.isMobileScreen()), // Mapeia para o estado correto
        startWith(this.isMobileScreen()) // Começa com o estado inicial
      )
      .subscribe(isMobile => this.isMobileSubject.next(isMobile));
  }

  private isMobileScreen(): boolean {
    return window.innerWidth <= 768; // Define quando o sistema é considerado "mobile"
  }
}
