import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiStatus } from '../../models/api.model';

export interface FilterCriteria {
  searchTerm: string;
  status: ApiStatus | 'All';
  showInactive: boolean;
}

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <mat-card class="filter-card fade-in">
      <div class="card-accent-top"></div>
      <mat-card-header>
        <div class="header-content">
          <mat-icon class="header-icon">filter_list</mat-icon>
          <mat-card-title>Filter APIs</mat-card-title>
        </div>
      </mat-card-header>
      <mat-card-content>
        <div class="filter-container">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search APIs</mat-label>
            <mat-icon matPrefix class="search-icon">search</mat-icon>
            <input
              matInput
              [(ngModel)]="criteria.searchTerm"
              placeholder="Search by name or description"
              (input)="onFilterChange()"
              class="search-input"
            >
            <button
              *ngIf="criteria.searchTerm"
              matSuffix
              mat-icon-button
              aria-label="Clear"
              (click)="clearSearch()"
              class="clear-button"
              matTooltip="Clear search"
            >
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>

          <mat-form-field appearance="outline" class="status-field">
            <mat-label>Status</mat-label>
            <mat-icon matPrefix class="status-icon">category</mat-icon>
            <mat-select [(ngModel)]="criteria.status" (selectionChange)="onFilterChange()">
              <mat-option value="All">All Statuses</mat-option>
              <mat-option value="New">New</mat-option>
              <mat-option value="Recommended">Recommended</mat-option>
              <mat-option value="Not Recommended">Not Recommended</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="checkbox-container">
            <mat-checkbox
              [(ngModel)]="criteria.showInactive"
              (change)="onFilterChange()"
              color="primary"
              class="inactive-checkbox"
            >
              <span class="checkbox-label">Show Inactive APIs</span>
            </mat-checkbox>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .filter-card {
      margin-bottom: var(--spacing-lg);
      border-radius: var(--radius-lg);
      overflow: hidden;
      position: relative;
      background-color: var(--surface-color);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--divider-color);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .filter-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .card-accent-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      z-index: 1;
    }

    mat-card-header {
      padding: var(--spacing-md) var(--spacing-lg);
      background-color: var(--surface-color);
      border-bottom: 1px solid var(--divider-color);
      color: var(--text-primary);
    }

    .header-content {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .header-icon {
      margin-right: var(--spacing-sm);
      font-size: 24px;
      height: 24px;
      width: 24px;
      color: var(--primary-color);
    }

    mat-card-title {
      font-family: var(--font-heading);
      font-weight: 600;
      margin: 0;
      font-size: 1.25rem;
    }

    mat-card-content {
      padding: var(--spacing-lg);
      background-color: var(--surface-color);
    }

    .filter-container {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      align-items: flex-start;
    }

    mat-form-field {
      flex: 1;
      min-width: 200px;
    }

    .search-field {
      flex: 2;
    }

    .search-icon, .status-icon {
      color: var(--primary-color);
      margin-right: var(--spacing-xs);
    }

    .clear-button {
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    .clear-button:hover {
      color: var(--error-color);
      transform: rotate(90deg);
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      padding: var(--spacing-sm) var(--spacing-md);
      margin-top: var(--spacing-xs);
      background-color: var(--background-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
    }

    .inactive-checkbox {
      color: var(--text-secondary);
    }

    .checkbox-label {
      margin-left: var(--spacing-xs);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .filter-container {
        flex-direction: column;
      }

      mat-form-field {
        width: 100%;
      }

      .checkbox-container {
        width: 100%;
        margin-top: 0;
      }
    }
  `
})
export class SearchFilterComponent {
  @Output() filterChange = new EventEmitter<FilterCriteria>();

  criteria: FilterCriteria = {
    searchTerm: '',
    status: 'All',
    showInactive: false
  };

  onFilterChange(): void {
    this.filterChange.emit(this.criteria);
  }

  clearSearch(): void {
    this.criteria.searchTerm = '';
    this.onFilterChange();
  }
}
