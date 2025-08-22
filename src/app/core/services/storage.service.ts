import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setLocalItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getLocalItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeLocalItem(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocal(): void {
    localStorage.clear();
  }

  setSessionItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  getSessionItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearSession(): void {
    sessionStorage.clear();
  }
}
