import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-api-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="api-form-card slide-up">
      <div class="card-accent-top"></div>
      <mat-card-header>
        <div class="header-content">
          <mat-icon class="header-icon">send</mat-icon>
          <mat-card-title>Submit API Request</mat-card-title>
        </div>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="apiForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>API Name</mat-label>
            <mat-icon matPrefix class="form-icon">label</mat-icon>
            <input matInput formControlName="name" placeholder="Enter API name">
            <mat-error *ngIf="apiForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>API Link</mat-label>
            <mat-icon matPrefix class="form-icon">link</mat-icon>
            <input matInput formControlName="link" placeholder="Enter API URL">
            <mat-error *ngIf="apiForm.get('link')?.hasError('required')">
              Link is required
            </mat-error>
            <mat-error *ngIf="apiForm.get('link')?.hasError('pattern')">
              Please enter a valid URL
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <mat-icon matPrefix class="form-icon">description</mat-icon>
            <textarea
              matInput
              formControlName="description"
              placeholder="Enter API description"
              rows="3"
            ></textarea>
            <mat-error *ngIf="apiForm.get('description')?.hasError('required')">
              Description is required
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="apiForm.invalid"
              class="submit-button"
              matTooltip="Submit this API for review"
            >
              <mat-icon>send</mat-icon>
              Submit Request
            </button>
            <button
              mat-button
              type="button"
              (click)="resetForm()"
              class="reset-button"
              matTooltip="Clear all fields"
            >
              <mat-icon>refresh</mat-icon>
              Reset
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .api-form-card {
      margin-bottom: var(--spacing-lg);
      border-radius: var(--radius-lg);
      overflow: hidden;
      position: relative;
      background-color: var(--surface-color);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--divider-color);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .api-form-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .card-accent-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
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

    .full-width {
      width: 100%;
      margin-bottom: var(--spacing-md);
    }

    .form-icon {
      color: var(--primary-color);
      margin-right: var(--spacing-xs);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-lg);
      justify-content: flex-end;
    }

    .submit-button {
      background-color: var(--primary-color);
      color: white;
      transition: all 0.3s ease;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
    }

    .submit-button:hover:not([disabled]) {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .submit-button[disabled] {
      opacity: 0.7;
    }

    .reset-button {
      transition: all 0.3s ease;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
    }

    .reset-button:hover {
      background-color: var(--background-color);
      transform: translateY(-2px);
    }

    .reset-button mat-icon, .submit-button mat-icon {
      margin-right: var(--spacing-xs);
    }

    @media (max-width: 600px) {
      .form-actions {
        flex-direction: column;
      }

      .submit-button, .reset-button {
        width: 100%;
      }
    }
  `
})
export class ApiFormComponent {
  apiForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.apiForm = this.fb.group({
      name: ['', Validators.required],
      link: ['', [
        Validators.required,
        Validators.pattern('https?://.+')
      ]],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.apiForm.valid) {
      this.apiService.submitRequest(this.apiForm.value).subscribe({
        next: () => {
          this.snackBar.open('Your API request has been submitted for review!', 'Close', {
            duration: 5000,
            panelClass: 'success-snackbar'
          });
          this.resetForm();
        },
        error: (error) => {
          console.error('Error submitting API request:', error);
          this.snackBar.open('Error submitting API request. Please try again.', 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }

  resetForm(): void {
    this.apiForm.reset();
  }
}
