import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TempStorageService {
  setEmail(email: string): void {
    sessionStorage.setItem('temp_email', email);
  }

  getEmail(): string | null {
    return sessionStorage.getItem('temp_email');
  }

  clear(): void {
    sessionStorage.removeItem('temp_email');
  }
}
