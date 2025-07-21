import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule],
  template: `
    <mat-toolbar>
      <div class="toolbar-content">
        <div class="logo-container">
          <mat-icon class="logo-icon">explore</mat-icon>
          <span class="app-title">Public API Explorer</span>
        </div>
        <div class="actions">
          <a href="https://github.com/naitharll/public-api-explorer" target="_blank" class="github-link">
            <mat-icon>code</mat-icon>
            <span class="github-text">GitHub</span>
          </a>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: `
    mat-toolbar {
      background-color: var(--surface-color);
      color: var(--text-primary);
      box-shadow: var(--shadow-md);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 0;
      margin-bottom: var(--spacing-lg);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-lg);
      height: 64px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .logo-icon {
      color: var(--primary-color);
      font-size: 28px;
      height: 28px;
      width: 28px;
      animation: pulse 2s infinite ease-in-out;
    }

    .app-title {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 600;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .github-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--text-secondary);
      text-decoration: none;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-md);
      transition: all 0.3s ease;
    }

    .github-link:hover {
      color: var(--primary-color);
      background-color: var(--background-color);
      transform: translateY(-2px);
    }

    .github-text {
      display: none;
    }

    @media (min-width: 600px) {
      .github-text {
        display: inline;
      }
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `
})
export class HeaderComponent {}
