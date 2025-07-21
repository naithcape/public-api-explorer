import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatButtonToggleModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="theme-toggle-container">
      <mat-button-toggle-group
        [value]="themeService.theme()"
        (change)="onThemeChange($event.value)"
        class="theme-toggle"
      >
        <mat-button-toggle value="light" matTooltip="Light theme" class="toggle-button">
          <mat-icon class="toggle-icon">light_mode</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="dark" matTooltip="Dark theme" class="toggle-button">
          <mat-icon class="toggle-icon">dark_mode</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="auto" matTooltip="Auto theme (system preference)" class="toggle-button">
          <mat-icon class="toggle-icon">brightness_auto</mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: `
    .theme-toggle-container {
      display: flex;
      align-items: center;
    }

    .theme-toggle {
      border: none;
      border-radius: var(--radius-full);
      overflow: hidden;
      background-color: var(--background-color);
      box-shadow: var(--shadow-sm);
    }

    .toggle-button {
      border: none !important;
      background-color: transparent;
      transition: all 0.3s ease;
    }

    .toggle-button.mat-button-toggle-checked {
      background-color: var(--primary-color);
      color: white;
    }

    .toggle-button.mat-button-toggle-checked .toggle-icon {
      animation: spin 0.5s ease-out;
    }

    .toggle-icon {
      margin: 0;
      font-size: 20px;
      height: 20px;
      width: 20px;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}

  onThemeChange(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
