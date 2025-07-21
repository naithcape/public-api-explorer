import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { Api, ApiStatus } from '../../models/api.model';
import { ApiService } from '../../services/api.service';
import { SearchFilterComponent, FilterCriteria } from '../search-filter/search-filter';
import { ApiFormComponent } from '../api-form/api-form';

@Component({
  selector: 'app-api-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
    MatTabsModule,
    SearchFilterComponent,
    ApiFormComponent
  ],
  template: `
    <div class="api-list-container fade-in">
      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" animationDuration="300ms" class="api-tabs">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">list</mat-icon>
            <span>Browse APIs</span>
          </ng-template>

          <div class="tab-content">
            <app-search-filter (filterChange)="onFilterChange($event)" class="search-filter"></app-search-filter>

            <div *ngIf="filteredApis().length === 0" class="no-results scale-in">
              <mat-card>
                <mat-card-content class="no-results-content">
                  <mat-icon class="no-results-icon">search_off</mat-icon>
                  <p>No APIs found matching your criteria.</p>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="api-grid">
              <mat-card *ngFor="let api of filteredApis(); let i = index" class="api-card slide-up" [style.animation-delay]="i * 0.05 + 's'">
                <div class="card-status-indicator" [ngClass]="getStatusClass(api.status)"></div>
                <mat-card-header>
                  <div class="card-header-content">
                    <mat-card-title>{{ api.name }}</mat-card-title>
                    <div class="status-chip">
                      <mat-chip [ngClass]="getStatusClass(api.status)">
                        <mat-icon class="status-icon">{{ getStatusIcon(api.status) }}</mat-icon>
                        {{ api.status }}
                      </mat-chip>
                    </div>
                  </div>
                </mat-card-header>

                <mat-card-content>
                  <p class="description">{{ api.description }}</p>
                  <a [href]="api.link" target="_blank" class="api-link">
                    <mat-icon>link</mat-icon>
                    <span class="link-text">{{ api.link }}</span>
                    <mat-icon class="external-icon">open_in_new</mat-icon>
                  </a>

                  <div class="vote-counts">
                    <span class="vote-count" matTooltip="Works votes">
                      <mat-icon class="up-icon">thumb_up</mat-icon> {{ api.votes_up }}
                    </span>
                    <span class="vote-count" matTooltip="Doesn't work votes">
                      <mat-icon class="down-icon">thumb_down</mat-icon> {{ api.votes_down }}
                    </span>
                  </div>
                </mat-card-content>

                <mat-divider></mat-divider>

                <mat-card-actions>
                  <button
                    mat-button
                    class="vote-button vote-up"
                    (click)="voteUp(api.id)"
                    matTooltip="Vote that this API works"
                  >
                    <mat-icon>thumb_up</mat-icon> Works
                  </button>
                  <button
                    mat-button
                    class="vote-button vote-down"
                    (click)="voteDown(api.id)"
                    matTooltip="Vote that this API doesn't work"
                  >
                    <mat-icon>thumb_down</mat-icon> Doesn't Work
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">add_circle</mat-icon>
            <span>Add New API</span>
          </ng-template>

          <div class="tab-content">
            <app-api-form></app-api-form>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .api-list-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .api-tabs {
      background-color: var(--surface-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--divider-color);
      overflow: hidden;
    }

    .tab-icon {
      margin-right: var(--spacing-xs);
    }

    .tab-content {
      padding: var(--spacing-lg);
    }

    .search-filter {
      margin-bottom: var(--spacing-md);
    }

    .api-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--spacing-lg);
    }

    .api-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      background-color: var(--surface-color);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--divider-color);
    }

    .api-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .card-status-indicator {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      z-index: 1;
    }

    .new-chip {
      background-color: var(--primary-color);
      color: white;
    }

    .recommended-chip {
      background-color: var(--success-color);
      color: white;
    }

    .not-recommended-chip {
      background-color: var(--error-color);
      color: white;
    }

    mat-card-header {
      padding: var(--spacing-md) var(--spacing-lg);
      background-color: var(--surface-color);
      border-bottom: 1px solid var(--divider-color);
    }

    .card-header-content {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }

    mat-card-title {
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 1.25rem;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 70%;
    }

    mat-card-content {
      padding: var(--spacing-lg);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .description {
      margin-bottom: var(--spacing-md);
      line-height: 1.6;
      color: var(--text-secondary);
      font-size: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .api-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--background-color);
      border-radius: var(--radius-md);
      color: var(--primary-color);
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-sm);
    }

    .link-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.9rem;
    }

    .external-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      opacity: 0.7;
    }

    .api-link:hover {
      background-color: rgba(33, 150, 243, 0.1);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .vote-counts {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--background-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }

    .vote-count {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .up-icon {
      color: var(--success-color);
    }

    .down-icon {
      color: var(--error-color);
    }

    mat-card-actions {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-md);
      background-color: var(--background-color);
    }

    .vote-button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      border-radius: var(--radius-md);
      transition: all 0.3s ease;
      font-weight: 500;
      padding: var(--spacing-sm) var(--spacing-md);
    }

    .vote-up {
      color: var(--success-color);
    }

    .vote-up:hover {
      background-color: rgba(76, 175, 80, 0.1);
      transform: translateY(-2px);
    }

    .vote-down {
      color: var(--error-color);
    }

    .vote-down:hover {
      background-color: rgba(244, 67, 54, 0.1);
      transform: translateY(-2px);
    }

    .status-chip {
      display: flex;
    }

    .status-icon {
      margin-right: var(--spacing-xs);
      font-size: 16px;
      height: 16px;
      width: 16px;
    }

    .no-results {
      margin-bottom: var(--spacing-md);
    }

    .no-results-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-lg);
      text-align: center;
    }

    .no-results-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: var(--spacing-md);
      color: var(--text-secondary);
    }

    /* Responsive improvements */
    @media (max-width: 768px) {
      .api-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--spacing-md);
      }

      mat-card-title {
        font-size: 1.1rem;
      }

      .description {
        font-size: 0.95rem;
      }
    }

    @media (max-width: 600px) {
      .api-grid {
        grid-template-columns: 1fr;
      }

      .card-header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-sm);
      }

      mat-card-title {
        max-width: 100%;
      }

      .status-chip {
        margin-left: 0;
      }
    }
  `
})
export class ApiListComponent {
  private filterCriteria = signal<FilterCriteria>({
    searchTerm: '',
    status: 'All',
    showInactive: false
  });

