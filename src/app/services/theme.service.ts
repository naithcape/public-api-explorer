import { Injectable, signal } from '@angular/core';
export type Theme = 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-preference';
  private _theme = signal<Theme>('light');
  public theme = this._theme.asReadonly();

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this._theme.set('light');
    localStorage.setItem(this.STORAGE_KEY, 'light');
    this.applyTheme('light');
  }

  setTheme(theme: Theme): void {
    this._theme.set('light');
    localStorage.setItem(this.STORAGE_KEY, 'light');
    this.applyTheme('light');
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.classList.add('light-theme');
  }
}
