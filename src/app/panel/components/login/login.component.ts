import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  private readonly ADMIN_PASSWORD = '123456789';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    localStorage.removeItem('admin_authenticated');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const password = this.loginForm.get('password')?.value;

      if (password === this.ADMIN_PASSWORD) {
        localStorage.setItem('admin_authenticated', 'true');
        this.router.navigate(['/panel/dashboard']);
      } else {
        this.snackBar.open('Invalid password. Please try again.', 'Close', {
          duration: 3000
        });
      }
    }
  }
}