  filteredApis = computed(() => {
    let apis = this.apiService.getAllApis();
    const criteria = this.filterCriteria();
    if (criteria.status !== 'All') {
      apis = apis.filter(api => api.status === criteria.status);
    } else {
      if (criteria.showInactive) {
        apis = apis.filter(api => !api.active);
      } else {
        apis = apis.filter(api => api.active);
      }
    }
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      apis = apis.filter(api =>
        api.name.toLowerCase().includes(term) ||
        api.description.toLowerCase().includes(term)
      );
    }

    return apis;
  });

  constructor(private apiService: ApiService) {}

  onFilterChange(criteria: FilterCriteria): void {
    this.filterCriteria.set(criteria);
  }

  async voteUp(id: number): Promise<void> {
    await this.apiService.voteUp(id);
  }

  async voteDown(id: number): Promise<void> {
    await this.apiService.voteDown(id);
  }

  getStatusClass(status: ApiStatus): string {
    switch (status) {
      case 'New':
        return 'new-chip';
      case 'Recommended':
        return 'recommended-chip';
      case 'Not Recommended':
        return 'not-recommended-chip';
      default:
        return '';
    }
  }

  getStatusIcon(status: ApiStatus): string {
    switch (status) {
      case 'New':
        return 'fiber_new';
      case 'Recommended':
        return 'verified';
      case 'Not Recommended':
        return 'warning';
      default:
        return 'info';
    }
  }
}
