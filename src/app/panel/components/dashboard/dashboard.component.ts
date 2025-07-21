import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiRequest } from '../../../models/api-request.model';
import { ApiService } from '../../../services/api.service';
import { ApprovalDialogComponent } from '../approval-dialog/approval-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pendingRequests: ApiRequest[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.apiService.getPendingRequests().subscribe(requests => {
      this.pendingRequests = requests;
    });
  }

  approveRequest(request: ApiRequest): void {
    const dialogRef = this.dialog.open(ApprovalDialogComponent, {
      width: '400px',
      data: {
        title: 'Approve API Request',
        message: `Are you sure you want to approve "${request.name}"?`,
        action: 'Approve'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.approveApiRequest(request.id, result.reason).subscribe(() => {
          this.snackBar.open('API request approved successfully', 'Close', { duration: 3000 });
          this.loadPendingRequests();
        });
      }
    });
  }

  declineRequest(request: ApiRequest): void {
    const dialogRef = this.dialog.open(ApprovalDialogComponent, {
      width: '400px',
      data: {
        title: 'Decline API Request',
        message: `Are you sure you want to decline "${request.name}"?`,
        action: 'Decline',
        requireReason: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.declineApiRequest(request.id, result.reason).subscribe(() => {
          this.snackBar.open('API request declined', 'Close', { duration: 3000 });
          this.loadPendingRequests();
        });
      }
    });
  }

  logout(): void {
    localStorage.removeItem('admin_authenticated');
    this.router.navigate(['/panel/login']);
  }
}
