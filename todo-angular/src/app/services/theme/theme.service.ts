import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private storageKey = 'theme';

  theme = signal<Theme>(
    (localStorage.getItem(this.storageKey) as Theme) || 'dark'
  );

  constructor() {
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  setTheme(theme: Theme) {
    localStorage.setItem(this.storageKey, theme);
    this.theme.set(theme);
  }

  toggleTheme(){
    this.setTheme(this.theme() ==="dark" ? "light" : "dark")
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;

    root.classList.remove('dark', 'light');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }
}
