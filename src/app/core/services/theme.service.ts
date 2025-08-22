import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = false;
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkModeChanges$ = this.darkModeSubject.asObservable();

  constructor() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.isDarkMode = storedTheme === 'dark';
    } else {
      this.isDarkMode =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    this.darkModeSubject.next(this.isDarkMode);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  isDarkModeEnabled(): boolean {
    return this.isDarkMode;
  }

  getLogoPath(): string {
    return this.isDarkMode ? 'logo-dark.svg' : 'logo.svg';
  }
}
